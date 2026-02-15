import { View, Text, Image } from '@tarojs/components'
import { HotelItem } from '../../services/api'
import { formatPrice, formatDistance } from '../../utils/format'
import './index.scss'

interface Props {
  hotel: HotelItem
  onClick?: () => void
}

export default function HotelCard({ hotel, onClick }: Props) {
  // 渲染星级
  const renderStars = (level: number) => {
    return '⭐'.repeat(level)
  }

  return (
    <View className='hotel-card' onClick={onClick}>
      <Image 
        className='cover' 
        src={hotel.coverImage || 'https://picsum.photos/200/200'}
        mode='aspectFill'
        lazyLoad
      />
      
      <View className='info'>
        <View className='header'>
          <Text className='name'>{hotel.name}</Text>
          <View className='rating'>
            <Text className='score'>{hotel.rating}</Text>
            <Text className='label'>分</Text>
          </View>
        </View>

        <View className='meta'>
          <Text className='stars'>{renderStars(hotel.starLevel)}</Text>
          <Text className='reviews'>{hotel.reviewCount}条评价</Text>
        </View>

        <View className='tags'>
          {hotel.tags.slice(0, 3).map(tag => (
            <Text key={tag} className='tag'>{tag}</Text>
          ))}
        </View>

        <View className='location'>
          <Text className='address'>{hotel.address}</Text>
          {hotel.distance && (
            <Text className='distance'>{formatDistance(hotel.distance)}</Text>
          )}
        </View>

        <View className='footer'>
          <View className='price'>
            <Text className='symbol'>¥</Text>
            <Text className='num'>{hotel.minPrice}</Text>
            <Text className='unit'>起</Text>
          </View>
          <View className='action'>
            <Text>查看详情</Text>
          </View>
        </View>
      </View>
    </View>
  )
}