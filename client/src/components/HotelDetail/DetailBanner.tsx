// 酒店详情页 - 轮播图
import React, { useState, useMemo } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { Swiper, SwiperItem } from "@tarojs/components";
import "../../styles/HotelDetail.scss";

// 轮播图数据项类型定义
export interface BannerItem {
  title: string;
  url: string;
  albumUrl?: string;
  orderIndex?: number;
  pictureExplain?: string | null;
  enumPictureCategory: number | string;
  [key: string]: any;
}

interface DetailBannerProps {
  bannerdata?: BannerItem[];
  source?: "local" | "remote" | null;
}

export default function DetailBanner({
  bannerdata = [],
  source,
}: DetailBannerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 处理图片 URL
  const getImageUrl = (url: string): string => {
    if (source === "local" && url.startsWith("/uploads/")) {
      return `http://localhost:3000${url}`;
    }
    return url;
  };

  // 按分类分组处理数据
  const bannerGroup = useMemo<Record<string, BannerItem[]>>(() => {
    const group: Record<string, BannerItem[]> = {};

    // 初始化分组
    for (const item of bannerdata) {
      const category = String(item.enumPictureCategory);
      if (!group[category]) {
        group[category] = [];
      }
    }
    // 填充数据
    for (const item of bannerdata) {
      const category = String(item.enumPictureCategory);
      group[category].push(item);
    }
    return group;
  }, [bannerdata]);

  // 处理标题：移除特殊符号
  const getName = (name: string): string => {
    return name.replace(/[：【】]/g, "");
  };

  // 切换轮播时更新当前索引
  const handleChange = (e: any) => {
    setCurrentIndex(e.detail.current);
  };

  // 获取当前图片的分类
  const currentCategory = bannerdata[currentIndex]?.enumPictureCategory;

  // 如果没有数据，返回空
  if (!bannerdata || bannerdata.length === 0) {
    return null;
  }

  return (
    <View className="banner-container">
      <Swiper
        className="banner-swiper"
        autoplay
        interval={3000}
        circular
        onChange={handleChange}
        indicatorDots={false}
      >
        {bannerdata.map((item, index) => (
          <SwiperItem key={index}>
            <Image
              src={getImageUrl(item.url?.trim() || "")}
              mode="aspectFill"
              className="banner-img"
              lazyLoad
            />
          </SwiperItem>
        ))}
      </Swiper>
      {/* 自定义指示器 */}
      <View className="custom-indicator">
        {Object.entries(bannerGroup).map(([key, value]) => (
          <View
            key={key}
            className={`indicator-item ${String(currentCategory) === key ? "active" : ""}`}
          >
            {getName(value[0].title)}
          </View>
        ))}
      </View>
    </View>
  );
}
