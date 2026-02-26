// 酒店列表页 - 排序
import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setSortType,
  resetHomeList,
  fetchHomeList,
  setFilters,
} from "../../store/slices/homelistSlice";
import { RootState } from "../../store";
import PriceStarFilter from "../HotelSearch/PriceStarFilter";
import { FilterResult } from "../../store/slices/priceStarSlice";
import "../../styles/HotelList.scss";

type SortType =
  | "default"
  | "rating"
  | "originalPrice"
  | "currentPrice"
  | "priceStar";

const sortOptions = [
  { key: "default" as SortType, label: "默认排序" },
  { key: "rating" as SortType, label: "评分排序" },
  { key: "originalPrice" as SortType, label: "原价排序" },
  { key: "currentPrice" as SortType, label: "现价排序" },
  { key: "priceStar" as SortType, label: "价格/星级" },
];

export default function SearchOrder() {
  const dispatch = useAppDispatch();
  const activeSort = useAppSelector(
    (state: RootState) => state.homelist.sortType,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [filterResult, setFilterResult] = useState<FilterResult>({});

  const handleSortClick = (sortType: SortType) => {
    if (sortType === "default") {
      // 默认排序：重置列表并重新获取数据
      dispatch(resetHomeList());
      dispatch(fetchHomeList());
    } else if (sortType === "priceStar") {
      // 价格/星级排序：打开筛选弹窗
      setModalVisible(true);
    }
    dispatch(setSortType(sortType));
  };

  // 确认筛选结果
  const handleConfirm = (result: FilterResult) => {
    setFilterResult(result);

    // 处理价格区间
    let priceRange: [number, number] | null = null;
    if (result.price) {
      if (result.price.slidedRange) {
        priceRange = result.price.slidedRange;
      } else if (
        result.price.selectedOptions &&
        result.price.selectedOptions.length > 0
      ) {
        const targetOption = result.price.selectedOptions[0];
        priceRange = [
          targetOption.minPrice,
          targetOption.maxPrice === Infinity ? 2200 : targetOption.maxPrice,
        ];
      }
    }

    // 处理星级
    const starLevels = result.stars
      ? result.stars.map((star) => star.value)
      : [];

    // 应用筛选
    dispatch(setFilters({ priceRange, starLevels }));

    setModalVisible(false);
  };

  return (
    <View className="search-order">
      {sortOptions.map((option) => (
        <View
          key={option.key}
          className={`search-order-item ${activeSort === option.key ? "active" : ""}`}
          onClick={() => handleSortClick(option.key)}
        >
          <Text className="search-order-item-text">{option.label}</Text>
        </View>
      ))}
      {/* 价格/星级筛选弹窗 */}
      <PriceStarFilter
        visible={modalVisible}
        initialValues={filterResult}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
    </View>
  );
}
