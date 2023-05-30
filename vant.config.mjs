export default {
  name: 'app-component',
  build: {
    css: {
      preprocessor: 'less',
    },
    site: {
      publicPath: './',
    },
  },
  site: {
    title: 'app-component',
    logo: 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
    nav: [
      {
        title: '开发指南',
        items: [
          {
            path: 'home',
            title: '介绍',
          },
          {
            path: 'quickstart',
            title: '快速上手',
          },
        ],
      },
      {
        title: '基础组件',
        items: [
          {
            path: 'floating-panel',
            title: '浮动面板',
          },
          {
            path: 'keyboard',
            title: '车牌键盘',
          },
        ],
      },
    ],
  },
};
