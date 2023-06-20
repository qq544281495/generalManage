import request from "../utils/request";
export default {
  login(data) {
    return request.post("/users/login", data, { mock: false });
  },
};
