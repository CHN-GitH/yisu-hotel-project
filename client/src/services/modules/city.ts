import myaxios from "../myaxios";

// 定义城市数据的 TS 类型
export interface CityItem {
  id: string | number;
  name: string;
  pinyin?: string;
  level?: 'province' | 'city' | 'district';
  parentId?: string | number;
  children?: CityItem[];
}

// 获取所有城市列表
export function getCityAll() {
  return myaxios.get<CityItem[]>({
    url: '/city/all'
  });
}