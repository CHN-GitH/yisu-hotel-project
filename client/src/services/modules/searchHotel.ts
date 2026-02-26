import myaxios from "../myaxios";

// 定义搜索参数类型
export interface SearchParams {
  keyword?: string;
  cityId?: string | number;
  priceRange?: string;
  houseType?: string;
  page?: number;
  size?: number;
}

// 定义搜索结果项类型
export interface SearchResultItem {
  id: string | number;
  title: string;
  price: number;
  cover: string;
  address: string;
  tags: string[];
  score?: number;
}

// 定义搜索结果返回类型
export interface SearchResponse {
  list: SearchResultItem[];
  total: number;
  page: number;
  size: number;
}

// 获取搜索结果
export default function getSearchHotel(params?: SearchParams) {
  return myaxios.get<SearchResponse>({
    url: "/search/result",
    params: params || {},
  });
}

// 新的搜索酒店接口 - 调用本地后端
export function newResult(params?: SearchParams) {
  return myaxios.get<SearchResponse>({
    url: "/search/result",
    params: params || {},
    baseURL: "http://localhost:3000",
  });
}
