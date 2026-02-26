import myaxios from "../myaxios";

// 图片项
export interface HousePicItem {
  title: string;
  url: string;
  albumUrl: string;
  orderIndex: number;
  pictureExplain: string | null;
  enumPictureCategory: number;
}

// 房屋图片
export interface HousePicture {
  housePics: HousePicItem[];
  preferredProPics: any[];
  housePictureGroup: any[];
  houseVRURL: string | null;
  houseVideoURL: string | null;
  houseVideoTimeSpan: number;
  defaultPictureURL: string;
  picCount: number;
  houseVideos: any;
}

// 标签
export interface HouseTag {
  tagText: {
    text: string;
    color: string;
    border: string | null;
    tips: string | null;
    background: {
      color: string;
      image: string | null;
      gradientColor: string | null;
    };
  } | null;
  tagPic: string | null;
  tagDesc: string | null;
  tagCode: number;
  tagLink: string | null;
  aloneLine: boolean;
  childTags: any;
}

// 评论简述
export interface CommentBrief {
  overall: number;
  scoreTitle: string;
  commentBrief: string;
  commentBriefV2: string | null;
  userAvatars: Array<{ userAvatars: string }>;
  userAvatar: string;
  totalCount: number;
  commentTabType: number;
  veryGoodNewHouse: string;
  veryGoodNewHouseIcon: string;
  totalCountStr: string;
  healthText: string;
  healthFlag: number;
  sort: string;
}

// 位置信息
export interface NearByPosition {
  address: string;
  nearByPosition: string | null;
  areaName: string;
  tradeArea: string;
}

// 钻石等级
export interface DiamondLevel {
  icon: string;
  level: number;
  title: string;
  desc: string;
}

// 头部标签
export interface HeadTag {
  headTagName: string;
  headTagStyle: {
    colors: string[];
    locations: number[];
    vertical: boolean;
    textColor: string;
    textLightColor: string;
    textLightLineColors: string[];
    imgUrl: string;
  };
}

// Top模块
export interface TopModule {
  favoriteCount: number;
  housePicture: HousePicture;
  promotionPic: string | null;
  houseName: string;
  houseTags: HouseTag[];
  commentBrief: CommentBrief;
  nearByPosition: NearByPosition;
  urgencyPromotion: any;
  redPacketTagData: any;
  atmosphereVo: any;
  checkInDate: string;
  checkOutDate: string;
  boardRanks: any;
  loginGuidance: any;
  diamondLevel: DiamondLevel;
  headTag: HeadTag;
  businessDistrictConfig: any;
  briefComments: any[];
}

// 设施项
export interface FacilityItem {
  isDeleted: boolean;
  orderIndex: number;
  name: string;
  icon: string | null;
  deleted: boolean;
  tip: string | null;
}

// 设施组
export interface FacilityGroup {
  facilitys: FacilityItem[];
  groupId: number;
  groupName: string;
  icon: string;
}

// 设施模块
export interface FacilityModule {
  topScroll: {
    icon: string;
    title: string;
    text: string;
    tips: any[];
    aloneLine: boolean;
    jumpUrl: string | null;
    timeStamp: number;
    titleTips: any[];
    color: string;
    type: number;
  };
  houseContent: string;
  houseSummary: any[];
  houseFacility: {
    specialFacilitys: FacilityItem[];
    houseFacilitys: FacilityGroup[];
    facilitySort: number[];
    bedSizeDetailInfo: {
      houseTips: string[];
      houseIntroduction: string;
    };
  };
}

// 房东模块
export interface LandlordModule {
  hotelId: number;
  topScroll: string;
  hotelLogo: string;
  hotelName: string;
  landlordLevelUrl: string;
  hotelTags: HouseTag[];
  landlordTag: any;
  hotelSummary: any[];
  businessType: number;
  landlordLevel: number;
  isReplyTimeMoreThan5Min: boolean;
}

