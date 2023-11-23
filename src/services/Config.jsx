export default class Config {
  static getAllPagesConfig() {
    return new Promise((resolve) => {
      const appConfig = this.getPageConfig("app", "./config/AppConfig.json");
      const dashboard = this.getPageConfig(
        "dashboard",
        "./config/PagesConfig/Dashboard.json",
      );
      const detail = this.getPageConfig(
        "detail",
        "./config/PagesConfig/Detail.json",
      );
      Promise.all([appConfig, dashboard, detail]).then((values) => {
        const config = {};
        for (let i = 0; i < values.length; i += 1) {
          const item = values[i];
          config[item.configName] = item;
        }
        resolve(config);
      });
    });
  }

  static getPageConfig(name, path) {
    return new Promise((resolve) => {
      fetch(path).then((response) => {
        response.json().then((res) => {
          const data = res;
          data.configName = name;
          resolve(data);
        });
      });
    });
  }
}
