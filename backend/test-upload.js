// 测试文件上传功能
const http = require('http');
const fs = require('fs');
const path = require('path');

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
        
        // 测试文件上传
        testUpload();
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

// 测试文件上传
function testUpload() {
  console.log('\n测试文件上传...');
  
  // 创建一个简单的测试文件
  const testFileContent = 'This is a test image file';
  const testFilePath = path.join(__dirname, 'test-upload.txt');
  
  fs.writeFileSync(testFilePath, testFileContent);
  
  const fileData = fs.readFileSync(testFilePath);
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  
  const formData = `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="test-upload.txt"\r\n` +
    `Content-Type: text/plain\r\n\r\n` +
    fileData + `\r\n` +
    `--${boundary}--`;
  
  const uploadOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/hotel/upload',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(formData),
      'Authorization': `Bearer ${token}`
    }
  };
  
  const uploadReq = http.request(uploadOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('文件上传响应:', data);
      
      // 清理测试文件
      fs.unlinkSync(testFilePath);
      
      console.log('\n文件上传测试完成！');
    });
  });
  
  uploadReq.on('error', (error) => {
    console.error('文件上传测试失败:', error);
    
    // 清理测试文件
    fs.unlinkSync(testFilePath);
    
    console.log('\n文件上传测试完成！');
  });
  
  uploadReq.write(formData);
  uploadReq.end();
}
