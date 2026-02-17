import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { StarOption, FilterResult } from './types';
import './style.scss';

// 预设星级选项
const STAR_OPTIONS: StarOption[] = [
  { id: '2', label: '2钻/星及以下', desc: '经济', value: 2 },
  { id: '3', label: '3钻/星', desc: '舒适', value: 3 },
  { id: '4', label: '4钻/星', desc: '高档', value: 4 },
  { id: '5', label: '5钻/星', desc: '豪华', value: 5 },
  { id: 'gold', label: '金钻酒店', desc: '奢华体验', value: 6 },
  { id: 'platinum', label: '铂钻酒店', desc: '超奢品质', value: 7 },
];

interface StarFilterProps {
  initialValue?: FilterResult['stars'];
  onStarChange: (stars: StarOption[]) => void;
}

export default function StarFilter({ initialValue, onStarChange }: StarFilterProps) {
  // 选中的星级选项状态（多选）
  const [selectedStars, setSelectedStars] = useState<StarOption[]>([]);

  // 初始化值
  useEffect(() => {
    if (initialValue) {
      setSelectedStars(initialValue);
    } else {
      setSelectedStars([]);
    }
  }, [initialValue]);

  // 星级选项点击处理
  const handleStarClick = (option: StarOption) => {
    const isSelected = selectedStars.some(item => item.id === option.id);
    let newSelectedStars: StarOption[] = [];
    
    if (isSelected) {
      // 取消选中
      newSelectedStars = selectedStars.filter(item => item.id !== option.id);
    } else {
      // 新增选中
      newSelectedStars = [...selectedStars, option];
    }
    
    setSelectedStars(newSelectedStars);
    onStarChange(newSelectedStars);
  };

  return (
    <View className="star-filter">
      {/* 星级标题 */}
      <View className="star-title">
        <View className="title-text">星级/钻级</View>
        <View className="title-desc">
          <View>国内星级/钻级说明</View>
          <View className="desc-icon">ℹ️</View>
        </View>
      </View>

      {/* 星级选项 */}
      <View className="star-options">
        {STAR_OPTIONS.map((option) => (
          <View key={option.id} className="star-option-item">
            <View
              className={`option-btn ${selectedStars.some(item => item.id === option.id) ? 'active' : ''}`}
              onClick={() => handleStarClick(option)}
            >
              <View className="option-label">{option.label}</View>
              <View className="option-desc">{option.desc}</View>
            </View>
          </View>
        ))}
      </View>

      {/* 说明文字 */}
      <View className="star-desc">
        酒店未参加星级评定但设施服务达到相应水平，采用钻级分类，仅供参考
      </View>
    </View>
  );
};