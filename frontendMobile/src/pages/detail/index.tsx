import { useEffect } from 'react'
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchHotelDetail } from '../../store/slices/hotelSlice'
import PriceTag from '../../components/PriceTag'
import dayjs from 'dayjs'
import './index.scss'

export default function HotelDetail() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentHotel, loading } = useAppSelector(state => state.hotel)
  const { checkIn, checkOut, nights } = useAppSelector(state => state.search)
  const { id } = router.params

  useEffect(() => {
    if (id) {
      dispatch(fetchHotelDetail(id))
    }
  }, [id])

  if (loading || !currentHotel) {
    return <View className='loading'>加载中...</View>
  }

  return (
    <View className='detail-page'>
      {/* 图片轮播 */}
      <Swiper className='gallery' indicatorDots circular>
        {(currentHotel.images.length > 0 ? currentHotel.images : ['https://picsum.photos/750/500']).map((img, idx) => (
          <SwiperItem key={idx}>
            <Image src={img} mode='aspectFill' className='img' />
          </SwiperItem>
        ))}
      </Swiper>

      {/* 基础信息 */}
      <View className='basic-info'>
        <View className='name-row'>
          <Text className='name'>{currentHotel.name}</Text>
          <View className='stars'>{'⭐'.repeat(currentHotel.starLevel)}</View>
        </View>
        
        <View className='rating-bar'>
          <Text className='score'>{currentHotel.rating}分</Text>
          <Text className='reviews'>{currentHotel.reviewCount}条评价</Text>
          <Text className='tag'>区域热销榜第3名</Text>
        </View>

        <View className='address-row' onClick={() => {
          Taro.openLocation({
            latitude: 31.2304,
            longitude: 121.4737,
            name: currentHotel.name,
            address: currentHotel.address
          })
        }}>
          <Text className='address'>{currentHotel.address}</Text>
          <Text className='action'>地图</Text>
        </View>
      </View>

      {/* 设施 */}
      <View className='section facilities'>
        <Text className='section-title'>酒店设施</Text>
        <View className='facility-list'>
          {currentHotel.facilities.map(f => (
            <View key={f} className='facility-item'>
              <Text className='icon'>✓</Text>
              <Text>{f}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 房型 */}
      <View className='section rooms-section'>
        <View className='date-bar'>
          <View className='date-item'>
            <Text className='label'>入住</Text>
            <Text className='date'>{dayjs(checkIn).format('M月D日')}</Text>
          </View>
          <View className='nights'>
            <Text>{nights}晚</Text>
          </View>
          <View className='date-item'>
            <Text className='label'>离店</Text>
            <Text className='date'>{dayjs(checkOut).format('M月D日')}</Text>
          </View>
        </View>

        <View className='room-list'>
          {currentHotel.rooms.map(room => (
            <View key={room.id} className='room-item'>
              <Image src={room.image || 'https://picsum.photos/200/150'} mode='aspectFill' className='room-img' />
              <View className='room-info'>
                <Text className='name'>{room.name}</Text>
                <Text className='desc'>{room.bedType} | {room.area}㎡ | 可住{room.capacity}人</Text>
                <View className='tags'>
                  {room.breakfast && <Text className='tag'>含早餐</Text>}
                  <Text className='tag'>{room.cancelPolicy}</Text>
                </View>
                <View className='price-row'>
                  <PriceTag price={room.price} size='medium' />
                  <View className='book-btn'>
                    <Text>预订</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 周边 */}
      {currentHotel.nearbyAttractions.length > 0 && (
        <View className='section nearby'>
          <Text className='section-title'>周边信息</Text>
          {currentHotel.nearbyAttractions.map(item => (
            <View key={item.name} className='attraction-item'>
              <Text className={`type-icon ${item.type}`}>
                {item.type === 'sight' ? '🏞️' : item.type === 'transport' ? '🚇' : '🛍️'}
              </Text>
              <Text className='name'>{item.name}</Text>
              <Text className='distance'>{item.distance}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 底部栏 */}
      <View className='bottom-bar safe-area-bottom'>
        <View className='contact'>
          <Text className='icon'>📞</Text>
          <Text>咨询</Text>
        </View>
        <View className='price-info'>
          <Text className='label'>最低</Text>
          <PriceTag price={currentHotel.minPrice} size='large' />
        </View>
        <View className='book-btn'>
          <Text>立即预订</Text>
        </View>
      </View>
    </View>
  )
}