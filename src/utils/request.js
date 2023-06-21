// axios封装
import axios from "axios";
import config from "@/config";
import { ElMessage } from "element-plus";
import router from "@/router";
import storage from "./storage";

// 定义请求错误常量
const TOKEN_ERROR = "身份认证失败，请重新登录";
const NETWORK_ERROR = "请求地址错误或网络异常，请稍后重试";

// 创建axios实例对象
const service = axios.create({
  baseURL: config.baseURL,
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use((request) => {
  const headers = request.headers;
  const token = storage.getItem("userInfo").token || "";
  if (!headers.Authorization) headers.Authorization = "Bearer " + token;
  return request;
});

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data;
    if (code === 200) {
      return data;
    } else if (code === 50001) {
      ElMessage.error(TOKEN_ERROR);
      setTimeout(() => {
        router.push({
          path: "/login",
        });
      }, 1000);
      return Promise.reject(TOKEN_ERROR);
    } else {
      ElMessage.error(message || NETWORK_ERROR);
      return Promise.reject(message || NETWORK_ERROR);
    }
  },
  (error) => {
    ElMessage.error(NETWORK_ERROR);
    return Promise.reject(error);
  }
);

// 请求方法
function request(options) {
  options.method = options.method || "get";
  // 当为get请求时将data赋值给params，请求直接传入data
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }
  if (config.env === "production") {
    service.defaults.baseURL = config.baseApi;
  } else {
    const mock = typeof options.mock === undefined ? config.mock : options.mock;
    service.defaults.baseURL = mock ? config.mockApi : config.baseApi;
  }
  return service(options);
}

["get", "post", "put", "delete", "patch"].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      method: item,
      data,
      ...options,
    });
  };
});

export default request;
