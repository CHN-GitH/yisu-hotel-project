import myaxios from "../myaxios";

// 定义热门推荐数据的 TS 类型
export interface HotSuggestItem {
  id: string | number;
  title: string;
  image: string;
  desc?: string;
  link?: string;
  hotValue?: number;
}

// 获取首页热门推荐数据
export default function getHotSuggests() {
  return myaxios.get<HotSuggestItem[]>({
    url: '/home/hotSuggests'
  });
}