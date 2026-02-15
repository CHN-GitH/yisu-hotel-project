import { useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useReachBottom, usePullDownRefresh } from '@tarojs/taro'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchHotels, clearList } from '../../store/slices/hotelSlice'
import { SearchParams } from '../../services/api'
import HotelCard from '../../components/HotelCard'
import { STAR_LEVELS, PRICE_RANGES, SORT_OPTIONS } from '../../config/constants'
import dayjs from 'dayjs'
import './index.scss'

export default function HotelList() {
  const dispatch = useAppDispatch()
  const { city, checkIn, checkOut, keyword, filters, nights } = useAppSelector(state => state.search)
  const { list, loading, hasMore } = useAppSelector(state => state.hotel)
  const [page, setPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const [localFilters, setLocalFilters] = useState(filters)

  const buildParams = useCallback((pageNum: number): SearchParams => ({
    city,
    checkIn,
    checkOut,
    keyword,
    starLevel: localFilters.starLevels,
    minPrice: localFilters.priceRange?.[0],
    maxPrice: localFilters.priceRange?.[1],
    page: pageNum,
    pageSize: 10
  }), [city, checkIn, checkOut, keyword, localFilters])

  useEffect(() => {
    dispatch(clearList())
    dispatch(fetchHotels(buildParams(1)))
  }, [city, checkIn, checkOut, keyword, localFilters])

  useReachBottom(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      dispatch(fetchHotels(buildParams(nextPage)))
    }
  })

  usePullDownRefresh(() => {
    setPage(1)
    dispatch(clearList())
    dispatch(fetchHotels(buildParams(1)))
    Taro.stopPullDownRefresh()
  })

  const handleSort = (value: string) => {
    setSortBy(value)
    setShowFilter(false)
    // 实际应根据排序重新请求
  }

  const applyFilters = () => {
    setShowFilter(false)
    // 触发重新搜索
    setPage(1)
    dispatch(clearList())
    dispatch(fetchHotels(buildParams(1)))
  }

  return (
    <View className='list-page'>
      {/* 顶部栏 */}
      <View className='header'>
        <View className='location' onClick={() => Taro.navigateBack()}>
          <Text className='city'>{city}</Text>
          <Text className='date'>{dayjs(checkIn).format('M.D')}-{dayjs(checkOut).format('M.D')} {nights}晚</Text>
        </View>
        <View className='search-box' onClick={() => Taro.navigateBack()}>
          <Text className='placeholder'>{keyword || '搜索酒店名/位置/品牌'}</Text>
        </View>
      </View>

      {/* 筛选栏 */}
      <View className='filter-bar'>
        {SORT_OPTIONS.map(opt => (
          <View 
            key={opt.value}
            className={`filter-item ${sortBy === opt.value ? 'active' : ''}`}
            onClick={() => handleSort(opt.value)}
          >
            <Text>{opt.label}</Text>
          </View>
        ))}
        <View className='filter-btn' onClick={() => setShowFilter(true)}>
          <Text>筛选</Text>
        </View>
      </View>

      {/* 酒店列表 */}
      <ScrollView className='hotel-list' scrollY enableBackToTop>
        {list.map(hotel => (
          <HotelCard 
            key={hotel.id} 
            hotel={hotel}
            onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${hotel.id}` })}
          />
        ))}
        
        <View className='loading-status'>
          {loading && <Text>加载中...</Text>}
          {!hasMore && list.length > 0 && <Text>没有更多了</Text>}
          {!loading && list.length === 0 && (
            <View className='empty'>
              <Text>暂无符合条件的酒店</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 筛选弹窗 */}
      {showFilter && (
        <View className='filter-popup'>
          <View className='mask' onClick={() => setShowFilter(false)} />
          <View className='content'>
            <View className='filter-section'>
              <Text className='title'>星级</Text>
              <View className='options'>
                {STAR_LEVELS.map(star => (
                  <View 
                    key={star.value}
                    className={`option ${localFilters.starLevels.includes(star.value) ? 'active' : ''}`}
                    onClick={() => {
                      const newStars = localFilters.starLevels.includes(star.value)
                        ? localFilters.starLevels.filter(s => s !== star.value)
                        : [...localFilters.starLevels, star.value]
                      setLocalFilters({ ...localFilters, starLevels: newStars })
                    }}
                  >
                    <Text>{star.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className='filter-section'>
              <Text className='title'>价格</Text>
              <View className='options'>
                {PRICE_RANGES.map((range, idx) => (
                  <View 
                    key={idx}
                    className={`option ${
                      localFilters.priceRange?.[0] === range.min && localFilters.priceRange?.[1] === range.max 
                        ? 'active' 
                        : ''
                    }`}
                    onClick={() => {
                      setLocalFilters({ 
                        ...localFilters, 
                        priceRange: [range.min, range.max] as [number, number] 
                      })
                    }}
                  >
                    <Text>{range.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className='filter-footer'>
              <View className='btn-reset' onClick={() => setLocalFilters({ starLevels: [], priceRange: null, tags: [] })}>
                <Text>重置</Text>
              </View>
              <View className='btn-confirm' onClick={applyFilters}>
                <Text>确定</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}