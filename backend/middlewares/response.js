// 响应处理中间件

// 成功响应
function successResponse(res, data, message = '获取成功') {
  res.json({
    _id: generateId(),
    trace: null,
    referTraceId: '',
    ver: '1.0',
    ret: true,
    errmsg: null,
    errTip: null,
    errcode: 0,
    data: data
  });
}

// 错误响应
function errorResponse(res, code = 500, message = '服务器内部错误') {
  res.json({
    _id: generateId(),
    trace: null,
    referTraceId: '',
    ver: '1.0',
    ret: false,
    errmsg: message,
    errTip: null,
    errcode: code,
    data: null
  });
}

// 生成随机ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 统一响应中间件
function responseMiddleware(req, res, next) {
  res.success = (data, message) => successResponse(res, data, message);
  res.error = (code, message) => errorResponse(res, code, message);
  next();
}

module.exports = {
  successResponse,
  errorResponse,
  responseMiddleware
};
