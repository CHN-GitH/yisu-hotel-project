import http from "../myaxios";

// 定义分类数据的 TS 类型
export interface CategoryItem {
  id: string | number;
  name: string;
  icon?: string;
  desc?: string;
  children?: CategoryItem[];
}

// 获取首页分类数据
export default function getCategories() {
  return http.get<CategoryItem[]>({
    url: '/home/categories'
  });
}