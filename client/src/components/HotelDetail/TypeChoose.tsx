// 酒店详情页 - 房型选择
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { InputNumber } from "@nutui/nutui-react-taro";
import { HouseDetailData, HousePicItem } from "../../services/modules/detail";
import DetailSlot from "./DetailSlot";
import "../../styles/HotelDetail.scss";

// 基础房型数据接口
export interface RoomType {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  bedInfo: string;
  areaInfo: string;
  count: number;
  // 本地模式扩展字段
  originalPrice?: number;
  tags?: string[];
  remaining?: number;
  maxGuests?: number;
  breakfast?: string;
  cancelPolicy?: string;
  windowType?: string;
  floor?: string;
  // 后端传来的字段
  bedType?: string;
  area?: number;
  capacity?: number;
  image?: string;
  images?: string[];
  facilities?: string[];
  description?: string;
}

// 统计数据接口
export interface RoomStats {
  totalCount: number;
  totalPrice: number;
  selectedRooms: RoomType[];
}

// 组件Props接口
export interface TypeChooseProps {
  // 完整的房屋详情数据
  detaildata: HouseDetailData | Record<string, never>;
  // 数据来源标识：local 使用传入数据构建房型，remote 随机生成
  source?: "local" | "remote" | null;
  // 本地模式自定义房型列表（可选，传入则优先使用）
  customRoomTypes?: RoomType[];
  // 选择变化回调
  onSelectionChange?: (
    selectedRooms: RoomType[],
    totalCount: number,
    totalPrice: number,
  ) => void;
  // 统计数据变化回调
  onStatsChange?: (stats: RoomStats) => void;
  // 最大可选房间数限制
  maxSelectLimit?: number;
}

// 生成随机价格的辅助函数
const generateRandomPrice = (
  basePrice: number,
  minOffset: number,
  maxOffset: number,
): number => {
  const offset =
    Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;
  return basePrice + offset;
};

