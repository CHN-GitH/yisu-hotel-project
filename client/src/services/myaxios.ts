import Taro from '@tarojs/taro';
import { baseURL, TIMEOUT, RequestConfig, BaseResponse } from './config';
import { store } from '../store';
// import { setLoading } from '../store/modules/loading';

class MyAxios {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // 请求拦截器逻辑（Taro 无内置拦截器，手动封装）
  private requestInterceptor() {
    // 触发加载状态
    // store.dispatch(setLoading(true));
  }

  // 响应拦截器逻辑
  private responseInterceptor() {
    // 关闭加载状态
    // store.dispatch(setLoading(false));
  }

  // 错误处理
  private handleError(error: any) {
    this.responseInterceptor();
    Taro.showToast({
      title: error.message || '请求失败',
      icon: 'none',
      duration: 2000
    });
    return Promise.reject(error);
  }

  // 核心请求方法
  async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      // 请求前拦截
      this.requestInterceptor();
      // 拼接完整 URL（处理 params 参数）
      let url = `${this.baseURL}${config.url}`;
      if (config.params) {
        const params = new URLSearchParams(config.params);
        url += `${url.includes('?') ? '&' : '?'}${params.toString()}`;
      }
      // 执行 Taro 请求
      const response = await Taro.request<BaseResponse<T>>({
        url,
        method: config.method || 'GET',
        data: config.data,
        header: {
          'Content-Type': 'application/json',
          ...config.header
        },
        timeout: config.timeout || this.timeout
      });
      // 响应后拦截
      this.responseInterceptor();
      // 统一处理响应数据
      if (response.statusCode === 200) {
        return response.data.data; // 只返回业务数据，和原逻辑一致
      } else {
        throw new Error(response.data?.message || `请求失败：${response.statusCode}`);
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  // GET 请求封装
  get<T = any>(config: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  // POST 请求封装
  post<T = any>(config: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' });
  }
}

export default new MyAxios(baseURL, TIMEOUT);