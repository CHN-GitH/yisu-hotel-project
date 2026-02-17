import React, { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { useSearchState } from "../../store/hooks";
import PriceStarFilter from "./PriceStarFilter";
import { FilterResult, PriceRangeOption, StarOption } from "../../store/slices/priceStarSlice";
import '../../styles/HotelSearch.scss';

export default function SearchCardPriceAndStar() {
  // 弹窗显示状态
  const [modalVisible, setModalVisible] = useState(false);
  // 筛选结果状态
  const [filterResult, setFilterResult] = useState<FilterResult>({});
  // 从redux获取筛选条件
  const { filters } = useSearchState();
  const { priceRange, starLevels } = filters;

  // 预设价格/星级选项
  const PRICE_OPTIONS: PriceRangeOption[] = [
    { id: "11", label: "¥250以下", minPrice: 0, maxPrice: 250 },
    { id: "12", label: "¥250-¥350", minPrice: 250, maxPrice: 350 },
    { id: "13", label: "¥350-¥450", minPrice: 350, maxPrice: 450 },
    { id: "14", label: "¥450-¥500", minPrice: 450, maxPrice: 500 },
    { id: "15", label: "¥500-¥800", minPrice: 500, maxPrice: 800 },
    { id: "16", label: "¥800-¥1100", minPrice: 800, maxPrice: 1100 },
    { id: "17", label: "¥1100-¥1400", minPrice: 1100, maxPrice: 1400 },
    { id: "18", label: "¥1400以上", minPrice: 1400, maxPrice: Infinity },
  ];
  const STAR_OPTIONS: StarOption[] = [
    { id: "21", label: "2钻/星及以下", desc: "经济", value: 2 },
    { id: "22", label: "3钻/星", desc: "舒适", value: 3 },
    { id: "23", label: "4钻/星", desc: "高档", value: 4 },
    { id: "24", label: "5钻/星", desc: "豪华", value: 5 },
    { id: "25", label: "金钻酒店", desc: "奢华体验", value: 6 },
    { id: "26", label: "铂钻酒店", desc: "超奢品质", value: 7 },
  ];

  // 同步redux数据到组件状态
  useEffect(() => {
    const newResult: FilterResult = {
      price: {
        slidedRange: priceRange || null,
        selectedOptions: [],
      },
      stars:
        starLevels.length > 0
          ? STAR_OPTIONS.filter((star) => starLevels.includes(star.value))
          : [],
    };
    // 匹配价格预设区间
    if (priceRange) {
      const [min, max] = priceRange;
      const matchedOption = PRICE_OPTIONS.find((option) => {
        if (option.maxPrice === Infinity) {
          return min >= 1400 && max >= 1400;
        }
        return min === option.minPrice && max === option.maxPrice;
      });
      if (matchedOption) {
        newResult.price.selectedOptions = [matchedOption];
      }
    }
    setFilterResult(newResult);
  }, [priceRange, starLevels]);

  // 格式化显示文本
  const getDisplayText = () => {
    const parts: string[] = [];
    // 价格文本
    if (filterResult.price?.slidedRange) {
      const [min, max] = filterResult.price.slidedRange;
      if (!(min === 0 && max > 1400)) {
        if (max > 1400) {
          parts.push(`¥${min}以上`);
        } else if (min === 0) {
          parts.push(`¥${max}以下`);
        } else {
          parts.push(`¥${min}-¥${max}`);
        }
      }
    }
    // 星级文本
    if (filterResult.stars && filterResult.stars.length > 0) {
      const starLabels = filterResult.stars.map((item) => item.label);
      parts.push(starLabels.join("，"));
    }
    return parts.length > 0 ? parts.join(" | ") : "价格/星级";
  };
  // 确认筛选结果
  const handleConfirm = (result: FilterResult) => {
    setFilterResult(result);
  };
  // 打开弹窗
  const openModal = () => {
    setModalVisible(true);
  };

  return (
    <View>
      {/* 触发组件 */}
      <View className="search-row" onClick={openModal}>
        <View className="search-price-star">
          <Text
            className={`search-price-star-text ${filterResult.price?.slidedRange || filterResult.stars?.length ? "has-value" : ""}`}
          >
            {getDisplayText()}
          </Text>
        </View>
      </View>
      {/* 筛选弹窗 */}
      <PriceStarFilter
        visible={modalVisible}
        initialValues={filterResult}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
    </View>
  );
}
