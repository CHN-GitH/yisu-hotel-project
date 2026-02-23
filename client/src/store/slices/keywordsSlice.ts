// src/store/slices/keywordsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface KeywordItem {
  id: number
  name: string
  icon: string
}

interface KeywordsState {
  selectedKeywords: KeywordItem[]
  allKeywords: KeywordItem[]
}

const initialState: KeywordsState = {
  selectedKeywords: [],
  allKeywords: []
}

const keywordsSlice = createSlice({
  name: 'keywords',
  initialState,
  reducers: {
    // 设置所有可选关键词
    setAllKeywords: (state, action: PayloadAction<KeywordItem[]>) => {
      state.allKeywords = action.payload
    },
    
    // 切换选中状态
    toggleKeyword: (state, action: PayloadAction<KeywordItem>) => {
      const index = state.selectedKeywords.findIndex(
        item => item.id === action.payload.id
      )
      if (index > -1) {
        state.selectedKeywords.splice(index, 1)
      } else {
        state.selectedKeywords.push(action.payload)
      }
    },
    
    // 清空选中
    clearSelectedKeywords: (state) => {
      state.selectedKeywords = []
    },
    
    // 设置选中
    setSelectedKeywords: (state, action: PayloadAction<KeywordItem[]>) => {
      state.selectedKeywords = action.payload
    }
  }
})

export const { setAllKeywords, toggleKeyword, clearSelectedKeywords, setSelectedKeywords } = keywordsSlice.actions
export default keywordsSlice.reducer