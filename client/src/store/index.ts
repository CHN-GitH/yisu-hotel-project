// src\store\index.ts
import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './slices/searchSlice'
import hotelReducer from './slices/hotelSlice'
import categoriesReducer from './slices/categoriesSlice';
import cityReducer from './slices/citySlice';
import detailReducer from './slices/detailSlice';
import getTimeReducer from './slices/gettimeSlice';
import homeListReducer from './slices/homelistSlice';
import hotSuggestsReducer from './slices/hotSuggestsSlice';
import loadingReducer from './slices/loadingSlice';
import searchHotelReducer from './slices/searchHotelSlice';
import searchCityReducer from './slices/searchCitySlice';
import keywordsReducer from './slices/keywordsSlice'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    hotel: hotelReducer,
    categories: categoriesReducer,
    city: cityReducer,
    detail: detailReducer,
    gettime: getTimeReducer,
    homelist: homeListReducer,
    hotSuggests: hotSuggestsReducer,
    loading: loadingReducer,
    searchHotel: searchHotelReducer,
    searchCity: searchCityReducer,
    keywords: keywordsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch