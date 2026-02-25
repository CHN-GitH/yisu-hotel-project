// 酒店详情页 - 房型选择
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { InputNumber } from '@nutui/nutui-react-taro';
import { HouseDetailData, HousePicItem } from '../../services/modules/detail';
import '../../styles/HotelDetail.scss';

// 房型数据接口
export interface RoomType {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  bedInfo: string;
  areaInfo: string;
  count: number;
}

// 统计数据接口
export interface RoomStats {
  totalCount: number;
  totalPrice: number;
  selectedRooms: RoomType[];
}

// 组件Props接口
export interface TypeChooseProps {
  // 完整的房屋详情数据
  detaildata: HouseDetailData | Record<string, never>;
  // 选择变化回调
  onSelectionChange?: (selectedRooms: RoomType[], totalCount: number, totalPrice: number) => void;
  // 统计数据变化回调
  onStatsChange?: (stats: RoomStats) => void;
  // 最大可选房间数限制
  maxSelectLimit?: number;
}

// 生成随机价格的辅助函数
const generateRandomPrice = (basePrice: number, minOffset: number, maxOffset: number): number => {
  const offset = Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;
  return basePrice + offset;
};

// 打乱数组并取指定数量的元素
const getRandomImages = (pics: HousePicItem[], count: number): string[] => {
  if (!pics || pics.length === 0) return [];
  // 过滤出有效的卧室图片（enumPictureCategory: 2 表示卧室）
  const bedroomPics = pics.filter(pic => pic.enumPictureCategory === 2);
  // 如果没有卧室图片，使用所有图片
  const availablePics = bedroomPics.length >= count ? bedroomPics : pics;
  const shuffled = [...availablePics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(pic => pic.url);
};

export default function TypeChoose ({ detaildata, onSelectionChange, onStatsChange, maxSelectLimit = 99 }: TypeChooseProps) {
  // 从 detaildata 中提取所需数据
  const { basePrice, housePics, houseSummary, isValid } = useMemo(() => {
    // 检查数据是否有效
    const hasData = (data: HouseDetailData | Record<string, never>): data is HouseDetailData => {
      return 'mainPart' in data && data.mainPart !== undefined && 'currentHouse' in data;
    };
    if (!hasData(detaildata)) {
      return {
        basePrice: 0,
        housePics: [],
        houseSummary: [],
        isValid: false
      };
    }
    const currentHouse = detaildata.currentHouse;
    const facilityModule = detaildata.mainPart?.dynamicModule?.facilityModule;
    // 获取基础价格（使用 finalPrice 或 productPrice）
    const price = currentHouse?.finalPrice 
      ? parseInt(currentHouse.finalPrice, 10) 
      : currentHouse?.productPrice 
        ? parseInt(currentHouse.productPrice.replace(/[^\d]/g, ''), 10)
        : 338; // 默认价格
    // 获取图片列表
    const pics = detaildata.mainPart?.topModule?.housePicture?.housePics || [];
    // 获取房屋摘要信息
    const summary = facilityModule?.houseSummary || [];

    return {
      basePrice: price,
      housePics: pics,
      houseSummary: summary,
      isValid: true
    };
  }, [detaildata]);

  // 提取床型信息和面积信息
  const bedInfo = useMemo(() => {
    // 从 houseSummary 第三个对象获取 tips，或从 bedSizeDetailInfo 获取
    const facilityModule = (detaildata as HouseDetailData)?.mainPart?.dynamicModule?.facilityModule;
    const bedSizeInfo = facilityModule?.houseFacility?.bedSizeDetailInfo;
    if (bedSizeInfo?.houseTips && bedSizeInfo.houseTips.length > 0) {
      return bedSizeInfo.houseTips[0];
    }
    // 从 houseSummary 中查找
    const bedItem = houseSummary.find((item: any) => item?.tips && item.tips.length > 0);
    return bedItem?.tips?.[0] || '大床2×1.8米 1张';
  }, [houseSummary, detaildata]);

  const areaInfo = useMemo(() => {
    // 从 houseSummary 第一个对象获取 text
    const areaItem = houseSummary.find((item: any) => 
      item?.text?.includes('㎡') || item?.text?.includes('公寓') || item?.text?.includes('整套')
    );
    return areaItem?.text || '酒店式公寓70㎡';
  }, [houseSummary]);

  // 初始化房型列表
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(() => {
    if (!isValid || basePrice <= 0) return [];
    // 随机选择5张不同的图片
    const selectedImages = getRandomImages(housePics, 5);
    // 如果图片不足，使用默认图片填充
    const defaultImage = (detaildata as HouseDetailData)?.currentHouse?.defaultPictureURL || 
      'https://pic.tujia.com/upload/landlordunit/day_200105/thumb/202001051429207308_700_467.jpg';
    while (selectedImages.length < 5) {
      selectedImages.push(defaultImage);
    }

    // 生成价格（确保互不相同）
    const simplePrice = generateRandomPrice(basePrice, -30, -20);
    let luxuryPrice = generateRandomPrice(basePrice, 30, 55);
    let viewPrice = generateRandomPrice(basePrice, 56, 78);
    let familyPrice = generateRandomPrice(basePrice, 79, 100);
    // 确保价格互不相同
    while (luxuryPrice === viewPrice || luxuryPrice === familyPrice || viewPrice === familyPrice) {
      luxuryPrice = generateRandomPrice(basePrice, 30, 55);
      viewPrice = generateRandomPrice(basePrice, 56, 78);
      familyPrice = generateRandomPrice(basePrice, 79, 100);
    }

    const types: Omit<RoomType, 'count'>[] = [{
      id: 'simple',
      name: '简约大床房',
      price: simplePrice,
      imageUrl: selectedImages[0],
      bedInfo,
      areaInfo
    }, {
      id: 'classic',
      name: '经典大床房',
      price: basePrice,
      imageUrl: selectedImages[1],
      bedInfo,
      areaInfo
    }, {
      id: 'view',
      name: '外景大床房',
      price: viewPrice,
      imageUrl: selectedImages[2],
      bedInfo,
      areaInfo
    }, {
      id: 'luxury',
      name: '奢华大床房',
      price: luxuryPrice,
      imageUrl: selectedImages[3],
      bedInfo,
      areaInfo
    }, {
      id: 'family',
      name: '家庭套房',
      price: familyPrice,
      imageUrl: selectedImages[4],
      bedInfo,
      areaInfo
    }];

    // 按价格从低到高排序
    const sortedTypes = types.sort((a, b) => a.price - b.price);

    // 添加count字段
    return sortedTypes.map(type => ({
      ...type,
      count: 0
    }));
  });

  // 当 basePrice 或数据源变化时重新生成房型
  useEffect(() => {
    if (!isValid || basePrice <= 0) {
      setRoomTypes([]);
      return;
    }
    // 随机选择5张不同的图片
    const selectedImages = getRandomImages(housePics, 5);
    const defaultImage = (detaildata as HouseDetailData)?.currentHouse?.defaultPictureURL || 
      'https://pic.tujia.com/upload/landlordunit/day_200105/thumb/202001051429207308_700_467.jpg';
    while (selectedImages.length < 5) {
      selectedImages.push(defaultImage);
    }

    // 生成价格（确保互不相同）
    const simplePrice = generateRandomPrice(basePrice, -30, -20);
    let luxuryPrice = generateRandomPrice(basePrice, 30, 55);
    let viewPrice = generateRandomPrice(basePrice, 56, 78);
    let familyPrice = generateRandomPrice(basePrice, 79, 100);
    // 确保价格互不相同
    while (luxuryPrice === viewPrice || luxuryPrice === familyPrice || viewPrice === familyPrice) {
      luxuryPrice = generateRandomPrice(basePrice, 30, 55);
      viewPrice = generateRandomPrice(basePrice, 56, 78);
      familyPrice = generateRandomPrice(basePrice, 79, 100);
    }

    const types: Omit<RoomType, 'count'>[] = [{
      id: 'simple',
      name: '简约大床房',
      price: simplePrice,
      imageUrl: selectedImages[0],
      bedInfo,
      areaInfo
    }, {
      id: 'classic',
      name: '经典大床房',
      price: basePrice,
      imageUrl: selectedImages[1],
      bedInfo,
      areaInfo
    }, {
      id: 'view',
      name: '外景大床房',
      price: viewPrice,
      imageUrl: selectedImages[2],
      bedInfo,
      areaInfo
    }, {
      id: 'luxury',
      name: '奢华大床房',
      price: luxuryPrice,
      imageUrl: selectedImages[3],
      bedInfo,
      areaInfo
    }, {
      id: 'family',
      name: '家庭套房',
      price: familyPrice,
      imageUrl: selectedImages[4],
      bedInfo,
      areaInfo
    }];
    // 按价格从低到高排序
    const sortedTypes = types.sort((a, b) => a.price - b.price);
    setRoomTypes(sortedTypes.map(type => ({
      ...type,
      count: 0
    })));
  }, [basePrice, housePics, bedInfo, areaInfo, isValid, detaildata]);

  // 计算统计信息
  const statistics = useMemo(() => {
    const totalCount = roomTypes.reduce((sum, room) => sum + room.count, 0);
    const totalPrice = roomTypes.reduce((sum, room) => sum + room.price * room.count, 0);
    const selectedRooms = roomTypes.filter(room => room.count > 0);
    return { totalCount, totalPrice, selectedRooms };
  }, [roomTypes]);

  // 当选择变化时触发回调
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(statistics.selectedRooms, statistics.totalCount, statistics.totalPrice);
    }
    if (onStatsChange) {
      onStatsChange(statistics);
    }
  }, [statistics, onSelectionChange, onStatsChange]);

  // 处理数量变化
  const handleCountChange = useCallback((id: string, value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) || 0 : value;
    setRoomTypes(prev => prev.map(room => {
      if (room.id === id) {
        // 确保不小于0，不大于限制
        const newCount = Math.max(0, Math.min(numValue, maxSelectLimit));
        return { ...room, count: newCount };
      }
      return room;
    }));
  }, [maxSelectLimit]);

  // 格式化价格显示
  const formatPrice = (price: number): string => {
    return `¥${price}`;
  };

  // 如果没有有效数据，显示空状态
  if (!isValid || roomTypes.length === 0) {
    return (
      <View className='detail-type-choose detail-type-choose--empty'>
        <Text className='empty-text'>暂无房型数据</Text>
      </View>
    );
  }

  return (
    <View className='detail-type-choose'>
      <View className='section-title'>
        <Text className='title-text'>选择房型</Text>
        <Text className='title-sub'>价格已含优惠，选择数量预订</Text>
      </View>
      <View className='room-list'>
        {roomTypes.map((room, index) => (
          <View key={room.id} className='room-card'>
            {/* 左侧图片 */}
            <View className='room-image-wrapper'>
              <Image 
                className='room-image' 
                src={room.imageUrl} 
                mode='aspectFill'
                lazyLoad
              />
              {index === 0 && (
                <View className='room-image-tag price-tag'>最低价</View>
              )}
              {room.id === 'classic' && (
                <View className='room-image-tag recommend-tag'>推荐</View>
              )}
            </View>
            {/* 右侧信息区 */}
            <View className='room-info'>
              {/* 房型名称 */}
              <View className='room-header'>
                <Text className='room-name'>{room.name}</Text>
              </View>
              {/* 房间配置信息 */}
              <View className='room-tags'>
                <Text className='tag'>{room.bedInfo}</Text>
                <Text className='tag'>{room.areaInfo}</Text>
              </View>
              {/* 价格和数量选择 */}
              <View className='room-action'>
                <View className='price-section'>
                  <Text className='price-value'>{formatPrice(room.price)}</Text>
                  <Text className='price-unit'>/{(detaildata as HouseDetailData)?.currentHouse?.priceMark?.replace('/', '') || '晚'}</Text>
                </View>
                <View className='count-section'>
                  <InputNumber
                    value={room.count}
                    min={0}
                    max={maxSelectLimit}
                    step={1}
                    onChange={(value) => handleCountChange(room.id, value)}
                    inputWidth={60}
                    buttonSize={28}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};