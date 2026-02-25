// 酒店查询页 - 
import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleKeyword, setAllKeywords, clearSelectedKeywords } from '../../store/slices/keywordsSlice';
import '../../styles/HotelSearch.scss';

// 关键词数据类型
export interface KeywordItem {
  id: number
  name: string
  icon: string
}

// 组件内定义的关键词数据（上图下字结构）
const KEYWORDS_DATA: KeywordItem[] = [
  { id: 10001, name: '亲子', icon: 'https://pic.tujia.com/upload/festatic/crn/sijiahuayuan.png' },
  { id: 10002, name: '豪华', icon: 'https://pic.tujia.com/upload/festatic/crn/guanjingluotai.png' },
  { id: 10003, name: '免费停车', icon: 'https://pic.tujia.com/upload/festatic/crn/tingche.png' },
  { id: 10004, name: '行李寄存', icon: 'https://pic.tujia.com/upload/festatic/crn/xinglijicun.png' },
  { id: 10005, name: '免费接站', icon: 'https://pic.tujia.com/upload/festatic/crn/ji.png' },
  { id: 10007, name: 'AED急救', icon: 'https://pic.tujia.com/upload/festatic/crn/jijiubao.png' },
];

export default function SearchKeywords() {
  const dispatch = useAppDispatch();
  const { selectedKeywords, allKeywords } = useAppSelector((state) => state.keywords);

  // 初始化时设置所有关键词
  useEffect(() => {
    dispatch(setAllKeywords(KEYWORDS_DATA))
  }, [dispatch]);

  // 判断是否选中
  const isSelected = (id: number) => {
    return selectedKeywords.some(item => item.id === id);
  };
  // 点击切换
  const handleClick = (item: KeywordItem) => {
    dispatch(toggleKeyword(item));
  };
  // 清空选择
  const handleClear = () => {
    dispatch(clearSelectedKeywords());
  };
  // 使用 allKeywords 或本地数据渲染
  const renderKeywords = allKeywords.length > 0 ? allKeywords : KEYWORDS_DATA;

  return (
    <View className="search-keywords">      
      <ScrollView 
        className="search-keywords-scroll"
        scrollX
        showScrollbar={false}
        enhanced
      >
        <View className="search-keywords-list">
          {renderKeywords.map((item) => {
            const selected = isSelected(item.id);
            return (
              <View 
                key={item.id}
                className={`search-keywords-item ${selected ? 'search-keywords-item--active' : ''}`}
                onClick={() => handleClick(item)}
              >
                <Image 
                  className="search-keywords-icon"
                  src={item.icon.trim()}
                  mode="aspectFit"
                />
                <Text className={`search-keywords-text ${selected ? 'search-keywords-text--active' : ''}`}>
                  {item.name}
                </Text>
                {selected && (
                  <View className="search-keywords-check">
                    <Text className="search-keywords-check-icon">✓</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
      {selectedKeywords.length > 0 && (
        <View className="search-keywords-selected">
          <Text className="search-keywords-selected-text">
            已选: {selectedKeywords.map(k => k.name).join('、')}
          </Text>
          <Text 
            className="search-keywords-clear"
            onClick={handleClear}
          >
            清空
          </Text>
        </View>
      )}
    </View>
  );
};