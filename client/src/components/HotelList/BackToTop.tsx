// src\components\HotelList\BackToTop.tsx
import React from 'react';
import { View, Text } from '@tarojs/components';
import { ArrowUp } from '@nutui/icons-react-taro';
import '../../styles/HotelList.scss';

// 明确导出接口类型
export interface BackToTopProps {
  /** 滚动多少距离后显示按钮（默认 300px） */
  visibilityHeight?: number;
  /** 点击回到顶部时的滚动动画时长（默认 300ms） */
  duration?: number;
  /** 距离右侧位置（默认 20px） */
  right?: number;
  /** 距离底部位置（默认 40px） */
  bottom?: number;
  /** 当前滚动位置（必填） */
  scrollTop: number;
  /** 点击回到顶部的回调（必填） */
  onBackToTop: () => void;
}

const BackToTop: React.FC<BackToTopProps> = ({ 
  visibilityHeight = 300, 
  duration = 300,
  right = 20,
  bottom = 40,
  scrollTop,
  onBackToTop
}) => {
  // 根据传入的 scrollTop 判断是否显示
  const visible = scrollTop > visibilityHeight;

  if (!visible) return null;

  return (
    <View 
      className='back-to-top'
      style={{ right: `${right}px`, bottom: `${bottom}px` }}
      onClick={onBackToTop}
    >
      <ArrowUp size={20} color='#fff' />
      <Text className='back-to-top-text'>顶部</Text>
    </View>
  );
};

export default BackToTop;