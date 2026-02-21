import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Icon } from '@tarojs/components'
import { Tabs, Elevator } from '@nutui/nutui-react-taro'
import { useAppDispatch, useAppSelector } from '../../store/hooks'  // 添加 useAppSelector
import { setCity, setSelectedCityData, setSelectedHotel } from '../../store/slices/searchCitySlice'
import ChineseCities from '../../assets/CityChinese.json'
import InternationalCities from '../../assets/CityInterNational.json'
import HotelShang from '../../assets/HotelShang.json'
import '../../styles/CitySearch.scss'

// 定义城市数据类型
interface CityItem {
  id: string | number
  name: string
  country?: string
  region?: string
  pinyin?: string
}

interface HotelItem {
  id: string | number
  name: string
  pinyin?: string
}

interface ElevatorItem {
  title: string
  list: CityItem[]
}

// 海外region排序配置
const REGION_ORDER = ['日韩', '东南亚', '欧洲', '美洲', '澳中东非']

export default function CitySearch() {
  const dispatch = useAppDispatch()
  const { city: currentCity } = useAppSelector((state) => state.searchCity)
  const [activeTab, setActiveTab] = useState<'domestic' | 'international' | 'hotel'>('domestic')
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<(CityItem | HotelItem)[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // 用于标记是否正在使用输入法输入
  const isComposingRef = useRef(false)
  // 用于存储输入框的实际值（非受控方式）
  const inputValueRef = useRef('')

  // 获取所有城市数据（用于搜索）
  const allCities = useMemo(() => {
    const cities: CityItem[] = []
    // 国内城市
    Object.keys(ChineseCities).forEach(key => {
      if (key === 'hot') return
      const cityList = ChineseCities[key as keyof typeof ChineseCities] as CityItem[]
      cityList.forEach(city => {
        cities.push({
          ...city,
          region: '国内'
        })
      })
    })
    // 海外城市
    Object.keys(InternationalCities).forEach(key => {
      const cityList = InternationalCities[key as keyof typeof InternationalCities] as CityItem[]
      cityList.forEach(city => {
        cities.push(city)
      })
    })
    return cities
  }, [])

  // 获取所有酒店数据
  const allHotels = useMemo(() => {
    const hotels: HotelItem[] = []
    Object.keys(HotelShang).forEach(key => {
      const hotelList = HotelShang[key as keyof typeof HotelShang] as HotelItem[]
      hotelList.forEach(hotel => {
        hotels.push(hotel)
      })
    })
    return hotels
  }, [])

  // 执行搜索逻辑 - 同时搜索城市和酒店
  const executeSearch = useCallback((value: string) => {
    if (!value.trim()) {
      setIsSearching(false)
      setSearchResults([])
      return
    }
    setIsSearching(true)
    const keyword = value.toLowerCase().trim()
    // 搜索城市
    const cityResults = allCities.filter(city => {
      const nameMatch = city.name.includes(keyword)
      const pinyinMatch = city.pinyin?.toLowerCase().includes(keyword)
      return nameMatch || pinyinMatch
    }).map(city => ({...city, type: 'city' as const}))
    // 搜索酒店
    const hotelResults = allHotels.filter(hotel => {
      const nameMatch = hotel.name.includes(keyword)
      const pinyinMatch = hotel.pinyin?.toLowerCase().includes(keyword)
      return nameMatch || pinyinMatch
    }).map(hotel => ({...hotel, type: 'hotel' as const}))
    // 合并结果，城市优先，最多显示20条
    const combinedResults = [...cityResults, ...hotelResults].slice(0, 20)
    setSearchResults(combinedResults)
  }, [allCities, allHotels])

  // 处理 composition 事件（输入法开始/结束）
  const handleComposition = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    const { type } = e
    if (type === 'compositionstart') {
      isComposingRef.current = true
    } else if (type === 'compositionend') {
      isComposingRef.current = false
      // compositionend 时获取最终值并执行搜索
      const finalValue = e.currentTarget.value
      inputValueRef.current = finalValue
      setSearchValue(finalValue)
      executeSearch(finalValue)
    }
  }, [executeSearch])

  // 处理 input 输入（包括拼音输入过程中的每个字符）
  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    inputValueRef.current = value
    // 更新显示值
    setSearchValue(value)
    // 只有在非输入法编辑状态下才执行搜索
    if (!isComposingRef.current) {
      executeSearch(value)
    }
  }, [executeSearch])

  // 清除搜索
  const handleClear = useCallback(() => {
    setSearchValue('')
    inputValueRef.current = ''
    isComposingRef.current = false
    setIsSearching(false)
    setSearchResults([])
  }, [])

  // 选择城市
  const handleCitySelect = useCallback((city: CityItem) => {
    dispatch(setCity(city.name))
    dispatch(setSelectedCityData({
      cityName: city.name,
      cityId: city.id,
      country: city.country,
      region: city.region
    }))
    // 选择城市时清空酒店
    dispatch(setSelectedHotel(null))
    Taro.navigateBack()
  }, [dispatch])

  // 选择酒店
  const handleHotelSelect = useCallback((hotel: HotelItem) => {
    dispatch(setSelectedHotel({
      hotelName: hotel.name,
      hotelId: hotel.id,
      pinyin: hotel.pinyin
    }))
    Taro.navigateBack()
  }, [dispatch])

  // 国内数据处理
  const domesticElevatorData = useMemo((): ElevatorItem[] => {
    const result: ElevatorItem[] = []
    const hotCities = ChineseCities.hot || []
    if (hotCities.length > 0) {
      result.push({
        title: '热门',
        list: hotCities.map(city => ({
          id: city.id,
          name: city.name,
          country: '中国',
          region: '国内'
        }))
      })
    }
    const letters = Object.keys(ChineseCities)
      .filter(key => key !== 'hot')
      .sort()
    letters.forEach(letter => {
      const cities = ChineseCities[letter as keyof typeof ChineseCities] as CityItem[]
      if (cities && cities.length > 0) {
        result.push({
          title: letter,
          list: cities.map(city => ({
            id: city.id,
            name: city.name
          }))
        })
      }
    })
    return result
  }, [])

  // 海外数据处理
  const internationalElevatorData = useMemo((): ElevatorItem[] => {
    const result: ElevatorItem[] = []
    const regionMap: Record<string, CityItem[]> = {}
    Object.keys(InternationalCities).forEach(letter => {
      const cities = InternationalCities[letter as keyof typeof InternationalCities] as CityItem[]
      cities.forEach(city => {
        const region = city.region || '其他'
        if (!regionMap[region]) {
          regionMap[region] = []
        }
        if (!regionMap[region].find(c => c.id === city.id)) {
          regionMap[region].push({
            id: city.id,
            name: city.name,
            country: city.country
          })
        }
      })
    })
    REGION_ORDER.forEach(region => {
      if (regionMap[region] && regionMap[region].length > 0) {
        result.push({
          title: region,
          list: regionMap[region]
        })
      }
    })
    Object.keys(regionMap).forEach(region => {
      if (!REGION_ORDER.includes(region) && regionMap[region].length > 0) {
        result.push({
          title: region,
          list: regionMap[region]
        })
      }
    })
    const letterMap: Record<string, CityItem[]> = {}
    Object.keys(InternationalCities).sort().forEach(letter => {
      const cities = InternationalCities[letter as keyof typeof InternationalCities] as CityItem[]
      letterMap[letter] = cities.map(city => ({
        id: city.id,
        name: city.name,
        country: city.country
      }))
    })
    Object.keys(letterMap).forEach(letter => {
      if (letterMap[letter].length > 0) {
        result.push({
          title: letter,
          list: letterMap[letter]
        })
      }
    })
    return result
  }, [])

  // 酒店数据 - 按 Grid 每行两个显示
  const hotelGridData = useMemo(() => {
    return allHotels
  }, [allHotels])

  useEffect(() => {
    const handleSetTab = (tab: 'domestic' | 'international' | 'hotel') => {
      setActiveTab(tab);
    };
    Taro.eventCenter.on('setCitySearchTab', handleSetTab);
    return () => {
      Taro.eventCenter.off('setCitySearchTab', handleSetTab);
    };
  }, []);

  const handleCityClick = (item: CityItem) => {
    handleCitySelect(item)
  }

  const handleIndexClick = (key: string) => {
    console.log('点击索引:', key)
  }

  // 渲染搜索结果（包含城市和酒店）
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <View className="search-empty">
          <Text className="empty-text">未找到相关城市或酒店</Text>
        </View>
      )
    }

    return (
      <View className="search-results">
        {searchResults.map((item: any) => (
          <View 
            key={item.id} 
            className={`search-result-item ${item.type === 'hotel' ? 'hotel-item' : ''}`}
            onClick={() => item.type === 'hotel' ? handleHotelSelect(item) : handleCitySelect(item)}
          >
            <Text className="city-name">{item.name}</Text>
            {item.type === 'hotel' ? (
              <Text className="hotel-tag">酒店</Text>
            ) : (
              (item.country || item.region) && (
                <Text className="city-extra">{item.country || item.region}</Text>
              )
            )}
          </View>
        ))}
      </View>
    )
  }

  // 渲染酒店 Grid
  const renderHotelGrid = () => {
    return (
      <ScrollView className="hotel-grid-container" scrollY style={{ height: 'calc(100vh - 6rem)' }}>
        <View className="hotel-grid">
          {hotelGridData.map((hotel, index) => (
            <View 
              key={hotel.id} 
              className="hotel-grid-item"
              onClick={() => handleHotelSelect(hotel)}
            >
              <Text className="hotel-name">{hotel.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    )
  }

  return (
    <View className="city-search">
      <View className="search-header">
        <View className="custom-search-bar">
          <Icon type='search' />
          <input
            type="text"
            value={searchValue}
            placeholder="请输入城市/酒店名或拼音"
            onInput={handleInput}
            onCompositionStart={handleComposition}
            onCompositionEnd={handleComposition}
            maxLength={20}
            className="search-input"
          />
          {searchValue && (
            <View className="clear-icon" onClick={handleClear}>
              <Text>×</Text>
            </View>
          )}
        </View>
      </View>
      {isSearching ? (
        <ScrollView className="search-result-container" scrollY>
          {renderSearchResults()}
        </ScrollView>
      ) : (
        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab(value as 'domestic' | 'international' | 'hotel')}
        >
          <Tabs.TabPane title="国内(含港澳台)" value="domestic">
            <Elevator
              list={domesticElevatorData}
              height="calc(100vh - 6rem)"
              sticky
              onItemClick={(key, item) => handleCityClick(item)}
              onIndexClick={handleIndexClick}
            />
          </Tabs.TabPane>
          <Tabs.TabPane title="海外" value="international">
            <Elevator
              list={internationalElevatorData}
              height="calc(100vh - 6rem)"
              sticky
              onItemClick={(key, item) => handleCityClick(item)}
              onIndexClick={handleIndexClick}
            />
          </Tabs.TabPane>
          <Tabs.TabPane title="上海酒店" value="hotel">
            {renderHotelGrid()}
          </Tabs.TabPane>
        </Tabs>
      )}
    </View>
  )
}