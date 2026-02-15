export default defineAppConfig({
  pages: [
    'pages/HotelSearch/index',
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
  // tabBar: {
  //   color: '#999',
  //   selectedColor: '#1989fa',
  //   backgroundColor: '#fff',
  //   borderStyle: 'black',
  //   list: [
  //     {
  //       pagePath: 'pages/index/index',
  //       text: '首页',
  //       iconPath: 'assets/icons/home.png',
  //       selectedIconPath: 'assets/icons/home-active.png'
  //     }
  //   ]
  // }
})