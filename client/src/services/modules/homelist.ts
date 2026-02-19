import myaxios from "../myaxios";

// 定义房源列表项类型
export interface HouseItem {
  id: string;
  title: string;
  price: number;
  cover: string;
  tags: string[];
}

// 定义分页返回类型
export interface HouseListResponse {
  list: HouseItem[];
  total: number;
  page: number;
  size: number;
}

// 获取首页房源列表
export default function getHomeList(currentPage: number) {
  return myaxios.get<HouseListResponse>({
    url: '/home/houselist',
    params: {
      page: currentPage
    }
  });
}