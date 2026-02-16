import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useDispatch } from 'react-redux';
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

const PriceStarFilter: React.FC<PriceStarFilterProps> = ({
  visible,
  initialValues,
  onCancel,
  onConfirm,
}) => {
  const dispatch = useDispatch();
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
  const handleStarChange = (star: StarOption | undefined) => {
    setFilterResult(prev => ({ ...prev, star }));
  };

  // 清空筛选条件
  const handleClear = () => {
    setFilterResult({});
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
      if (filterResult.price.selectedOption) {
        const { min, max } = filterResult.price.selectedOption;
        priceRange = [min, max === Infinity ? 9999 : max];
      } else if (filterResult.price.customRange) {
        priceRange = filterResult.price.customRange;
      }
    }

    // 处理星级同步到redux
    const starLevels = filterResult.star ? [filterResult.star.value] : [];

    // 更新redux
    dispatch(setFilters({
      priceRange,
      starLevels
    }));

    // 回调给父组件
    onConfirm(filterResult);
    onCancel();
  };

  // 弹窗未显示时不渲染
  if (!visible) return null;

  return (
    <View className="price-star-modal" onClick={onCancel}>
      <View className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 弹窗头部 */}
        <View className="modal-header">
          <Text className="modal-title">选择价格/星级</Text>
          <Text className="close-icon" onClick={onCancel}>✕</Text>
        </View>

        {/* 价格筛选 */}
        <PriceFilter
          initialValue={filterResult.price}
          onPriceChange={handlePriceChange}
        />

        {/* 星级筛选 */}
        <StarFilter
          initialValue={filterResult.star}
          onStarChange={handleStarChange}
        />

        {/* 底部按钮 */}
        <View className="modal-footer">
          <button className="btn-reset" onClick={handleClear}>清空</button>
          <button className="btn-confirm" onClick={handleConfirm}>完成</button>
        </View>
      </View>
    </View>
  );
};

export default PriceStarFilter;