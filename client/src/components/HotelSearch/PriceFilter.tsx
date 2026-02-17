import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { Range } from '@nutui/nutui-react-taro';
import { PriceRangeOption, FilterResult } from './types';
import './style.scss';

// 预设价格区间选项
const PRICE_OPTIONS: PriceRangeOption[] = [
  { id: '1', label: '¥250以下', minPrice: 0, maxPrice: 250 },
  { id: '2', label: '¥250-¥350', minPrice: 250, maxPrice: 350 },
  { id: '3', label: '¥350-¥450', minPrice: 350, maxPrice: 450 },
  { id: '4', label: '¥450-¥500', minPrice: 450, maxPrice: 500 },
  { id: '5', label: '¥500-¥800', minPrice: 500, maxPrice: 800 },
  { id: '6', label: '¥800-¥1100', minPrice: 800, maxPrice: 1100 },
  { id: '7', label: '¥1100-¥1400', minPrice: 1100, maxPrice: 1400 },
  { id: '8', label: '¥1400以上', minPrice: 1400, maxPrice: Infinity },
];

interface PriceFilterProps {
  initialValue?: FilterResult['price'];
  onPriceChange: (price: FilterResult['price']) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ initialValue, onPriceChange }) => {
  // 自定义价格区间状态
  const [customRange, setCustomRange] = useState<[number, number]>([0, 1500]);
  // 选中的价格区间选项状态
  const [selectedOption, setSelectedOption] = useState<PriceRangeOption | null>(null);

  // 初始化值
  useEffect(() => {
    if (initialValue) {
      // 1. 优先初始化选中的预设区间
      if (initialValue.selectedOptions?.length === 1) {
        const targetOption = initialValue.selectedOptions[0];
        setSelectedOption(targetOption);
        // 同步滑块值到该区间的最小/最大值
        const sliderMax = targetOption.maxPrice === Infinity ? 1500 : targetOption.maxPrice;
        setCustomRange([targetOption.minPrice, sliderMax]);
      }
      // 2. 初始化自定义滑块区间
      else if (initialValue.slidedRange) {
        setCustomRange(initialValue.slidedRange);
        setSelectedOption(null);
        // 自动匹配滑块值对应的预设区间
        matchRangeToOption(initialValue.slidedRange);
      }
    } else {
      // 重置状态
      setSelectedOption(null);
      setCustomRange([0, 1500]);
    }
  }, [initialValue]);

  // 核心：根据滑块值匹配对应的预设区间
  const matchRangeToOption = (range: [number, number]) => {
    const [min, max] = range;
    // 遍历预设区间，找到完全匹配的区间
    const matchedOption = PRICE_OPTIONS.find(option => {
      // 处理“1400以上”的特殊情况
      if (option.maxPrice === Infinity) {
        return min >= 1400 && max >= 1400;
      }
      // 其他区间：滑块最小值=区间min，最大值=区间max
      return min === option.minPrice && max === option.maxPrice;
    });
    setSelectedOption(matchedOption || null);
  };

  // NutUI Range滑块变化处理（联动预设区间）
  const handleRangeChange = (value: number[]) => {
    const newRange = [Math.round(value[0]), Math.round(value[1])] as [number, number];
    // 保证最小值 <= 最大值
    if (newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    }
    setCustomRange(newRange);
    // 滑块拖动时，清空手动选中的预设区间，自动匹配
    setSelectedOption(null);
    matchRangeToOption(newRange);
    // 回调父组件（滑块值优先级高于预设区间）
    onPriceChange({ 
      slidedRange: newRange,
      selectedOptions: selectedOption ? [selectedOption] : [] 
    });
  };

  // 预设价格区间点击处理
  const handleOptionClick = (option: PriceRangeOption) => {
    // 单选逻辑：直接赋值
    setSelectedOption(option);
    // 同步滑块值到该区间的最小/最大值
    const sliderMax = option.maxPrice === Infinity ? 1500 : option.maxPrice;
    const newRange = [option.minPrice, sliderMax] as [number, number];
    setCustomRange(newRange);
    // 回调父组件（预设区间优先级高于滑块值）
    onPriceChange({ 
      selectedOptions: [option], // 单选：数组仅包含当前选中项
      slidedRange: newRange // 同步滑块值到回调
    });
  };

  return (
    <View className="price-filter">
      <View className="price-filter-title">价格</View>
      {/* 价格滑块范围显示 */}
      <View className="price-filter-range-display">
        <View>¥0</View>
        <View>¥1400以上</View>
      </View>

      {/* NutUI Range双滑块组件 */}
      <Range
        className='Pri'
        defaultValue={customRange}
        range={true}
        min={0}
        max={1500}
        minDescription={null}
        maxDescription={null}
        step={100}
        onChange={handleRangeChange} // 实时联动
        onEnd={handleRangeChange} // 结束时联动
      />

      {/* 预设价格区间选项 */}
      <View className="price-options">
        {PRICE_OPTIONS.map((option) => (
          <View key={option.id} className="price-option-item">
            <View
              className={`option-btn ${selectedOption?.id === option.id ? 'active' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PriceFilter;