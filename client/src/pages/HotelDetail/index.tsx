// 酒店详情页
import React, { useEffect, useState, useMemo } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import { useDispatch, useSelector } from 'react-redux';
import { NavBar, SafeArea, Loading } from '@nutui/nutui-react-taro';
import { getDetailData } from '../../store/slices/detailSlice';
import { RootState, AppDispatch } from '../../store';
import DetailBanner from '../../components/HotelDetail/DetailBanner';
import HouseInfos from '../../components/HotelDetail/HouseInfos';
import DetailFacility from '../../components/HotelDetail/DetailFacility';
import DetailHotExport from '../../components/HotelDetail/DetailHotExport';
import DetailPosition from '../../components/HotelDetail/DetailPosition';
import BookingStickyBar from '../../components/HotelDetail/DetailCalendarNumber';
import TypeChoose, { RoomStats, RoomType } from '../../components/HotelDetail/TypeChoose';
import BookingBar from '../../components/HotelDetail/BookingBar';
import { HouseDetailData } from '../../services/modules/detail';
import '../../styles/HotelDetail.scss';

export default function HotelDetail() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { detaildata, loading, error } = useSelector<RootState, RootState['detail']>(
    (state) => state.detail
  );
  const houseId = router.params.id as string || "20061007";

  // 房型选择统计数据
  const [roomStats, setRoomStats] = useState<RoomStats>({
    totalCount: 0,
    totalPrice: 0,
    selectedRooms: []
  });

  // 夜数状态
  const [nights, setNights] = useState(1);

  const onClickLeft = () => {
    Taro.navigateBack();
  };

  useEffect(() => {
    if (houseId) {
      dispatch(getDetailData(houseId));
    }
  }, [dispatch, houseId]);

  const hasData = (data: HouseDetailData | Record<string, never>): data is HouseDetailData => {
    return 'mainPart' in data && data.mainPart !== undefined;
  };

  const mainPart = hasData(detaildata) ? detaildata.mainPart : null;
  const topModule = mainPart?.topModule;
  const currentHouse = hasData(detaildata) ? detaildata.currentHouse : null;

  // 处理房型统计数据变化
  const handleRoomStatsChange = (stats: RoomStats) => {
    setRoomStats(stats);
  };

  // 处理夜数变化
  const handleNightsChange = (newNights: number) => {
    setNights(newNights);
  };

  // 处理房型选择变化（详细数据）
  const handleRoomSelectionChange = (selectedRooms: RoomType[], totalCount: number, totalPrice: number) => {
    console.log('房型选择变化:', { selectedRooms, totalCount, totalPrice });
  };

  // 计算最终显示的总价（单日总价 * 夜数）
  const finalTotalPrice = useMemo(() => {
    // 如果有选择房型，使用房型总价 * 夜数
    if (roomStats.totalCount > 0) {
      return roomStats.totalPrice * nights;
    }
    // 如果没有选择房型，使用当前房屋原价 * 夜数
    if (currentHouse?.finalPrice) {
      const basePrice = parseInt(currentHouse.finalPrice, 10);
      return basePrice * nights;
    }
    return 0;
  }, [roomStats.totalPrice, roomStats.totalCount, nights, currentHouse?.finalPrice]);

  // 计算原价（用于显示划线价）
  const originalTotalPrice = useMemo(() => {
    if (currentHouse?.productPrice && roomStats.totalCount === 0) {
      const originalPrice = parseInt(currentHouse.productPrice.replace(/[^\d]/g, ''), 10);
      return originalPrice * nights;
    }
    return null;
  }, [currentHouse?.productPrice, roomStats.totalCount, nights]);

  // 是否有选择房型
  const hasSelectedRooms = roomStats.totalCount > 0;

  return (
    <View className='detail-container'>
      <SafeArea position='top' />
      <NavBar
        back={<Text style={{'fontSize':'2.25rem','transform':'scaleX(50%)'}}>&lt;</Text>}
        onBackClick={onClickLeft}
        fixed
        safeAreaInsetTop
        className='detail-navbar'
      >
        <Text className='detail-navbar-text'>{topModule?.houseName || '房屋详情'}</Text>
      </NavBar>
      <ScrollView 
        className='detail-content' 
        scrollY 
        enableBackToTop
        enhanced
        showScrollbar={false}
      >
        {hasData(detaildata) ? (
          <View className='detail-wrapper'>
            {topModule?.housePicture?.housePics && (
              <DetailBanner bannerdata={topModule.housePicture.housePics} />
            )}
            <HouseInfos infosdata={detaildata?.mainPart?.topModule} />
            {/* 传递roomCount和onNightsChange给BookingStickyBar */}
            <BookingStickyBar 
              externalRoomCount={roomStats.totalCount} 
              onNightsChange={handleNightsChange}
            />
            <DetailFacility facilitydata={detaildata?.mainPart?.dynamicModule?.facilityModule?.houseFacility} />
            <TypeChoose 
              detaildata={detaildata} 
              onStatsChange={handleRoomStatsChange}
              onSelectionChange={handleRoomSelectionChange} 
              maxSelectLimit={10} 
            />
            <DetailPosition positiondata={detaildata?.mainPart?.dynamicModule?.positionModule} />
            <DetailHotExport hotexportdata={detaildata?.mainPart?.dynamicModule?.commentModule} />
            {currentHouse && (
              <BookingBar
                currentHouse={currentHouse}
                nights={nights}
                roomStats={roomStats}
                finalTotalPrice={finalTotalPrice}
                originalTotalPrice={originalTotalPrice}
              />
            )}
          </View>
        ) : (
          <View className='empty-wrapper'>
            <Text className='empty-text'>暂无数据</Text>
          </View>
        )}
        <SafeArea position='bottom' />
      </ScrollView>
    </View>
  );
};