import myaxios from "../myaxios";

// 价格标签
export interface PriceTipBadge {
  type: number;
  text: string;
  color: string;
  gradient?: {
    startColor: string;
    endColor: string;
  };
}

// 图片信息
export interface HouseImage {
  url: string;
  width: number;
  height: number;
}

// 扩展信息
export interface ExtendMap {
  logicBit: string;
}

// 房源详情数据（嵌套在 item.data 中）
export interface HouseDetailData {
  houseId: number;
  houseName: string;
  productPrice: number;
  finalPrice: number;
  commentScore: string;
  summaryText: string;
  location: string;
  cityId: number;
  image: HouseImage;
  priceTipBadge: PriceTipBadge | null;
  iconTag: null;
  houseAdvert: null;
  activityInfo: null;
  sellingPoint: null;
  guideText: null;
  referencePriceDesc: null;
  poiLocation: null;
  houseTags: null;
  extendMap: ExtendMap;
  showHouseVideo: boolean;
}

// 列表项（包含类型和嵌套数据）
export interface HouseListItem {
  discoveryContentType: number; // 9 或 3
  data: HouseDetailData;
}

// 接口返回类型
export type HouseListResponse = HouseListItem[];

// 获取首页房源列表
export default function getHomeList(currentPage: number) {
  return myaxios.get<HouseListResponse>({
    url: '/home/houselist',
    params: {
      page: currentPage
    }
  });
}