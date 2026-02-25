// 测试所有接口
const http = require('http');

let token = '';
let hotelId = 0;

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
        
        // 测试创建酒店
        testCreateHotel();
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
      
      try {
        const result = JSON.parse(data);
        if (result.code === 0) {
          hotelId = result.data.id;
          console.log('创建酒店成功，获取到酒店ID:', hotelId);
          
          // 测试获取酒店列表
          testGetHotelList();
        } else {
          console.error('创建酒店失败:', result.msg);
        }
      } catch (error) {
        console.error('解析创建酒店响应失败:', error);
      }
    });
  });
  
  createHotelReq.on('error', (error) => {
    console.error('创建酒店测试失败:', error);
  });
  
  createHotelReq.write(hotelData);
  createHotelReq.end();
}

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
      
      // 测试获取酒店详情
      testGetHotelDetail();
    });
  });
  
  hotelListReq.on('error', (error) => {
    console.error('获取酒店列表测试失败:', error);
    testGetHotelDetail();
  });
  
  hotelListReq.end();
}

// 测试获取酒店详情
function testGetHotelDetail() {
  console.log('\n测试获取酒店详情...');
  
  const hotelDetailOptions = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/hotel/detail/${hotelId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  
  const hotelDetailReq = http.request(hotelDetailOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('获取酒店详情响应:', data);
      
      // 测试发布酒店
      testPublishHotel();
    });
  });
  
  hotelDetailReq.on('error', (error) => {
    console.error('获取酒店详情测试失败:', error);
    testPublishHotel();
  });
  
  hotelDetailReq.end();
}

// 测试发布酒店
function testPublishHotel() {
  console.log('\n测试发布酒店...');
  
  const publishHotelOptions = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/hotel/publish/${hotelId}/publish`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  
  const publishHotelReq = http.request(publishHotelOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('发布酒店响应:', data);
      
      // 测试创建房型
      testCreateRoomType();
    });
  });
  
  publishHotelReq.on('error', (error) => {
    console.error('发布酒店测试失败:', error);
    testCreateRoomType();
  });
  
  publishHotelReq.end();
}

// 测试创建房型
function testCreateRoomType() {
  console.log('\n测试创建房型...');
  
  const roomTypeData = JSON.stringify({
    hotelId: hotelId,
    name: 'Single Room',
    price: 300,
    area: 20,
    bedType: 'Single',
    capacity: 1
  });
  
  const createRoomTypeOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/room-types',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': roomTypeData.length,
      'Authorization': `Bearer ${token}`
    }
  };
  
  const createRoomTypeReq = http.request(createRoomTypeOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('创建房型响应:', data);
      
      // 测试获取房型列表
      testGetRoomTypeList();
    });
  });
  
  createRoomTypeReq.on('error', (error) => {
    console.error('创建房型测试失败:', error);
    testGetRoomTypeList();
  });
  
  createRoomTypeReq.write(roomTypeData);
  createRoomTypeReq.end();
}

// 测试获取房型列表
function testGetRoomTypeList() {
  console.log('\n测试获取房型列表...');
  
  const roomTypeListOptions = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/room-types/${hotelId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  
  const roomTypeListReq = http.request(roomTypeListOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('获取房型列表响应:', data);
      
      console.log('\n所有接口测试完成！');
    });
  });
  
  roomTypeListReq.on('error', (error) => {
    console.error('获取房型列表测试失败:', error);
    console.log('\n所有接口测试完成！');
  });
  
  roomTypeListReq.end();
}
