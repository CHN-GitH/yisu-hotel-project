import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import { Range } from "@nutui/nutui-react-taro";
import { PriceRangeOption, FilterResult } from "../../store/slices/priceStarSlice";
import '../../styles/HotelSearch.scss';

// 预设价格区间选项
const PRICE_OPTIONS: PriceRangeOption[] = [
  { id: '11', label: '¥250以下', minPrice: 0, maxPrice: 250 },
  { id: '12', label: '¥250-¥350', minPrice: 250, maxPrice: 350 },
  { id: '13', label: '¥350-¥450', minPrice: 350, maxPrice: 450 },
  { id: '14', label: '¥450-¥500', minPrice: 450, maxPrice: 500 },
  { id: '15', label: '¥500-¥800', minPrice: 500, maxPrice: 800 },
  { id: '16', label: '¥800-¥1100', minPrice: 800, maxPrice: 1100 },
  { id: '17', label: '¥1100-¥1400', minPrice: 1100, maxPrice: 1400 },
  { id: '18', label: '¥1400以上', minPrice: 1400, maxPrice: Infinity },
];

interface PriceFilterProps {
  initialValue?: FilterResult["price"];
  onPriceChange: (price: FilterResult["price"]) => void;
}

export default function PriceFilter({ initialValue, onPriceChange }: PriceFilterProps) {
  // 自定义价格区间状态
  const [customRange, setCustomRange] = useState<[number, number]>([0, 1500]);
  // 选中的价格区间选项状态
  const [selectedOption, setSelectedOption] = useState<PriceRangeOption | null>(null);

  // 初始化值
  useEffect(() => {
    if (initialValue) {
      // 优先使用预设区间
      if (initialValue.selectedOptions?.length === 1) {
        const targetOption = initialValue.selectedOptions[0];
        setSelectedOption(targetOption);
        const sliderMax = targetOption.maxPrice === Infinity ? 1500 : targetOption.maxPrice;
        setCustomRange([targetOption.minPrice, sliderMax]);
      }
      // 其次使用滑块区间
      else if (initialValue.slidedRange) {
        setCustomRange(initialValue.slidedRange);
        const [min, max] = initialValue.slidedRange;
        const matchedOption = PRICE_OPTIONS.find((option) => {
          if (option.maxPrice === Infinity) {
            return min >= 1400 && max >= 1400;
          }
          return min === option.minPrice && max === option.maxPrice;
        });
        setSelectedOption(matchedOption || null);
      }
    } else {
      setCustomRange([0, 1500]);
      setSelectedOption(null);
    }
  }, [initialValue]);

  // 滑块变化处理
  const handleRangeChange = (value: number[]) => {
    const newRange = [Math.round(value[0]), Math.round(value[1])] as [ number, number ];
    if (newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    }
    setCustomRange(newRange);
    // 自动匹配选中项
    const matchedOption = PRICE_OPTIONS.find((option) => {
      if (option.maxPrice === Infinity) {
        return newRange[0] >= 1400 && newRange[1] >= 1400;
      }
      return newRange[0] === option.minPrice && newRange[1] === option.maxPrice;
    });
    setSelectedOption(matchedOption || null);
    // 回调父组件
    onPriceChange({
      slidedRange: newRange,
      selectedOptions: matchedOption ? [matchedOption] : [],
    });
  };

  // 预设价格区间点击处理
  const handleOptionClick = (option: PriceRangeOption) => {
    // 判断是否已选中当前选项
    const isSelected = selectedOption?.id === option.id;
    if (isSelected) {
      // 双击取消：清空选中项，滑块回归最大范围
      setSelectedOption(null);
      setCustomRange([0, 1500]);
      onPriceChange({
        slidedRange: [0, 1500],
        selectedOptions: [],
      });
    } else {
      // 首次点击：选中选项，同步滑块值
      setSelectedOption(option);
      const sliderMax = option.maxPrice === Infinity ? 1500 : option.maxPrice;
      const newRange = [option.minPrice, sliderMax] as [number, number];
      setCustomRange(newRange);
      onPriceChange({
        selectedOptions: [option],
        slidedRange: newRange,
      });
    }
  };

  // 处理滑块数值显示文本
  const getSliderValueText = (value: number, isMax: boolean) => {
    if (isMax && value === 1500) {
      return "¥1400+"
    }
    return `¥${value}`;
  };

  return (
    <View className="price-filter">
      <View className="price-filter-title">价格</View>
      {/* 价格滑块范围显示 */}
      <View className="price-filter-range-display">
        <View>¥0</View>
        <View>¥1400+</View>
      </View>
      {/* NutUI Range双滑块组件 */}
      <View className="price-filter-slider">
        <Range
          value={customRange}
          range={true}
          min={0}
          max={1500}
          minDescription={null}
          maxDescription={null}
          step={100}
          button={
            <View className="price-filter-slider-range" />
          }
          onChange={handleRangeChange}
          onEnd={handleRangeChange}
        />
        {/* 左侧滑块数值 */}
        <View
          className="price-filter-slider-left"
          style={{ left: `${(customRange[0] / 1500) * 82 + 9}%` }}
        >
          {getSliderValueText(customRange[0], false)}
        </View>
        {/* 右侧滑块数值 */}
        <View
          className="price-filter-slider-right"
          style={{ left: `${(customRange[1] / 1500) * 82 + 9}%` }}
        >
          {getSliderValueText(customRange[1], true)}
        </View>
      </View>
      {/* 预设价格区间选项 */}
      <View className="price-filter-options">
        {PRICE_OPTIONS.map((option) => (
          <View key={option.id} className="price-option-item">
            <View
              className={`price-option-item-btn ${selectedOption?.id === option.id ? 'active' : ''}`}
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