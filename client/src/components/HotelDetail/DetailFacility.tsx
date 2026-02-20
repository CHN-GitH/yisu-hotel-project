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

// 完整的房屋设施数据类型
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
  facilitydata?: HouseFacility;
}

export default function DetailFacility({ facilitydata }: DetailFacilityProps) {
  if (!facilitydata) return null;

  const { specialFacilitys = [], houseFacilitys = [], facilitySort = [] } = facilitydata;

  // 过滤有效的特殊设施（显示前6个）
  const validSpecialFacilities = specialFacilitys
    .filter(f => !f.deleted)
    .slice(0, 6);

  // 过滤有效的设施组（根据 facilitySort 索引）
  const validFacilityGroups = houseFacilitys.filter((_, index) => 
    facilitySort.includes(index)
  );

  return (
    <View className='detail-facility'>
      <DetailSlot title='房屋设施' moreText='全部设施'>
        {/* 特殊设施网格 - 来自原页面的 facility-section */}
        {validSpecialFacilities.length > 0 && (
          <View className='special-facility-grid'>
            {validSpecialFacilities.map((facility, idx) => (
              <View key={idx} className='special-facility-item'>
                {facility.icon && (
                  <Image 
                    src={facility.icon} 
                    className='special-facility-icon' 
                    mode='aspectFit'
                  />
                )}
                <Text className='special-facility-name'>{facility.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 设施分组列表 */}
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
}