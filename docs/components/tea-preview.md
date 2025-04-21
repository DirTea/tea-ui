# 文件预览

需要安装依赖"element-plus"

## 基础用法

:::demo

```vue
<template>
  <tea-preview
    src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg"
  ></tea-preview>
  <tea-preview-list
    :src="[
      'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg',
      'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.pdf',
    ]"
  >
  </tea-preview-list>
</template>
```

:::

## 属性

| 参数                | 说明                                | 类型                        | 可选值                                                       | 是否必填 | 默认值       |
| ----------------- | --------------------------------- | ------------------------- | --------------------------------------------------------- | ---- | --------- |
| baseUrl           | 图片基地址 | string                    | -                                                         | -    | ''        |
| src               | 图片源地址                             | string / []&lt;string&gt; | -                                                         | 是    | -         |
| height            | 高度                                | string                    | -                                                         | -    | '100px'   |
| width             | 宽度                                | string                    | -                                                         | -    | '100px'   |
| fit               | 如何适应容器                            | string                    | '' / 'contain' / 'cover' / 'fill' / 'none' / 'scale-down' | -    | 'contain' |
| previewTeleported | 是否插入至body元素上                      | boolean                   | -                                                         | -    | false     |
