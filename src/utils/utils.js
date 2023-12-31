// 工具类
export default {
  formateDate(date, rule) {
    let fmt = rule || "yyyy-MM-dd hh:mm:ss";
    const re = /(y+)/;
    if (re.test(fmt)) {
      const t = re.exec(fmt)[1];
      fmt = fmt.replace(t, (date.getFullYear() + "").substring(4 - t.length));
    }

    const o = {
      "M+": date.getMonth() + 1, // 月份
      "d+": date.getDate(), // 日
      "h+": date.getHours(), // 小时
      "m+": date.getMinutes(), // 分
      "s+": date.getSeconds(), // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
    };
    for (let k in o) {
      const regx = new RegExp("(" + k + ")");
      if (regx.test(fmt)) {
        const t = regx.exec(fmt)[1];
        fmt = fmt.replace(
          t,
          t.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return fmt;
  },
  getPermissionRoute(list) {
    let routes = [];
    const deep = (array) => {
      while (array.length) {
        let item = array.pop();
        if (item.action) {
          routes.push({
            name: item.component,
            path: item.path,
            component: item.component,
            meta: {
              title: item.menuName,
            },
          });
        }
        if (item.children && !item.action) {
          deep(item.children);
        }
      }
    };
    deep(list);
    return routes;
  },
  getNowTime(date, hours) {
    // 时间戳
    let timestamp = new Date(date.toLocaleDateString()).getTime();
    let nowDate = new Date(timestamp + hours * 60 * 60 * 1000);
    return this.formateDate(nowDate);
  },
};
