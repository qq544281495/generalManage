// 环境配置封装
const env = import.meta.env.MODE || "production";
const envConfig = {
  development: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/2dde45eab068a910c2b579b56daae095/api",
    // "https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api",
    mock: false,
  },
  production: {
    baseApi: "/",
    mockApi: "/",
    mock: false,
  },
};

export default {
  env,
  ...envConfig[env],
  namespace: "manage",
};
