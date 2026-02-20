// src/components/HotelDetail/DetailPosition.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, Map, CoverView, CoverImage, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Location, Minus, Plus } from '@nutui/icons-react-taro';
import DetailSlot from './DetailSlot';
import '../../styles/HotelDetail.scss';

// 位置数据类型
interface PositionData {
  cityId?: number;
  cityName?: string;
  cityTerritoryType?: number;
  longitude?: number;
  latitude?: number;
  geoCoordSysType?: string;
  address?: string;
  ctripCityId?: number;
  tips?: string;
  topScroll?: any;
  mapUrl?: string;
  unitGeoPositions?: any;
  communityInfo?: any;
  areaName?: string;
  tradeArea?: string;
  poi?: string;
  houseName?: string;
}

interface DetailPositionProps {
  positiondata?: Partial<PositionData>;
}

// 百度坐标转腾讯/GCJ-02坐标
const bd09ToGcj02 = (bdLon: number, bdLat: number): [number, number] => {
  const x = bdLon - 0.0065;
  const y = bdLat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI * 3000.0 / 180.0);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI * 3000.0 / 180.0);
  const gcjLon = z * Math.cos(theta);
  const gcjLat = z * Math.sin(theta);
  return [gcjLon, gcjLat];
};

export default function DetailPosition({ positiondata = {} }: DetailPositionProps) {
  const [scale, setScale] = useState<number>(16);
  const [showLocation, setShowLocation] = useState<boolean>(false);

  const {
    longitude: bdLongitude,
    latitude: bdLatitude,
    address,
    houseName,
    tips,
    areaName,
    tradeArea
  } = positiondata;

  // 坐标转换
  const [longitude, latitude] = bdLongitude && bdLatitude 
    ? bd09ToGcj02(bdLongitude, bdLatitude)
    : [0, 0];

  // 如果没有位置数据，不渲染
  if (!longitude || !latitude) {
    return null;
  }

  // 地图标记点
  const markers = [
    {
      id: 1,
      longitude,
      latitude,
      title: houseName || '房屋位置',
      iconPath: '/assets/images/location-marker.png', // 需要准备本地标记图标
      width: 40,
      height: 40,
      anchor: { x: 0.5, y: 1 }, // 锚点设置在底部中心
      callout: {
        content: houseName || '房屋位置',
        color: '#333',
        fontSize: 14,
        borderRadius: 4,
        bgColor: '#fff',
        padding: 8,
        display: 'ALWAYS',
        textAlign: 'center'
      }
    }
  ];

  // 缩放控制
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 1, 20));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 1, 3));
  }, []);

  // 打开外部地图导航
  const handleOpenMap = useCallback(() => {
    Taro.openLocation({
      latitude,
      longitude,
      name: houseName || '房屋位置',
      address: address || '',
      scale: 18
    });
  }, [latitude, longitude, houseName, address]);

  // 标记点点击事件
  const handleMarkerTap = (e: any) => {
    console.log('点击标记点', e);
  };

  return (
    <View className='detail-position'>
      <DetailSlot 
        title='位置周边' 
        moreText='导航前往'
        onMoreClick={handleOpenMap}
      >
        <View className='position-content'>
          {/* 地址信息 */}
          <View className='address-row'>
            <Location size={16} color='#ff9854' />
            <View className='address-info'>
              <Text className='address-main'>{address}</Text>
              {(areaName || tradeArea) && (
                <Text className='address-sub'>{areaName} · {tradeArea}</Text>
              )}
            </View>
          </View>
          {/* 可缩放地图容器 */}
          <View className='map-container'>
            <Map
              className='scalable-map'
              longitude={longitude}
              latitude={latitude}
              scale={scale}
              markers={markers}
              showLocation={showLocation}
              enableZoom
              enableScroll
              enableRotate
              onMarkerTap={handleMarkerTap}
              onRegionChange={(e) => {
                console.log('地图区域变化', e);
              }}
            />
            {/* 地图控制按钮 */}
            <CoverView className='map-controls'>
              <CoverView className='control-btn zoom-in' onClick={handleZoomIn}>
                <Plus size={20} color='#333' />
              </CoverView>
              <CoverView className='control-btn zoom-out' onClick={handleZoomOut}>
                <Minus size={20} color='#333' />
              </CoverView>
            </CoverView>
          </View>
          {/* 操作按钮 */}
          <View className='map-actions'>
            <Button 
              className='action-btn primary'
              onClick={handleOpenMap}
            >
              <Location size={14} color='#fff' />
              <Text className='btn-text'>全屏地图</Text>
            </Button>
          </View>
        </View>
      </DetailSlot>
    </View>
  );
};