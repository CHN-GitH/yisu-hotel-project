import Taro from '@tarojs/taro';
import { baseURL, TIMEOUT, RequestConfig, BaseResponse } from './config';

const request = <T = any>(config: RequestConfig): Promise<T> => {
  const { url, method = 'GET', data, params, header = {}, timeout = TIMEOUT } = config;
  
  let fullUrl = `${baseURL}${url}`;
  if (method === 'GET' && params) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    fullUrl += `?${queryString}`;
  }

  return new Promise((resolve, reject) => {
    Taro.request({
      url: fullUrl,
      method: method as any,
      data: method !== 'GET' ? data : undefined,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      timeout,
      success: (res) => {
        const response = res.data as BaseResponse<T>;
        // 根据实际接口返回结构判断成功
        if (response.ret && response.errcode === 0) {
          resolve(response.data);
        } else {
          reject(new Error(response.errmsg || '请求失败'));
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '网络请求失败'));
      }
    });
  });
};

export default {
  get: <T = any>(config: Omit<RequestConfig, 'method'> | string) => {
    if (typeof config === 'string') {
      return request<T>({ url: config, method: 'GET' });
    }
    return request<T>({ ...config, method: 'GET' });
  },
  
  post: <T = any>(config: Omit<RequestConfig, 'method'>) => {
    return request<T>({ ...config, method: 'POST' });
  }
};