import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import DetailSlot from './DetailSlot';
import '../../styles/HotelDetail.scss';

// 设施项类型
interface FacilityItem {
  isDeleted: boolean;
  orderIndex: number;
  name: string;
  icon: string | null;
  deleted: boolean;
  tip: string | null;
}

// 设施组类型
interface FacilityGroup {
  facilitys: FacilityItem[];
  groupId: number;
  groupName: string;
  icon: string;
}

// 房屋设施数据类型
interface HouseFacility {
  specialFacilitys: FacilityItem[];
  houseFacilitys: FacilityGroup[];
  facilitySort: number[];
  bedSizeDetailInfo?: {
    houseTips: string[];
    houseIntroduction: string;
  };
}

interface DetailFacilityProps {
  facilitydata?: {
    houseFacilitys?: FacilityGroup[];
    facilitySort?: number[];
  };
}

export default function DetailFacility({ facilitydata = {} }: DetailFacilityProps) {
  // 过滤有效的设施组（根据 facilitySort 索引）
  const validFacilityGroups = facilitydata.houseFacilitys?.filter((_, index) => 
    facilitydata.facilitySort?.includes(index)
  ) || [];

  return (
    <View className='detail-facility'>
      <DetailSlot title='房屋设施' moreText='全部设施'>
        <View className='facility-container'>
          {validFacilityGroups.map((item, index) => (
            <View className='facility-item' key={index}>
              {/* 设施分类标题 */}
              <View className='facility-head'>
                <Image 
                  src={item.icon} 
                  className='facility-icon' 
                  mode='aspectFit'
                />
                <Text className='facility-group-name'>{item.groupName}</Text>
              </View>
              {/* 设施列表 */}
              <View className='facility-list'>
                {item.facilitys
                  ?.filter(facility => !facility.deleted)
                  .slice(0, 4)
                  .map((facility, idx) => (
                    <View className='facility-detail' key={idx}>
                      <View className='check-icon'>✓</View>
                      <Text className='facility-name'>{facility.name}</Text>
                    </View>
                  ))}
              </View>
            </View>
          ))}
        </View>
      </DetailSlot>
    </View>
  );
};