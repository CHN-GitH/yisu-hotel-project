export default defineAppConfig({
  pages: [
    'pages/HotelSearch/index',
    'pages/CitySearch/index',
    'pages/HotelList/index',
    'pages/HotelDetail/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '易宿酒店',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f5f5'
  },
  // 必须声明getLocation到requiredPrivateInfos
  requiredPrivateInfos: ["getLocation"],
  // 定位权限说明（微信审核要求）
  permission: {
    "scope.userLocation": {
      "desc": "你的位置信息将用于定位当前所在城市，提供更精准的酒店搜索服务"
    }
  },
  // 新增：启用按需加载
  lazyCodeLoading: "requiredComponents"
})