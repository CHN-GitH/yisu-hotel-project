import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Tabs, Elevator, Grid } from '@nutui/nutui-react-taro'
import ChineseCities from '../../assets/CityChinese.json'
import InternationalCities from '../../assets/CityInternational.json'

// 定义城市数据类型
interface CityItem {
  id: string | number
  name: string
  country?: string
  region?: string
}

interface ElevatorItem {
  title: string
  list: CityItem[]
}

// 海外region排序配置
const REGION_ORDER = ['日韩', '东南亚', '欧洲', '美洲', '澳中东非']

export default function CitySearch() {
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic')

  // 国内数据处理
  const domesticElevatorData = useMemo((): ElevatorItem[] => {
    const result: ElevatorItem[] = []
    const hotCities = ChineseCities.hot || []
    if (hotCities.length > 0) {
      result.push({
        title: '热门',
        list: hotCities.map(city => ({
          id: city.id,
          name: city.name
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

  // 字母索引数据（A-Z）
  const letterGroups = useMemo(() => {
    const map: Record<string, CityItem[]> = {}
    Object.keys(InternationalCities).sort().forEach(letter => {
      const cities = InternationalCities[letter as keyof typeof InternationalCities] as CityItem[]
      map[letter] = cities.map(city => ({
        id: city.id,
        name: city.name,
        country: city.country
      }))
    })
    return map
  }, [])

  // 城市点击事件
  const handleCityClick = (item: CityItem) => {
    console.log('选中城市:', item)
  }

  // 国内索引点击
  const handleIndexClick = (key: string) => {
    console.log('点击索引:', key)
  }

  return (
    <View className="city-search">
      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value as 'domestic' | 'international')}
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
      </Tabs>
    </View>
  )
}