// 打乱数组并取指定数量的元素
const getRandomImages = (pics: HousePicItem[], count: number): string[] => {
  if (!pics || pics.length === 0) return [];
  const bedroomPics = pics.filter((pic) => pic.enumPictureCategory === 2);
  const availablePics = bedroomPics.length >= count ? bedroomPics : pics;
  const shuffled = [...availablePics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((pic) => {
    if (pic.url.startsWith("/uploads/")) {
      return `http://localhost:3000${pic.url}`;
    }
    return pic.url;
  });
};

// 从本地数据构建房型信息
const buildLocalRoomTypes = (detaildata: HouseDetailData): RoomType[] => {
  const currentHouse = detaildata.currentHouse;
  const priceModule = detaildata.pricePart?.priceModule;
  const facilityModule = detaildata.mainPart?.dynamicModule?.facilityModule;

  // 获取价格信息
  const currentPrice = priceModule?.price || currentHouse?.finalPrice || 199;
  const originalPrice = priceModule?.originalPrice;

  // 获取设施信息
  const bedSizeInfo = facilityModule?.houseFacility?.bedSizeDetailInfo;
  const defaultBedInfo = bedSizeInfo?.houseTips?.[0] || "大床2×1.8米 1张";

  // 获取面积信息（从 houseSummary 或默认）
  const houseSummary = facilityModule?.houseSummary || [];
  const areaItem = houseSummary.find(
    (item: any) => item?.text?.includes("㎡") || item?.text?.includes("公寓"),
  );
  const defaultAreaInfo = areaItem?.text || "酒店式公寓";

  // 获取图片
  const defaultPicRaw =
    currentHouse?.defaultPictureURL ||
    detaildata.mainPart?.topModule?.housePicture?.defaultPictureURL ||
    "https://pic.tujia.com/upload/landlordunit/day_200105/thumb/202001051429207308_700_467.jpg";

  const defaultPic = defaultPicRaw.startsWith("/uploads/")
    ? `http://localhost:3000${defaultPicRaw}`
    : defaultPicRaw;

  // 检查是否有后端传来的房型数据
  if (detaildata.roomTypes && detaildata.roomTypes.length > 0) {
    // 使用后端传来的房型数据
    return detaildata.roomTypes.map((roomType) => {
      // 处理图片 URL
      let roomImage = roomType.image || roomType.images?.[0] || defaultPic;
      if (roomImage.startsWith("/uploads/")) {
        roomImage = `http://localhost:3000${roomImage}`;
      }

      return {
        id: `room-${roomType.id || Math.random().toString(36).substr(2, 9)}`,
        name: roomType.name || "标准房型",
        price:
          typeof roomType.price === "string"
            ? parseInt(roomType.price, 10)
            : roomType.price,
        originalPrice: roomType.price * 1.2, // 模拟原价
        imageUrl: roomImage,
        bedInfo: roomType.bedType || defaultBedInfo,
        areaInfo: roomType.area ? `${roomType.area}㎡` : defaultAreaInfo,
        count: 0,
        maxGuests: roomType.capacity || 2,
        tags: [],
        remaining: 10, // 模拟剩余数量
        breakfast: roomType.breakfast ? "含早餐" : "不含早餐",
        cancelPolicy: roomType.cancelPolicy,
        floor: roomType.floor ? `${roomType.floor}楼` : undefined,
      };
    });
  } else {
    // 构建单个房型（本地数据通常只有一个基础房型，但可扩展）
    const baseRoom: RoomType = {
      id: `room-${currentHouse?.houseId || "local"}`,
      name: detaildata.mainPart?.topModule?.roomName || currentHouse?.houseName || "标准房型",
      price:
        typeof currentPrice === "string"
          ? parseInt(currentPrice, 10)
          : currentPrice,
      originalPrice: originalPrice ? Math.floor(originalPrice) : undefined,
      imageUrl: defaultPic,
      bedInfo: defaultBedInfo,
      areaInfo: defaultAreaInfo,
      count: 0,
      maxGuests: 2,
      tags: detaildata.currentHouse?.houseTags || [],
      remaining: detaildata.unitInstanceCount || 1,
    };

    // 如果有优惠，添加标签
    if (originalPrice && originalPrice > currentPrice) {
      const discount = Math.round((currentPrice / originalPrice) * 10);
      baseRoom.tags = [...(baseRoom.tags || []), `${discount}折优惠`];
    }

    return [baseRoom];
  }
};

// 生成远程随机房型数据
const generateRemoteRoomTypes = (
  basePrice: number,
  housePics: HousePicItem[],
  bedInfo: string,
  areaInfo: string,
  defaultImage: string,
): RoomType[] => {
  const selectedImages = getRandomImages(housePics, 5);
  while (selectedImages.length < 5) {
    selectedImages.push(defaultImage);
  }

  const simplePrice = generateRandomPrice(basePrice, -30, -20);
  let luxuryPrice = generateRandomPrice(basePrice, 30, 55);
  let viewPrice = generateRandomPrice(basePrice, 56, 78);
  let familyPrice = generateRandomPrice(basePrice, 79, 100);

  while (
    luxuryPrice === viewPrice ||
    luxuryPrice === familyPrice ||
    viewPrice === familyPrice
  ) {
    luxuryPrice = generateRandomPrice(basePrice, 30, 55);
    viewPrice = generateRandomPrice(basePrice, 56, 78);
    familyPrice = generateRandomPrice(basePrice, 79, 100);
  }

  const types: Omit<RoomType, "count">[] = [
    {
      id: "simple",
      name: "简约大床房",
      price: simplePrice,
      imageUrl: selectedImages[0],
      bedInfo,
      areaInfo,
    },
    {
      id: "classic",
      name: "经典大床房",
      price: basePrice,
      imageUrl: selectedImages[1],
      bedInfo,
      areaInfo,
    },
    {
      id: "view",
      name: "外景大床房",
      price: viewPrice,
      imageUrl: selectedImages[2],
      bedInfo,
      areaInfo,
    },
    {
      id: "luxury",
      name: "奢华大床房",
      price: luxuryPrice,
      imageUrl: selectedImages[3],
      bedInfo,
      areaInfo,
    },
    {
      id: "family",
      name: "家庭套房",
      price: familyPrice,
      imageUrl: selectedImages[4],
      bedInfo,
      areaInfo,
    },
  ];

  return types
    .sort((a, b) => a.price - b.price)
    .map((type) => ({
      ...type,
      count: 0,
    }));
};

export default function TypeChoose({
  detaildata,
  source = "remote",
  customRoomTypes,
  onSelectionChange,
  onStatsChange,
  maxSelectLimit = 99,
}: TypeChooseProps) {
  // 数据提取（两种模式都需要）
  const {
    basePrice,
    housePics,
    houseSummary,
    isValid,
    defaultImage,
    currentHouse,
    priceModule,
  } = useMemo(() => {
    const hasData = (
      data: HouseDetailData | Record<string, never>,
    ): data is HouseDetailData => {
      return (
        "mainPart" in data &&
        data.mainPart !== undefined &&
        "currentHouse" in data
      );
    };

    if (!hasData(detaildata)) {
      return {
        basePrice: 0,
        housePics: [],
        houseSummary: [],
        isValid: false,
        defaultImage: "",
        currentHouse: null,
        priceModule: null,
      };
    }

    const house = detaildata.currentHouse;
    const facilityModule = detaildata.mainPart?.dynamicModule?.facilityModule;
    const priceMod = detaildata.pricePart?.priceModule;

    // 价格计算逻辑
    let price = 199; // 默认价格
    if (priceMod?.price) {
      price =
        typeof priceMod.price === "number"
          ? priceMod.price
          : parseInt(priceMod.price, 10);
    } else if (house?.finalPrice) {
      price =
        typeof house.finalPrice === "string"
          ? parseInt(house.finalPrice, 10)
          : house.finalPrice;
    } else if (house?.productPrice) {
      price =
        typeof house.productPrice === "string"
          ? parseInt(house.productPrice.replace(/[^\d]/g, ""), 10)
          : house.productPrice;
    }

    const pics = detaildata.mainPart?.topModule?.housePicture?.housePics || [];
    const summary = facilityModule?.houseSummary || [];

    const defaultPic =
      house?.defaultPictureURL ||
      detaildata.mainPart?.topModule?.housePicture?.defaultPictureURL ||
      "https://pic.tujia.com/upload/landlordunit/day_200105/thumb/202001051429207308_700_467.jpg";

    return {
      basePrice: price,
      housePics: pics,
      houseSummary: summary,
      isValid: true,
      defaultImage: defaultPic,
      currentHouse: house,
      priceModule: priceMod,
    };
  }, [detaildata]);

  // 提取床型和面积信息
  const { bedInfo, areaInfo } = useMemo(() => {
    const facilityModule = (detaildata as HouseDetailData)?.mainPart
      ?.dynamicModule?.facilityModule;
    const bedSizeInfo = facilityModule?.houseFacility?.bedSizeDetailInfo;

    const bed =
      bedSizeInfo?.houseTips?.[0] ||
      houseSummary.find((item: any) => item?.tips?.length > 0)?.tips?.[0] ||
      "大床2×1.8米 1张";

    const area =
      houseSummary.find(
        (item: any) =>
          item?.text?.includes("㎡") || item?.text?.includes("公寓"),
      )?.text || "酒店式公寓";

    return { bedInfo: bed, areaInfo: area };
  }, [houseSummary, detaildata]);

  // 房型列表状态
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLocalMode, setIsLocalMode] = useState<boolean>(false);

  // 根据 source 生成房型数据
  useEffect(() => {
    // 优先使用自定义房型（如果传入了）
    if (customRoomTypes && customRoomTypes.length > 0) {
      setRoomTypes(customRoomTypes.map((r) => ({ ...r, count: r.count || 0 })));
      setIsLocalMode(true);
      return;
    }

    // Local 模式：从 detaildata 构建房型
    if (source === "local") {
      if (!isValid) {
        setRoomTypes([]);
        return;
      }
      const localRooms = buildLocalRoomTypes(detaildata as HouseDetailData);
      setRoomTypes(localRooms);
      setIsLocalMode(true);
      return;
    }

    // Remote 模式：随机生成
    if (!isValid || basePrice <= 0) {
      setRoomTypes([]);
      setIsLocalMode(false);
      return;
    }

    const remoteRooms = generateRemoteRoomTypes(
      basePrice,
      housePics,
      bedInfo,
      areaInfo,
      defaultImage,
    );

    setRoomTypes(remoteRooms);
    setIsLocalMode(false);
  }, [
    source,
    customRoomTypes,
    detaildata,
    isValid,
    basePrice,
    housePics,
    bedInfo,
    areaInfo,
    defaultImage,
  ]);

  // 计算统计信息
  const statistics = useMemo(() => {
    const totalCount = roomTypes.reduce((sum, room) => sum + room.count, 0);
    const totalPrice = roomTypes.reduce(
      (sum, room) => sum + room.price * room.count,
      0,
    );
    const selectedRooms = roomTypes.filter((room) => room.count > 0);
    return { totalCount, totalPrice, selectedRooms };
  }, [roomTypes]);

  // 回调触发
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(
        statistics.selectedRooms,
        statistics.totalCount,
        statistics.totalPrice,
      );
    }
    if (onStatsChange) {
      onStatsChange(statistics);
    }
  }, [statistics, onSelectionChange, onStatsChange]);

  // 处理数量变化
  const handleCountChange = useCallback(
    (id: string, value: number | string) => {
      const numValue =
        typeof value === "string" ? parseInt(value, 10) || 0 : value;
      setRoomTypes((prev) =>
        prev.map((room) => {
          if (room.id === id) {
            const limit =
              isLocalMode && room.remaining
                ? Math.min(numValue, maxSelectLimit, room.remaining)
                : Math.min(numValue, maxSelectLimit);
            return { ...room, count: Math.max(0, limit) };
          }
          return room;
        }),
      );
    },
    [maxSelectLimit, isLocalMode],
  );

  const formatPrice = (price: number): string => `¥${price}`;

  if (roomTypes.length === 0) {
    return (
      <View className="detail-type-choose detail-type-choose--empty">
        <Text className="empty-text">
          {source === "local" ? "暂无可用房型" : "暂无房型数据"}
        </Text>
      </View>
    );
  }

  return (
    <View className="detail-type-choose">
      <DetailSlot
        title={isLocalMode ? "选择房间" : "选择房型"}
        moreText="全部房型"
      >
        <View className="room-list">
          {roomTypes.map((room, index) => {
            const hasDiscount =
              room.originalPrice && room.originalPrice > room.price;
            const discountPercent = hasDiscount
              ? Math.round((room.price / room.originalPrice!) * 10)
              : null;

            return (
              <View
                key={room.id}
                className={`room-card ${isLocalMode ? "room-card--local" : ""}`}
              >
                {/* 左侧图片 */}
                <View className="room-image-wrapper">
                  <Image
                    className="room-image"
                    src={room.imageUrl}
                    mode="aspectFill"
                    lazyLoad
                  />

                  {/* 标签逻辑 */}
                  {!isLocalMode && index === 0 && (
                    <View className="room-image-tag price-tag">最低价</View>
                  )}
                  {!isLocalMode && room.id === "classic" && (
                    <View className="room-image-tag recommend-tag">推荐</View>
                  )}
                  {isLocalMode &&
                    room.remaining !== undefined &&
                    room.remaining < 5 && (
                      <View className="room-image-tag price-tag">
                        仅剩{room.remaining}间
                      </View>
                    )}
                </View>

                {/* 右侧信息区 */}
                <View className="room-info">
                  {/* 标题区 */}
                  <View className="room-header">
                    <Text className="room-name">{room.name}</Text>
                  </View>

                  {/* 基础信息 */}
                  <View className="room-tags">
                    <Text className="tag">{room.bedInfo}</Text>
                    <Text className="tag">{room.areaInfo}</Text>
                  </View>
                  <View className="room-tags">
                    {room.maxGuests && (
                      <Text className="tag-down">可住{room.maxGuests}人</Text>
                    )}
                    {room.windowType && (
                      <Text className="tag-down">{room.windowType}</Text>
                    )}
                    {isLocalMode && room.tags && room.tags.length > 0 && (
                      <View className="tag-down">
                        {room.tags.slice(0, 2).map((tag, idx) => (
                          <Text key={idx} className="tag-down-item">
                            {tag}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* 价格和操作 */}
                  <View className="room-action">
                    <View className="price-section">
                      {hasDiscount ? (
                        <>
                          <Text className="price-original">
                            ¥{room.originalPrice}
                          </Text>
                          <Text className="price-value">
                            {formatPrice(room.price)}
                          </Text>
                        </>
                      ) : (
                        <Text className="price-value">
                          {formatPrice(room.price)}
                        </Text>
                      )}
                      <Text className="price-unit">
                        /
                        {isLocalMode
                          ? "晚"
                          : currentHouse?.priceMark?.replace("/", "") || "晚"}
                      </Text>
                    </View>

                    <View className="count-section">
                      <InputNumber
                        value={room.count}
                        min={0}
                        max={
                          isLocalMode && room.remaining
                            ? Math.min(maxSelectLimit, room.remaining)
                            : maxSelectLimit
                        }
                        step={1}
                        onChange={(value) => handleCountChange(room.id, value)}
                        inputWidth={60}
                        buttonSize={28}
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </DetailSlot>
    </View>
  );
}
