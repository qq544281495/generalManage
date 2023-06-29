import storage from "@/utils/storage";
export default {
  namespaced: true,
  state: () => ({
    userInfo: { userName: "", userEmail: "" } || storage.getItem("userInfo"),
  }),
  getters: {
    GET_USER_INFO(state) {
      return state.userInfo;
    },
  },
  mutations: {
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
      storage.setItem("userInfo", userInfo);
    },
  },
  actions: {},
};
