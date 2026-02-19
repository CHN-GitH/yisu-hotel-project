import React, { useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import { useDispatch, useSelector } from 'react-redux';
import { NavBar, SafeArea, Loading, Price, Swiper } from '@nutui/nutui-react-taro';
import { getDetailData } from '../../store/slices/detailSlice';
import { RootState, AppDispatch } from '../../store';
import { HouseDetailData } from '../../services/modules/detail';

import './index.scss';

const HotelDetail: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { detaildata, loading, error } = useSelector<RootState, RootState['detail']>(
    (state) => state.detail
  );

  const houseId = "44173741" || router.params.id as string;

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

  // 渲染加载状态
  // if (loading) {
  //   return (
  //     <View className='detail-container'>
  //       <SafeArea position='top' />
  //       <NavBar left='返回' onClickLeft={onClickLeft} fixed safeAreaInsetTop>
  //         加载中...
  //       </NavBar>
  //       <View className='loading-wrapper'>
  //         <Loading type='spinner' />
  //         <Text className='loading-text'>加载中...</Text>
  //       </View>
  //     </View>
  //   );
  // }

  const mainPart = hasData(detaildata) ? detaildata.mainPart : null;
  const topModule = mainPart?.topModule;
  const currentHouse = hasData(detaildata) ? detaildata.currentHouse : null;

  return (
    <View className='detail-container'>
      <SafeArea position='top' />
      
      <NavBar
        left='返回'
        // onClickLeft={onClickLeft}
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
              <View className='banner-section'>
                <Swiper
                  className='banner-swiper'
                  autoplay
                  interval={3000}
                  circular
                  indicatorDots
                  indicatorColor='#999'
                  indicatorActiveColor='#fff'
                >
                  {topModule.housePicture.housePics.slice(0, 5).map((pic, index) => (
                    <Swiper.Item key={index}>
                      <Image 
                        src={pic.url.trim()} 
                        mode='aspectFill' 
                        className='banner-image'
                        lazyLoad
                      />
                    </Swiper.Item>
                  ))}
                </Swiper>
                <View className='pic-count'>
                  <Text className='pic-count-text'>共{topModule.housePicture.picCount}张</Text>
                </View>
              </View>
            )}

            {/* 房屋基本信息 */}
            <View className='info-section'>
              <Text className='house-name'>{topModule?.houseName}</Text>
              
              {/* 评分和评论 */}
              {topModule?.commentBrief && (
                <View className='comment-brief'>
                  <Text className='score'>{topModule.commentBrief.overall}分</Text>
                  <Text className='score-title'>{topModule.commentBrief.scoreTitle}</Text>
                  <Text className='comment-count'>{topModule.commentBrief.totalCountStr}条评论</Text>
                </View>
              )}

              {/* 位置信息 */}
              <View className='location-info'>
                <Text className='location-text'>
                  {topModule?.nearByPosition?.areaName} · {topModule?.nearByPosition?.tradeArea}
                </Text>
                <Text className='address'>{topModule?.nearByPosition?.address}</Text>
              </View>

              {/* 标签 */}
              <View className='tags-wrapper'>
                {topModule?.houseTags?.slice(0, 4).map((tag, index) => (
                  tag.tagText && (
                    <View 
                      key={index} 
                      className='tag-item'
                      style={{ 
                        backgroundColor: tag.tagText.background?.color || '#f5f5f5',
                        color: tag.tagText.color || '#666'
                      }}
                    >
                      {tag.tagText.text}
                    </View>
                  )
                ))}
              </View>
            </View>

            {/* 房东信息 */}
            {mainPart?.dynamicModule?.landlordModule && (
              <View className='landlord-section'>
                <View className='landlord-header'>
                  <Image 
                    src={mainPart.dynamicModule.landlordModule.hotelLogo} 
                    className='landlord-avatar'
                    mode='aspectFill'
                  />
                  <View className='landlord-info'>
                    <Text className='landlord-name'>
                      {mainPart.dynamicModule.landlordModule.hotelName}
                    </Text>
                    <View className='landlord-tags'>
                      {mainPart.dynamicModule.landlordModule.hotelTags?.map((tag, idx) => (
                        tag.tagText && (
                          <Text key={idx} className='landlord-tag'>
                            {tag.tagText.text}
                          </Text>
                        )
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* 房屋设施 */}
            {mainPart?.dynamicModule?.facilityModule?.houseFacility && (
              <View className='facility-section'>
                <Text className='section-title'>房屋设施</Text>
                <View className='facility-grid'>
                  {mainPart.dynamicModule.facilityModule.houseFacility.specialFacilitys
                    ?.filter(f => !f.deleted)
                    .slice(0, 6)
                    .map((facility, idx) => (
                      <View key={idx} className='facility-item'>
                        <Image src={facility.icon} className='facility-icon' mode='aspectFit' />
                        <Text className='facility-name'>{facility.name}</Text>
                      </View>
                    ))}
                </View>
              </View>
            )}

            {/* 位置周边 */}
            {mainPart?.dynamicModule?.positionModule && (
              <View className='position-section'>
                <Text className='section-title'>位置周边</Text>
                <Text className='position-address'>
                  {mainPart.dynamicModule.positionModule.address}
                </Text>
                {mainPart.dynamicModule.positionModule.mapUrl && (
                  <Image 
                    src={mainPart.dynamicModule.positionModule.mapUrl} 
                    className='map-image'
                    mode='widthFix'
                    lazyLoad
                  />
                )}
              </View>
            )}

            {/* 价格说明 */}
            {mainPart?.introductionModule && (
              <View className='intro-section'>
                <Text className='section-title'>{mainPart.introductionModule.title}</Text>
                <Text className='intro-text'>{mainPart.introductionModule.introduction}</Text>
              </View>
            )}

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

export default HotelDetail;