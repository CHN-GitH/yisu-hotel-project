// API 测试脚本
const http = require('http');

// 测试登录接口
const loginData = JSON.stringify({
  username: 'admin1',
  password: '123456'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('测试登录接口...');
const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('登录响应:', data);
    
    // 测试用户端接口
    testClientApi();
  });
});

loginReq.on('error', (error) => {
  console.error('登录测试失败:', error);
});

loginReq.write(loginData);
loginReq.end();

// 测试用户端接口
function testClientApi() {
  console.log('\n测试用户端接口...');
  
  // 测试获取热门城市
  const hotCitiesOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/cities/hot',
    method: 'GET'
  };
  
  const hotCitiesReq = http.request(hotCitiesOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('热门城市响应:', data);
      
      // 测试获取首页列表
      testHomeList();
    });
  });
  
  hotCitiesReq.on('error', (error) => {
    console.error('热门城市测试失败:', error);
  });
  
  hotCitiesReq.end();
}

// 测试获取首页列表
function testHomeList() {
  console.log('\n测试首页列表接口...');
  
  const homeListOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/home/houselist',
    method: 'GET'
  };
  
  const homeListReq = http.request(homeListOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('首页列表响应:', data);
      console.log('\n所有接口测试完成！');
    });
  });
  
  homeListReq.on('error', (error) => {
    console.error('首页列表测试失败:', error);
  });
  
  homeListReq.end();
}
