import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import PriceStarFilter from './PriceStarFilter';
import { FilterResult, PriceRangeOption, StarOption } from './types';
import { RootState } from '../../store';
import './style.scss';

const SearchCardPriceAndRate: React.FC = () => {
  // 弹窗显示状态
  const [modalVisible, setModalVisible] = useState(false);
  // 筛选结果状态
  const [filterResult, setFilterResult] = useState<FilterResult>({});
  
  // 从redux获取筛选条件
  const { priceRange, starLevels } = useSelector((state: RootState) => state.search.filters);

  // 同步redux数据到组件状态
  useEffect(() => {
    const newResult: FilterResult = {};
    
    // 处理价格区间
    if (priceRange) {
      // 匹配预设价格区间
      const matchedOption = [
        { id: '1', label: '¥250以下', min: 0, max: 250 },
        { id: '2', label: '¥250-¥350', min: 250, max: 350 },
        { id: '3', label: '¥350-¥450', min: 350, max: 450 },
        { id: '4', label: '¥450-¥500', min: 450, max: 500 },
        { id: '5', label: '¥500-¥800', min: 500, max: 800 },
        { id: '6', label: '¥800-¥1100', min: 800, max: 1100 },
        { id: '7', label: '¥1100-¥1400', min: 1100, max: 1400 },
        { id: '8', label: '¥1400以上', min: 1400, max: Infinity },
      ].find(option => 
        option.min === priceRange[0] && 
        (option.max === priceRange[1] || (option.max === Infinity && priceRange[1] >= 1400))
      );

      if (matchedOption) {
        newResult.price = { selectedOption: matchedOption };
      } else {
        newResult.price = { customRange: priceRange };
      }
    }

    // 处理星级
    if (starLevels.length > 0) {
      const starValue = starLevels[0];
      const matchedStar = [
        { id: '2', label: '2钻/星及以下', desc: '经济', value: 2 },
        { id: '3', label: '3钻/星', desc: '舒适', value: 3 },
        { id: '4', label: '4钻/星', desc: '高档', value: 4 },
        { id: '5', label: '5钻/星', desc: '豪华', value: 5 },
        { id: 'gold', label: '金钻酒店', desc: '奢华体验', value: 6 },
        { id: 'platinum', label: '铂钻酒店', desc: '超奢品质', value: 7 },
      ].find(star => star.value === starValue);
      
      if (matchedStar) {
        newResult.star = matchedStar;
      }
    }

    setFilterResult(newResult);
  }, [priceRange, starLevels]);

  // 格式化显示文本
  const getDisplayText = () => {
    const parts: string[] = [];
    
    // 价格文本
    if (filterResult.price) {
      if (filterResult.price.selectedOption) {
        parts.push(filterResult.price.selectedOption.label);
      } else if (filterResult.price.customRange) {
        const [min, max] = filterResult.price.customRange;
        if (max >= 1500) {
          parts.push(`¥${min}以上`);
        } else {
          parts.push(`¥${min}-¥${max}`);
        }
      }
    }

    // 星级文本
    if (filterResult.star) {
      parts.push(filterResult.star.label);
    }

    return parts.length > 0 ? parts.join(' | ') : '价格/星级';
  };

  // 确认筛选结果
  const handleConfirm = (result: FilterResult) => {
    setFilterResult(result);
  };

  return (
    <View>
      {/* 触发组件 */}
      <View 
        className="search-card-price-rate"
        onClick={() => setModalVisible(true)}
      >
        <View className="trigger-content">
          <Text className={`trigger-text ${filterResult.price || filterResult.star ? 'has-value' : ''}`}>
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
};

export default SearchCardPriceAndRate;