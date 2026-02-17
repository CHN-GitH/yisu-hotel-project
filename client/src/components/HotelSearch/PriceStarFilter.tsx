import React, { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { useAppDispatch } from "../../store/hooks";
import PriceFilter from "./PriceFilter";
import StarFilter from "./StarFilter";
import { FilterResult, StarOption } from "../../store/slices/priceStarSlice";
import { setFilters } from "../../store/slices/searchSlice";
import '../../styles/HotelSearch.scss';

interface PriceStarFilterProps {
  visible: boolean;
  initialValues?: FilterResult;
  onCancel: () => void;
  onConfirm: (result: FilterResult) => void;
}

export default function PriceStarFilter({ visible, initialValues, onCancel, onConfirm }: PriceStarFilterProps) {
  const dispatch = useAppDispatch();
  // 筛选结果状态
  const [filterResult, setFilterResult] = useState<FilterResult>({
    price: { slidedRange: [0, 1500], selectedOptions: [] }, // 默认最大范围
    stars: [],
  });

  // 初始化筛选值
  useEffect(() => {
    if (initialValues && visible) {
      // 兼容初始值为空的情况，设置默认最大范围
      const initPrice = initialValues.price || {
        slidedRange: [0, 1500],
        selectedOptions: [],
      };
      const initStars = initialValues.stars || [];
      setFilterResult({
        price: {
          slidedRange: initPrice.slidedRange || [0, 1500], // 无值时设为最大范围
          selectedOptions: initPrice.selectedOptions || [],
        },
        stars: initStars,
      });
    }
  }, [initialValues, visible]);

  // 价格变化处理
  const handlePriceChange = (price: FilterResult["price"]) => {
    setFilterResult((prev) => ({ ...prev, price }));
  };

  // 星级变化处理
  const handleStarChange = (stars: StarOption[]) => {
    setFilterResult((prev) => ({ ...prev, stars }));
  };

  // 清空筛选条件
  const handleClear = () => {
    // 重置redux，清空触发组件显示
    dispatch(
      setFilters({
        priceRange: null,
        starLevels: [],
      }),
    );
    // 重置弹窗内状态
    setFilterResult({
      price: {
        slidedRange: [0, 1500],
        selectedOptions: [],
      },
      stars: [],
    });
  };

  // 确认筛选结果
  const handleConfirm = () => {
    // 处理价格区间同步到redux
    let priceRange: [number, number] | null = null;
    if (filterResult.price) {
      // 自定义区间优先级高于预设区间
      if (filterResult.price.slidedRange) {
        priceRange = filterResult.price.slidedRange;
      } else if (
        filterResult.price.selectedOptions &&
        filterResult.price.selectedOptions.length > 0
      ) {
        const targetOption = filterResult.price.selectedOptions[0];
        priceRange = [
          targetOption.minPrice,
          targetOption.maxPrice === Infinity ? 1500 : targetOption.maxPrice,
        ];
      }
    }
    // 处理星级同步到redux
    const starLevels = filterResult.stars
      ? filterResult.stars.map((star) => star.value)
      : [];
    // 更新redux
    dispatch(setFilters({ priceRange, starLevels }));
    // 回调给父组件 + 关闭弹窗
    onConfirm(filterResult);
    onCancel();
  };

  // 弹窗未显示时不渲染
  if (!visible) return null;

  return (
    <View className="price-star-modal" onClick={onCancel}>
      <View className="modal-content" onClick={(e) => e.stopPropagation()}>
        <View className="modal-content-header">
          <Text className="close-icon" onClick={onCancel}>
            ✕
          </Text>
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
          <button className="modal-content-footer-reset" onClick={handleClear}>
            清空
          </button>
          <button
            className="modal-content-footer-confirm"
            onClick={handleConfirm}
          >
            完成
          </button>
        </View>
      </View>
    </View>
  );
}
