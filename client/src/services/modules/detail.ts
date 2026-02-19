import myaxios from "../myaxios";

// 定义房源详情类型
export interface HouseDetail {
  id: string;
  title: string;
  price: number;
  area: string;
  address: string;
  images: string[];
  facilities: string[];
}

// 获取房源详情
export default function getDetail(houseId: string) {
  return myaxios.get<HouseDetail>({
    url: "/detail/infos",
    params: { houseId }
  });
}