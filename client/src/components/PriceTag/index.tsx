import { View, Text } from '@tarojs/components'
import { formatPrice } from '../../utils/format'
import './index.scss'

interface Props {
  price: number
  originalPrice?: number
  unit?: string
  size?: 'small' | 'medium' | 'large'
  highlight?: boolean
}

export default function PriceTag({
  price,
  originalPrice,
  unit = '起',
  size = 'medium',
  highlight = true
}: Props) {
  const sizeClass = `size-${size}`

  return (
    <View className={`price-tag ${sizeClass} ${highlight ? 'highlight' : ''}`}>
      <Text className='symbol'>¥</Text>
      <Text className='amount'>{price}</Text>
      {unit && <Text className='unit'>{unit}</Text>}
      {originalPrice && originalPrice > price && (
        <Text className='original'>¥{originalPrice}</Text>
      )}
    </View>
  )
}