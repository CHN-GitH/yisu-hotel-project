// src/components/SearchItem/index.tsx
import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

interface HouseTag {
  text: string;
  color?: string;
  backgroundColor?: string;
}

interface PriceInfo {
  memberName?: string;
}

interface HotelItem {
  defaultPicture: string;
  unitName: string;
  houseTags: HouseTag[];
  address: string;
  allActiveAndRedPacket?: PriceInfo;
  productPrice: number;
  finalPrice: number;
}

interface SearchItemProps {
  itemData?: HotelItem[];
}

const SearchItem: React.FC<SearchItemProps> = ({ itemData = [] }) => {
  return (
    <View className='item-list'>
      {itemData.map((item, index) => (
        <View key={index} className='hotel-item'>
          <View className='item-body'>
            <View className='left-section'>
              <Image 
                className='hotel-img' 
                src={item.defaultPicture} 
                mode='aspectFill'
                lazyLoad
              />
              {item.houseTags?.[0] && (
                <View className='tag-badge'>
                  <Text>{item.houseTags[0].text}</Text>
                </View>
              )}
            </View>
            
            <View className='right-section'>
              <View className='hotel-name'>
                <Text className='name-text'>{item.unitName}</Text>
              </View>
              
              <View className='tag-list'>
                {item.houseTags?.slice(0, 3).map((tag, tagIndex) => (
                  <View 
                    key={tagIndex} 
                    className='tag-item'
                    style={{ 
                      backgroundColor: tag.backgroundColor || '#ff4444',
                      color: tag.color || '#fff'
                    }}
                  >
                    <Text className='tag-text'>{tag.text}</Text>
                  </View>
                ))}
              </View>
              
              <View className='info-section'>
                <Text className='info-item address'>{item.address}</Text>
                {item.allActiveAndRedPacket?.memberName && (
                  <Text className='info-item member'>
                    {item.allActiveAndRedPacket.memberName}
                  </Text>
                )}
              </View>
              
              <View className='price-section'>
                <Text className='price original-price'>
                  原价: ¥{item.productPrice}
                </Text>
                <Text className='price discount-price'>
                  优惠价: ¥{item.finalPrice}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default SearchItem;