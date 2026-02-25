// 测试所有用户端接口
const http = require('http');

// 测试获取所有城市
console.log('测试获取所有城市...');
const cityAllOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/city/all',
  method: 'GET'
};

const cityAllReq = http.request(cityAllOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('获取所有城市响应:', data);

    // 测试获取热门城市
    testHotCities();
  });
});

cityAllReq.on('error', (error) => {
  console.error('获取所有城市测试失败:', error);
  testHotCities();
});

cityAllReq.end();

// 测试获取热门城市
function testHotCities() {
  console.log('\n测试获取热门城市...');

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
      console.log('获取热门城市响应:', data);

      // 测试获取分类
      testCategories();
    });
  });

  hotCitiesReq.on('error', (error) => {
    console.error('获取热门城市测试失败:', error);
    testCategories();
  });

  hotCitiesReq.end();
}

// 测试获取分类
function testCategories() {
  console.log('\n测试获取分类...');

  const categoriesOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/home/categories',
    method: 'GET'
  };

  const categoriesReq = http.request(categoriesOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('获取分类响应:', data);

      // 测试获取热门推荐
      testHotSuggests();
    });
  });

  categoriesReq.on('error', (error) => {
    console.error('获取分类测试失败:', error);
    testHotSuggests();
  });

  categoriesReq.end();
}

// 测试获取热门推荐
function testHotSuggests() {
  console.log('\n测试获取热门推荐...');

  const hotSuggestsOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/home/hotSuggests',
    method: 'GET'
  };

  const hotSuggestsReq = http.request(hotSuggestsOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('获取热门推荐响应:', data);

      // 测试搜索接口
      testSearch();
    });
  });

  hotSuggestsReq.on('error', (error) => {
    console.error('获取热门推荐测试失败:', error);
    testSearch();
  });

  hotSuggestsReq.end();
}

// 测试搜索接口
function testSearch() {
  console.log('\n测试搜索接口...');

  const searchOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/search/result?keyword=hotel',
    method: 'GET'
  };

  const searchReq = http.request(searchOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('搜索响应:', data);

      console.log('\n所有用户端接口测试完成！');
    });
  });

  searchReq.on('error', (error) => {
    console.error('搜索测试失败:', error);
    console.log('\n所有用户端接口测试完成！');
  });

  searchReq.end();
}
