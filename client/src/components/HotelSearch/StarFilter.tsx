// 酒店查询页 - 弹出框星级
import React, { useState, useEffect, useCallback } from "react";
import Taro from '@tarojs/taro';
import { View } from "@tarojs/components";
import { StarOption, FilterResult } from "../../store/slices/priceStarSlice";
import '../../styles/HotelSearch.scss';

// 预设星级选项
const STAR_OPTIONS: StarOption[] = [
  { id: "21", label: "2钻/星及以下", desc: "经济", value: 2 },
  { id: "22", label: "3钻/星", desc: "舒适", value: 3 },
  { id: "23", label: "4钻/星", desc: "高档", value: 4 },
  { id: "24", label: "5钻/星", desc: "豪华", value: 5 },
  { id: "25", label: "金钻酒店", desc: "奢华体验", value: 6 },
  { id: "26", label: "铂钻酒店", desc: "超奢品质", value: 7 },
];

interface StarFilterProps {
  initialValue?: FilterResult["stars"];
  onStarChange: (stars: StarOption[]) => void;
}

export default function StarFilter({ initialValue, onStarChange }: StarFilterProps) {
  // 选中的星级选项状态
  const [selectedStars, setSelectedStars] = useState<StarOption[]>([]);
  // 初始化值
  useEffect(() => {
    if (initialValue) {
      setSelectedStars([...initialValue]); // 深拷贝避免引用问题
    } else {
      setSelectedStars([]);
    }
  }, [initialValue]);

  // 星级选项点击处理
  const handleStarClick = useCallback(
    (option: StarOption) => {
      const isSelected = selectedStars.some((item) => item.id === option.id);
      let newSelectedStars: StarOption[] = [];
      if (isSelected) {
        // 取消选中
        newSelectedStars = selectedStars.filter(
          (item) => item.id !== option.id,
        );
      } else {
        // 新增选中
        newSelectedStars = [...selectedStars, option];
      }
      setSelectedStars(newSelectedStars);
      onStarChange(newSelectedStars);
    }, [selectedStars]
  );

  return (
    <View className="star-filter">
      {/* 星级标题 */}
      <View className="star-filter-title">
        <View className="star-filter-title-text">星级 / 钻级</View>
        <View className="star-filter-title-desc">
          国内星级/钻级说明 {`>`}
        </View>
      </View>
      {/* 星级选项 */}
      <View className="star-filter-options">
        {STAR_OPTIONS.map((option) => (
          <View key={option.id} className="star-options-item">
            <View
              className={`star-options-item-btn ${selectedStars.some((item) => item.id === option.id) ? "active" : ""}`}
              onClick={() => handleStarClick(option)}
            >
              <View className="star-option-label">{option.label}</View>
              <View className="star-option-desc">{option.desc}</View>
            </View>
          </View>
        ))}
      </View>
      {/* 说明文字 */}
      <View className="star-filter-desc">
        酒店未参加星级评定但设施服务达到相应水平，采用钻级分类，仅供参考
      </View>
    </View>
  );
};