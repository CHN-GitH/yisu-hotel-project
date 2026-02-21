import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Input } from "@tarojs/components";
import { TriangleDown, Location } from "@nutui/icons-react-taro";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCity, setSelectedCityData } from "../../store/slices/searchCitySlice";
import "../../styles/HotelSearch.scss";

// H5 端百度地图类型声明
declare global {
  interface Window {
    BMapGL?: any;
  }
}

export default function SearchCardCityChinese() {
  const dispatch = useAppDispatch();
  // 从 searchCity reducer 读取数据
  const { city, selectedCityData } = useAppSelector((state) => state.searchCity);
  
  const [isLocating, setIsLocating] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");

  const isWeapp = process.env.TARO_ENV === "weapp";
  const isH5 = process.env.TARO_ENV === "h5";

  // 监听城市变化（调试用）
  useEffect(() => {
    console.log('Redux city updated:', city, selectedCityData);
  }, [city, selectedCityData]);

  // 跳转到城市选择页
  const handleCityClick = () => {
    Taro.navigateTo({
      url: "/pages/CitySearch/index",
    });
  };

  const handleInputChange = (e: any) => {
    setSearchInputValue(e.detail.value);
  };

  // H5 端：动态加载百度地图 WebGL API
  useEffect(() => {
    if (isH5) {
      const script = document.createElement("script");
      script.src = `https://api.map.baidu.com/getscript?v=3.0&type=webgl&ak=cVUYlyAZOX43yKC4GNEHqPuwnPpGgovf`;
      script.onload = () => console.log("百度地图 H5 API 加载成功");
      script.onerror = (err) => console.error("百度地图 H5 API 加载失败:", err);
      document.body.appendChild(script);
    }
  }, [isH5]);

  // H5 端：百度地图坐标转换
  const convertCoord = (
    lat: number,
    lng: number,
    fromType: number = 3,
  ): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!window.BMapGL) {
        reject(new Error("百度地图 API 未加载完成"));
        return;
      }
      const convertor = new window.BMapGL.Convertor();
      const points = [new window.BMapGL.Point(lng, lat)];

      convertor.translate(points, fromType, 5, (res: any) => {
        if (res?.status === 0) {
          resolve({
            lat: res.points[0].lat,
            lng: res.points[0].lng,
          });
        } else {
          reject(new Error("坐标转换失败"));
        }
      });
    });
  };

  // H5 端：百度地图逆地理编码
  const getCityFromCoord = (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.BMapGL) {
        reject(new Error("百度地图 API 未加载完成"));
        return;
      }
      const geocoder = new window.BMapGL.Geocoder();
      geocoder.getLocation(new window.BMapGL.Point(lng, lat), (result: any) => {
        if (result?.addressComponents) {
          const cityName =
            result.addressComponents.city || result.addressComponents.province;
          resolve(cityName);
        } else {
          reject(new Error("无法解析当前位置"));
        }
      });
    });
  };

  // 小程序端：使用百度地图微信小程序 JavaScript API
  const getCityFromWeapp = (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 使用百度地图 Web 服务 API（微信小程序端）
      const ak = "j0Y6yIHE1JdNoJQAYJlqUJ6K2l6HtpWt";
      // 注意：coordtype=gcj02ll 表示输入坐标是 GCJ02（微信返回的坐标）
      const url = `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${ak}&output=json&coordtype=gcj02ll&location=${lat},${lng}&extensions_town=true&latest_admin=1`;

      Taro.request({
        url,
        method: "GET",
        header: {
          "Content-Type": "application/json",
        },
        success: (res: any) => {
          console.log("百度地图 API 返回:", res.data);
          if (res.data?.status === 0) {
            const addressComponent = res.data.result?.addressComponent;
            if (addressComponent) {
              // 优先返回城市，如果没有城市则返回省份
              const cityName =
                addressComponent.city || addressComponent.province;
              resolve(cityName);
            } else {
              reject(new Error("返回数据格式异常"));
            }
          } else {
            reject(new Error(`API 错误: ${res.data?.msg || "未知错误"}`));
          }
        },
        fail: (err: any) => {
          console.error("百度地图 API 请求失败:", err);
          let errorMsg = "网络请求失败";
          if (err?.errMsg?.includes("url not in domain list")) {
            errorMsg =
              '域名未配置：请在微信公众平台添加 https://api.map.baidu.com 到 request 合法域名，或在开发工具中勾选"不校验合法域名"';
          } else if (err?.errMsg?.includes("fail")) {
            errorMsg = "网络连接失败，请检查网络";
          }
          reject(new Error(errorMsg));
        },
      });
    });
  };

  const handleLocate = async () => {
    if (isLocating) return;
    setIsLocating(true);

    try {
      // 小程序端先申请定位权限
      if (isWeapp) {
        const settingRes = await Taro.getSetting();
        if (!settingRes.authSetting['scope.userLocation']) {
          await Taro.authorize({ scope: 'scope.userLocation' });
        }
      }

      // 1. 获取定位坐标
      let res;
      try {
        // 优先使用 gcj02（与百度地图 coordtype=gcj02ll 对应）
        res = await Taro.getLocation({
          type: "gcj02",
          altitude: false,
          isHighAccuracy: true,
        });
      } catch (firstErr: any) {
        console.log("gcj02 定位失败，尝试 wgs84:", firstErr);
        res = await Taro.getLocation({
          type: "wgs84",
          altitude: false,
        });
      }

      const { latitude, longitude } = res;
      console.log("原始定位坐标:", { latitude, longitude, type: res.type });

      let cityName = "";

      // 2. 根据环境选择解析方式
      if (isWeapp) {
        // 小程序端：使用百度地图 Web 服务 API
        cityName = await getCityFromWeapp(latitude, longitude);
      } else if (isH5) {
        // H5 端：使用百度地图 WebGL API
        const fromType = res.type === "gcj02" ? 3 : 1;
        const bdCoord = await convertCoord(latitude, longitude, fromType);
        console.log("百度坐标:", bdCoord);
        cityName = await getCityFromCoord(bdCoord.lat, bdCoord.lng);
      } else {
        throw new Error("不支持的平台");
      }

      // 3. 更新城市
      if (cityName) {
        dispatch(setCity(cityName));
        dispatch(setSelectedCityData({
          cityName: cityName,
          cityId: 0,
        }));
        Taro.showToast({ title: `已定位到${cityName}`, icon: "success" });
      } else {
        throw new Error("获取城市名称为空");
      }
    } catch (error: any) {
      console.error("定位失败:", error);
      const errorMsg = error?.message || String(error);

      let tipMsg = "定位失败，请重试";
      if (errorMsg.includes("域名未配置")) {
        tipMsg = '请在微信公众平台配置域名，或开启开发工具"不校验合法域名"';
      } else if (errorMsg.includes("授权") || errorMsg.includes("deny")) {
        tipMsg = "请允许位置权限";
      } else if (errorMsg.includes("网络")) {
        tipMsg = "网络连接失败";
      } else if (errorMsg.includes("API 错误")) {
        tipMsg = "地图服务异常，请稍后重试";
      }

      Taro.showToast({ title: tipMsg, icon: "none", duration: 3000 });
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <View className="search-row">
      <View className="search-city">
        <Text className="search-city-chinese" onClick={handleCityClick}>
          {city || "选择城市"}
          <TriangleDown size={15} style={{ marginLeft: "0.25rem" }} />
        </Text>
        <Input
          className="search-city-input"
          placeholder=" 位置/品牌/酒店"
          value={searchInputValue}
          onInput={handleInputChange}
          onClick={handleCityClick}
        />
        <Location
          className="search-city-location"
          onClick={(e) => {
            e.stopPropagation();
            handleLocate();
          }}
          style={{ opacity: isLocating ? 0.5 : 1 }}
        />
      </View>
    </View>
  );
}