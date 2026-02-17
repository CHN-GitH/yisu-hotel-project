import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useAppDispatch } from '../../store/hooks';
import PriceFilter from './PriceFilter';
import StarFilter from './StarFilter';
import { FilterResult, PriceRangeOption, StarOption } from './types';
import { setFilters } from '../../store/slices/searchSlice';
import './style.scss';

interface PriceStarFilterProps {
  visible: boolean;
  initialValues?: FilterResult;
  onCancel: () => void;
  onConfirm: (result: FilterResult) => void;
}

export default function PriceStarFilter({ visible, initialValues, onCancel, onConfirm }: PriceStarFilterProps) {
  const dispatch = useAppDispatch();
  // 筛选结果状态
  const [filterResult, setFilterResult] = useState<FilterResult>({});

  // 初始化筛选值
  useEffect(() => {
    if (initialValues && visible) {
      setFilterResult({ ...initialValues });
    } else if (!visible) {
      setFilterResult({});
    }
  }, [initialValues, visible]);

  // 价格变化处理
  const handlePriceChange = (price: FilterResult['price']) => {
    setFilterResult(prev => ({ ...prev, price }));
  };

  // 星级变化处理
  const handleStarChange = (stars: StarOption[]) => {
    setFilterResult(prev => ({ ...prev, stars }));
  };

  // 清空筛选条件
  const handleClear = () => {
    setFilterResult({
      price: {
        slidedRange: null,
        selectedOptions: []
      },
      stars: []
    });
    // 同步到redux
    dispatch(setFilters({
      priceRange: null,
      starLevels: []
    }));
  };

  // 确认筛选结果
  const handleConfirm = () => {
    // 处理价格区间同步到redux
    let priceRange: [number, number] | null = null;
    if (filterResult.price) {
      // 自定义区间优先级高于预设区间
      if (filterResult.price.slidedRange) {
        priceRange = filterResult.price.slidedRange;
      } else if (filterResult.price.selectedOptions && filterResult.price.selectedOptions.length > 0) {
        // 多选预设区间时，取最小min和最大max
        const mins = filterResult.price.selectedOptions.map(item => item.minPrice);
        const maxs = filterResult.price.selectedOptions.map(item => item.maxPrice === Infinity ? 9999 : item.maxPrice);
        priceRange = [Math.min(...mins), Math.max(...maxs)];
      }
    }

    // 处理星级同步到redux
    const starLevels = filterResult.stars ? filterResult.stars.map(star => star.value) : [];

    // 更新redux
    dispatch(setFilters({
      priceRange,
      starLevels
    }));

    // 回调给父组件 + 关闭弹窗
    onConfirm(filterResult);
    onCancel(); // 修复：确认后关闭弹窗
  };

  // 弹窗未显示时不渲染
  if (!visible) return null;

  return (
    <View className="price-star-modal" onClick={onCancel}>
      <View className="modal-content" onClick={(e) => e.stopPropagation()}>
        <View className="modal-content-header">
          <Text className="close-icon" onClick={onCancel}>✕</Text>
          <Text className="modal-content-header-title">选择价格/星级</Text>
        </View>
        <PriceFilter
          initialValue={filterResult.price}
          onPriceChange={handlePriceChange}
        />
        <StarFilter
          initialValue={filterResult.stars}
          onStarChange={handleStarChange}
        />
        <View className="modal-content-footer">
          <button className="modal-content-footer-reset" onClick={handleClear}>清空</button>
          <button className="modal-content-footer-confirm" onClick={handleConfirm}>完成</button>
        </View>
      </View>
    </View>
  );
};