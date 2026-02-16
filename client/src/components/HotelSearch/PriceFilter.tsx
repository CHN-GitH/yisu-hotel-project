import React, { useState, useEffect } from 'react';
import { View, Input } from '@tarojs/components';
import { PriceRangeOption, FilterResult } from './types';
import './style.scss';

// 预设价格区间选项
const PRICE_OPTIONS: PriceRangeOption[] = [
  { id: '1', label: '¥250以下', min: 0, max: 250 },
  { id: '2', label: '¥250-¥350', min: 250, max: 350 },
  { id: '3', label: '¥350-¥450', min: 350, max: 450 },
  { id: '4', label: '¥450-¥500', min: 450, max: 500 },
  { id: '5', label: '¥500-¥800', min: 500, max: 800 },
  { id: '6', label: '¥800-¥1100', min: 800, max: 1100 },
  { id: '7', label: '¥1100-¥1400', min: 1100, max: 1400 },
  { id: '8', label: '¥1400以上', min: 1400, max: Infinity },
];

interface PriceFilterProps {
  initialValue?: FilterResult['price'];
  onPriceChange: (price: FilterResult['price']) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ initialValue, onPriceChange }) => {
  // 自定义价格区间状态
  const [customRange, setCustomRange] = useState<[number, number]>([0, 1500]);
  // 选中的价格区间选项状态
  const [selectedOption, setSelectedOption] = useState<PriceRangeOption | undefined>(undefined);

  // 初始化值
  useEffect(() => {
    if (initialValue) {
      if (initialValue.customRange) {
        setCustomRange(initialValue.customRange);
      }
      if (initialValue.selectedOption) {
        setSelectedOption(initialValue.selectedOption);
        // 同步滑块值
        const { min, max } = initialValue.selectedOption;
        setCustomRange([min, max === Infinity ? 1500 : max]);
      }
    }
  }, [initialValue]);

  // 价格滑块变化处理
  const handleRangeChange = (index: 0 | 1, value: number) => {
    const newRange = [...customRange] as [number, number];
    newRange[index] = value;
    // 保证最小值 <= 最大值
    if (newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    }
    setCustomRange(newRange);
    // 清空选中的预设区间（自定义和预设二选一）
    setSelectedOption(undefined);
    onPriceChange({ customRange: newRange });
  };

  // 预设价格区间点击处理
  const handleOptionClick = (option: PriceRangeOption) => {
    setSelectedOption(option);
    // 同步更新滑块值
    setCustomRange([option.min, option.max === Infinity ? 1500 : option.max]);
    onPriceChange({ selectedOption: option });
  };

  return (
    <View className="price-filter">
      {/* 价格标题 */}
      <View className="price-title">价格</View>

      {/* 价格滑块范围显示 */}
      <View className="price-range-display">
        <View>¥{customRange[0]}</View>
        <View>{customRange[1] >= 1500 ? '¥1400以上' : `¥${customRange[1]}`}</View>
      </View>

      {/* 价格滑块 */}
      {/* <View className="price-slider">
        <View className="slider-track"> */}
          {/* 滑块轨道 */}
          {/* <View className="track-bg" />
          <View 
            className="track-active"
            style={{
              left: `${(customRange[0] / 1500) * 100}%`,
              width: `${((customRange[1] - customRange[0]) / 1500) * 100}%`
            }}
          /> */}

          {/* 最小值滑块 */}
          {/* <View 
            className="slider-thumb"
            style={{ left: `calc(${(customRange[0] / 1500) * 100}% - 0.5rem)` }}
          >
            <Input
              type="range"
              min={0}
              max={1500}
              value={customRange[0]}
              onChange={(e) => handleRangeChange(0, Number(e.target.value))}
            />
            <View className="thumb-inner">
              <View className="thumb-circle" />
            </View>
          </View> */}

          {/* 最大值滑块 */}
          {/* <View 
            className="slider-thumb"
            style={{ left: `calc(${(customRange[1] / 1500) * 100}% - 0.5rem)` }}
          >
            <Input
              type="range"
              min={0}
              max={1500}
              value={customRange[1]}
              onChange={(e) => handleRangeChange(1, Number(e.target.value))}
            />
            <View className="thumb-inner">
              <View className="thumb-circle" />
            </View>
          </View>
        </View>
      </View> */}

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