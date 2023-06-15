// 环境配置封装
const env = import.meta.env.MODE || "production";
const envConfig = {
  development: {
    baseApi: "localhost:3000",
    mockApi:
      "https://www.fastmock.site/mock/2dde45eab068a910c2b579b56daae095/api",
  },
  production: {
    baseApi: "/",
    mockApi: "/",
  },
};

export default {
  env,
  mock: true,
  ...envConfig[env],
};
