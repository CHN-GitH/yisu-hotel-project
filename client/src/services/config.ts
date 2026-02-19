// 基础请求配置，补充 TS 类型
export const baseURL = "http://123.207.32.32:1888/api"; // 注意：原代码末尾有多余空格，已移除
export const TIMEOUT = 5000;

// 定义请求方法类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 定义通用请求配置类型
export interface RequestConfig {
  url: string;
  method?: RequestMethod;
  data?: Record<string, any>; // POST/PUT 请求体
  params?: Record<string, any>; // GET 请求参数
  header?: Record<string, string>; // 请求头
  timeout?: number;
}

// 定义通用响应数据类型
export interface BaseResponse<T = any> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}