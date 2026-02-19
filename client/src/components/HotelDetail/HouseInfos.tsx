import React from 'react';
import { View, Text } from '@tarojs/components';
import { ArrowRight } from '@nutui/icons-react-taro';
import '../../styles/HotelDetail.scss';

// 标签文本类型
interface TagText {
  text: string;
  color?: string;
  border?: string | null;
  tips?: string | null;
  background?: {
    color: string;
    image: string | null;
    gradientColor: string | null;
  };
}

// 标签项类型
interface HouseTag {
  tagText?: TagText;
  tagPic?: string | null;
  tagDesc?: string | null;
  tagCode?: number;
  tagLink?: string | null;
  aloneLine?: boolean;
  childTags?: any;
}

// 评论简述类型
interface CommentBrief {
  overall: number;
  scoreTitle: string;
  commentBrief: string;
  totalCount: number;
  totalCountStr?: string;
  userAvatars?: Array<{ userAvatars: string }>;
  userAvatar?: string;
  commentTabType?: number;
  veryGoodNewHouse?: string;
  veryGoodNewHouseIcon?: string;
  healthText?: string;
  healthFlag?: number;
  sort?: string;
}

// 位置信息类型
interface NearByPosition {
  address: string;
  nearByPosition?: string | null;
  areaName?: string;
  tradeArea?: string;
}

// 组件 props 类型
interface HouseInfosProps {
  infosdata?: {
    houseName?: string;
    houseTags?: HouseTag[];
    commentBrief?: CommentBrief;
    nearByPosition?: NearByPosition;
  };
}

export default function HouseInfos({ infosdata = {} }: HouseInfosProps) {
  // 获取标签背景色和文字颜色
  const getTagStyle = (tag: HouseTag): React.CSSProperties => {
    if (!tag.tagText?.background?.color) {
      return {
        backgroundColor: '#f5f5f5',
        color: '#666'
      };
    }
    return {
      backgroundColor: tag.tagText.background.color,
      color: tag.tagText.color || '#666'
    };
  };

  return (
    <View className='house-infos-container'>
      {/* 房屋名称 */}
      <Text className='house-name'>{infosdata.houseName}</Text>
      {/* 标签 */}
      <View className='tags-wrapper'>
        {infosdata.houseTags?.map((item, index) => (
          item.tagText && (
            <Text 
              key={index} 
              className='tag-item'
              style={getTagStyle(item)}
            >
              {item.tagText.text}
            </Text>
          )
        ))}
      </View>
      {/* 评论信息 */}
      <View className='info-row comment-row'>
        <View className='left'>
          <Text className='score'>{infosdata.commentBrief?.overall}</Text>
          <Text className='title'>{infosdata.commentBrief?.scoreTitle}</Text>
          <Text className='brief'>{infosdata.commentBrief?.commentBrief}</Text>
        </View>
        <View className='right'>
          <Text className='count'>{infosdata.commentBrief?.totalCount}条评论</Text>
          <ArrowRight size={12} color='#ff9854' />
        </View>
      </View>
      {/* 位置信息 */}
      <View className='info-row position-row'>
        <View className='left'>
          <Text className='address'>{infosdata.nearByPosition?.address}</Text>
        </View>
        <View className='right'>
          <Text className='map-text'>地图·周边</Text>
          <ArrowRight size={12} color='#ff9854' />
        </View>
      </View>
    </View>
  );
};