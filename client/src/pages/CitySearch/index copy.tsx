import React, { useState, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { Tabs, Elevator } from '@nutui/nutui-react-taro'
import ChineseCities from '../../assets/CityChinese.json'
import InternationalCities from '../../assets/CityInterNational.json'
import '../../styles/CitySearch.scss'

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

const CitySearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic')

  // 处理国内城市数据 - 热门城市 + 字母索引
  const domesticElevatorData = useMemo((): ElevatorItem[] => {
    const result: ElevatorItem[] = []
    
    // 1. 添加热门城市作为第一个分组
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
    
    // 2. 按字母顺序添加其他城市
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

  // 处理海外城市数据 - 按region分组 + 字母分组
  const internationalElevatorData = useMemo((): ElevatorItem[] => {
    const result: ElevatorItem[] = []
    
    // 1. 先按region分组
    const regionMap: Record<string, CityItem[]> = {}
    
    // 遍历所有字母分组，按region归类
    Object.keys(InternationalCities).forEach(letter => {
      const cities = InternationalCities[letter as keyof typeof InternationalCities] as CityItem[]
      cities.forEach(city => {
        const region = city.region || '其他'
        if (!regionMap[region]) {
          regionMap[region] = []
        }
        regionMap[region].push({
          id: city.id,
          name: city.name,
          country: city.country
        })
      })
    })
    
    // 2. 按预设顺序添加region分组
    REGION_ORDER.forEach(region => {
      if (regionMap[region] && regionMap[region].length > 0) {
        result.push({
          title: region,
          list: regionMap[region]
        })
      }
    })
    
    // 3. 添加剩余未排序的region（如果有）
    Object.keys(regionMap).forEach(region => {
      if (!REGION_ORDER.includes(region) && regionMap[region].length > 0) {
        result.push({
          title: region,
          list: regionMap[region]
        })
      }
    })
    
    // 4. 按字母顺序添加所有城市（作为补充索引）
    const letters = Object.keys(InternationalCities).sort()
    letters.forEach(letter => {
      const cities = InternationalCities[letter as keyof typeof InternationalCities] as CityItem[]
      if (cities && cities.length > 0) {
        result.push({
          title: letter,
          list: cities.map(city => ({
            id: city.id,
            name: city.name,
            country: city.country,
            region: city.region
          }))
        })
      }
    })
    
    return result
  }, [])

  // 城市点击事件
  const handleCityClick = (key: string, item: CityItem) => {
    console.log('选中城市:', key, item)
    // TODO: 处理城市选择逻辑，如返回上一页并传递城市数据
    // Taro.navigateBack({ delta: 1 })
    // 或通过事件总线传递数据
  }

  // 索引点击事件（国内 Elevator 右侧索引）
  const handleIndexClick = (key: string) => {
    console.log('点击索引:', key)
  }

  return (
    <View className="city-search-page">
      {/* Tab 切换 */}
      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value as 'domestic' | 'international')}
      >
        <Tabs.TabPane title="国内(含港澳台)" value="domestic">
          {/* 国内城市 - Elevator 组件 */}
          <Elevator
            list={domesticElevatorData}
            height="calc(100vh - 100px)"
            sticky
            onItemClick={handleCityClick}
            onIndexClick={handleIndexClick}
          />
        </Tabs.TabPane>
        
        <Tabs.TabPane title="海外" value="international">
          {/* 海外城市 - 自定义列表（不需要右侧索引） */}
          <View className="international-list">
            {internationalElevatorData.map((group) => (
              <View key={group.title} className="city-group" id={`group-${group.title}`}>
                {/* 分组标题 - 吸顶效果 */}
                <View className="group-header">
                  <Text className="group-title">{group.title}</Text>
                </View>
                
                {/* 城市列表 */}
                <View className="city-list">
                  {group.list.map((city) => (
                    <View
                      key={city.id}
                      className="city-item"
                      onClick={() => handleCityClick(group.title, city)}
                    >
                      <Text className="city-name">{city.name}</Text>
                      {city.country && (
                        <Text className="city-country">{city.country}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Tabs.TabPane>
      </Tabs>
    </View>
  )
}

export default CitySearch