// 评论模块
export interface CommentModule {
  overall: number;
  scoreTitle: string;
  totalCount: number;
  subScores: string[];
  subScoresFocus: any[];
  commentTagVo: any[];
  comment: any;
  commentTabType: number;
  commentAvatarsLimit: string[];
  totalCountStr: string;
  evaluationModule: {
    data: any[];
    totalCount: number;
    moreNavigateUrl: string;
  };
}

// 位置模块
export interface PositionModule {
  cityId: number;
  cityName: string;
  cityTerritoryType: number;
  longitude: number;
  latitude: number;
  geoCoordSysType: string;
  address: string;
  ctripCityId: number;
  tips: string;
  topScroll: any;
  mapUrl: string;
  unitGeoPositions: any;
  communityInfo: any;
  areaName: string;
  tradeArea: string;
  poi: string;
}

// 规则模块
export interface RulesModule {
  cancelRules: any[];
  orderRules: any[];
  checkInRules: any[];
  checkinOtherInfo: any[];
}

// 房东推荐模块
export interface LandlordRecommendModule {
  iconPictures: any[];
  banner: string;
}

// 动态模块
export interface DynamicModule {
  moduleSort: string[];
  facilityModule: FacilityModule;
  landlordModule: LandlordModule;
  commentModule: CommentModule;
  rulesModule: RulesModule;
  positionModule: PositionModule;
  featureModule: any;
  landlordRecommendModule: LandlordRecommendModule;
  bannerModule: any;
}

// 分享模块
export interface ShareModule {
  items: any[];
  shareTags: string[];
}

// 介绍模块
export interface IntroductionModule {
  title: string;
  introduction: string;
  focus: any;
  blod: boolean;
  icon: string | null;
  color: string | null;
  tip: string | null;
  highLight: any;
  memberTitle: string | null;
  memberLevelStyle: any;
  maskTagText: string;
  titleType: number;
  marketActivityId: number;
}

// 保障模块
export interface EnsureModule {
  icon: string;
  title: string;
  text: string | null;
  subIcon: string;
  titleTips: any[];
}

// 营业执照模块
export interface BusinessLicenseModule {
  items: string[];
}

// MainPart 主数据
export interface MainPart {
  topModule: TopModule;
  shareModule: ShareModule;
  introductionModule: IntroductionModule;
  ensureModule: EnsureModule;
  businessLicenseModule: string[];
  dynamicModule: DynamicModule;
  businessLicenseModuleTitle: string;
}

// 价格部分（简化）
export interface PricePart {
  priceModule: any;
  contractModule: any;
}

// 当前房屋信息
export interface CurrentHouse {
  houseId: number;
  houseName: string;
  houseSummary: string;
  defaultPictureURL: string;
  productPrice: string;
  finalPrice: string;
  priceMark: string;
  allowBooking: boolean;
  markLine: boolean;
  houseTags: HouseTag[];
  promoTags: any[];
  rules: any[];
  activityInfo: string;
  [key: string]: any;
}

// 完整的房屋详情数据
export interface HouseDetailData {
  houseId: number;
  canSale: boolean;
  unitInstanceCount: number;
  mainPart: MainPart;
  pricePart: PricePart;
  popupUpJson: string;
  currentHouse: CurrentHouse;
  floatingBall: any;
  debugInfo: string;
}

// API 返回的完整数据结构
export type HouseDetail = HouseDetailData;

export default function getDetail(houseId: string): Promise<HouseDetailData> {
  return myaxios.get<HouseDetailData>({
    url: "/detail/infos",
    params: { houseId },
  });
}

// 新的获取酒店详情接口 - 调用本地后端
export function newInfos(houseId: string): Promise<HouseDetailData> {
  return myaxios.get<HouseDetailData>({
    url: "/detail/infos",
    params: { houseId },
    baseURL: "http://localhost:3000",
  });
}
