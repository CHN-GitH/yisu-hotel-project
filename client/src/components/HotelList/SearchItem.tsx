import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { HouseListItem } from '../../services/modules/homelist';
import styles from '../../styles/HotelList.scss';

interface SearchItemProps {
  itemdata?: HouseListItem;
}

const SearchItem: React.FC<SearchItemProps> = ({ itemdata }) => {
  if (!itemdata) return null;

  const { data } = itemdata;
  const starNumber = Number(data.commentScore) || 0;

  return (
    <View className='search-item'>
      <View className='search-item-image'>
        <Image 
          className='search-item-image-cover'
          src={data.image?.url}
          mode="aspectFill"
          lazyLoad
        />
      </View>
      <View className='search-item-info'>
        <View className='search-item-info-name'>
          <Text className='search-item-info-name-text'>{data.houseName}</Text>
        </View>
        <View className='search-item-info-star'>
          <Text className='search-item-info-star-number'>{starNumber}分</Text>
          <Text className='search-item-info-star-comment'>
            {starNumber >= 4.8 ? '超赞' : starNumber >= 4.8 ? '推荐' : '还可以'}
          </Text>
        </View>
        <View className='search-item-info-summary'>
          <Text className='search-item-info-summary-text'>{data.summaryText.slice(0,-5)}</Text>
        </View>
        <View className='search-item-info-location'>
          {data.location}
        </View>
        <View className='search-item-info-price'>
          <View className='search-item-price'>
            {data.priceTipBadge && (
              <Text className='search-item-price-tip'>{data.priceTipBadge.text}</Text>
            )}
            <Text className='search-item-price-final'>￥{data.finalPrice}</Text>
          </View>
          <Text className='search-item-price-original'>￥{data.productPrice}</Text>
        </View>
      </View>
    </View>
  );
};

export default SearchItem;