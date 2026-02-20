import React, { useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import { useDispatch, useSelector } from 'react-redux';
import { NavBar, SafeArea, Loading } from '@nutui/nutui-react-taro';
import { getDetailData } from '../../store/slices/detailSlice';
import { RootState, AppDispatch } from '../../store';
import DetailBanner from '../../components/HotelDetail/DetailBanner';
import HouseInfos from '../../components/HotelDetail/HouseInfos';
import DetailFacility from '../../components/HotelDetail/DetailFacility'
import DetailHotExport from '../../components/HotelDetail/DetailHotExport';
import DetailPosition from '../../components/HotelDetail/DetailPosition';
import { HouseDetailData } from '../../services/modules/detail';
import '../../styles/HotelDetail.scss';

export default function HotelDetail() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { detaildata, loading, error } = useSelector<RootState, RootState['detail']>(
    (state) => state.detail
  );

  const houseId = router.params.id as string || "44173741";

  const onClickLeft = () => {
    Taro.navigateBack();
  };

  useEffect(() => {
    if (houseId) {
      dispatch(getDetailData(houseId));
    }
  }, [dispatch, houseId]);

  // 类型守卫
  const hasData = (data: HouseDetailData | Record<string, never>): data is HouseDetailData => {
    return 'mainPart' in data && data.mainPart !== undefined;
  };

  const mainPart = hasData(detaildata) ? detaildata.mainPart : null;
  const topModule = mainPart?.topModule;
  const currentHouse = hasData(detaildata) ? detaildata.currentHouse : null;

  return (
    <View className='detail-container'>
      <SafeArea position='top' />
      <NavBar
        left='返回'
        fixed
        safeAreaInsetTop
        className='detail-navbar'
      >
        {topModule?.houseName?.slice(0, 10) || '房屋详情'}
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
            {/* 轮播图区域 */}
            {topModule?.housePicture?.housePics && (
              <DetailBanner bannerdata={topModule.housePicture.housePics} />
            )}
            <HouseInfos infosdata={detaildata?.mainPart?.topModule} />
            <DetailFacility facilitydata={detaildata?.mainPart?.dynamicModule?.facilityModule?.houseFacility} />
            <DetailPosition positiondata={detaildata?.mainPart?.dynamicModule?.positionModule} />
            <DetailHotExport hotexportdata={detaildata?.mainPart?.dynamicModule?.commentModule} />
            {/* 底部预订栏 */}
            {currentHouse && (
              <View className='booking-bar'>
                <View className='price-info'>
                  <Text className='price-symbol'>¥</Text>
                  <Text className='price-num'>{currentHouse.finalPrice}</Text>
                  <Text className='price-original'>¥{currentHouse.productPrice}</Text>
                  <Text className='price-unit'>{currentHouse.priceMark}</Text>
                </View>
                <View 
                  className={`book-btn ${!currentHouse.allowBooking ? 'disabled' : ''}`}
                  onClick={() => {
                    if (currentHouse.allowBooking) {
                      Taro.showToast({ title: '预订功能开发中', icon: 'none' });
                    }
                  }}
                >
                  {currentHouse.allowBooking ? '立即预订' : '已满房'}
                </View>
              </View>
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