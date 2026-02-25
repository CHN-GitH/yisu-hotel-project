export const baseURL = "http://123.207.32.32:1888/api";
export const TIMEOUT = 5000;

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestConfig {
  url: string;
  method?: RequestMethod;
  data?: Record<string, any>;
  params?: Record<string, any>;
  header?: Record<string, string>;
  timeout?: number;
  baseURL?: string;
}

// 接口返回的基础结构
export interface BaseResponse<T = any> {
  _id: string;
  trace: string | null;
  referTraceId: string;
  ver: string;
  ret: boolean;
  errmsg: string | null;
  errTip: string | null;
  errcode: number;
  data: T;
}