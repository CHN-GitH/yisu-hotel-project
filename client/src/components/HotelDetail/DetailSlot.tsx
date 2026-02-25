// 酒店详情页 - 分区公共组件
import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { ArrowRight } from '@nutui/icons-react-taro';
import '../../styles/HotelDetail.scss';

interface SectionProps {
  title?: string;
  moreText?: string;
  onMoreClick?: () => void;
  children: React.ReactNode;
}

export default function DetailSlot({ title = '', moreText = '',  onMoreClick, children }: SectionProps) {
  // 如果没有更多文本，不显示底部
  const showFooter = moreText && moreText.trim() !== '';
  return (
    <View className='section-container'>
      {/* 标题头部 */}
      <View className='section-header'>
        <Text className='section-title'>{title}</Text>
      </View>
      {/* 内容区域 */}
      <View className='section-content'>
        {children}
      </View>
      {/* 底部查看更多 */}
      {showFooter && (
        <View className='section-footer' onClick={onMoreClick}>
          <Text className='more-text'>查看{moreText}</Text>
          <ArrowRight size={14} color='#ff9854' />
        </View>
      )}
    </View>
  );
};