import { View, Text, Input } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

interface Props {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onFocus?: () => void
}

export default function SearchBar({
  placeholder = '搜索酒店名/位置/品牌',
  value,
  onChange,
  onSearch,
  onFocus
}: Props) {
  const [inputValue, setInputValue] = useState(value || '')

  const handleInput = (e: any) => {
    const val = e.detail.value
    setInputValue(val)
    onChange?.(val)
  }

  const handleConfirm = () => {
    onSearch?.(inputValue)
  }

  const handleClear = () => {
    setInputValue('')
    onChange?.('')
  }

  return (
    <View className='search-bar'>
      <View className='search-icon'>🔍</View>
      <Input
        className='input'
        type='text'
        placeholder={placeholder}
        value={inputValue}
        onInput={handleInput}
        onConfirm={handleConfirm}
        onFocus={onFocus}
        confirmType='search'
      />
      {inputValue && (
        <View className='clear-btn' onClick={handleClear}>
          <Text>×</Text>
        </View>
      )}
    </View>
  )
}