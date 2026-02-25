// 测试商户端接口
const http = require('http');

let token = '';

// 测试登录接口
console.log('测试登录接口...');
const loginData = JSON.stringify({
  username: 'merchant1',
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

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('登录响应:', data);

    try {
      const result = JSON.parse(data);
      if (result.code === 0) {
        token = result.data.token;
        console.log('登录成功，获取到token:', token);

        // 测试获取酒店列表
        testGetHotelList();
      } else {
        console.error('登录失败:', result.msg);
      }
    } catch (error) {
      console.error('解析登录响应失败:', error);
    }
  });
});

loginReq.on('error', (error) => {
  console.error('登录测试失败:', error);
});

loginReq.write(loginData);
loginReq.end();

// 测试获取酒店列表
function testGetHotelList() {
  console.log('\n测试获取酒店列表...');

  const hotelListOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/hotel/list',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const hotelListReq = http.request(hotelListOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('获取酒店列表响应:', data);

      // 测试创建酒店
      testCreateHotel();
    });
  });

  hotelListReq.on('error', (error) => {
    console.error('获取酒店列表测试失败:', error);
    testCreateHotel();
  });

  hotelListReq.end();
}

// 测试创建酒店
function testCreateHotel() {
  console.log('\n测试创建酒店...');

  const hotelData = JSON.stringify({
    name: 'Test Hotel',
    address: 'Shanghai',
    star: 3,
    minPrice: 300
  });

  const createHotelOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/hotel/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': hotelData.length,
      'Authorization': `Bearer ${token}`
    }
  };

  const createHotelReq = http.request(createHotelOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('创建酒店响应:', data);

      console.log('\n所有商户端接口测试完成！');
    });
  });

  createHotelReq.on('error', (error) => {
    console.error('创建酒店测试失败:', error);
    console.log('\n所有商户端接口测试完成！');
  });

  createHotelReq.write(hotelData);
  createHotelReq.end();
}
