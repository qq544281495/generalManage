import storage from "@/utils/storage";
export default {
  namespaced: true,
  state: () => ({
    userInfo: storage.getItem("userInfo") || {},
    userMenu: storage.getItem("userMenu") || [],
    userButton: storage.getItem("userButton") || [],
  }),
  getters: {
    GET_USER_INFO(state) {
      return state.userInfo;
    },
    GET_USER_MENU(state) {
      return state.userMenu;
    },
    GET_USER_BUTTON(state) {
      return state.userButton;
    },
  },
  mutations: {
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
      storage.setItem("userInfo", userInfo);
    },
    SET_USER_MENU(state, userMenu) {
      state.userMenu = userMenu;
      storage.setItem("userMenu", userMenu);
    },
    SET_USER_BUTTON(state, userButton) {
      state.userButton = userButton;
      storage.setItem("userButton", userButton);
    },
  },
  actions: {},
};
