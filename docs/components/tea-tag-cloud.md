# 标签云

## 基础用法

:::demo

```vue
<template>
  <tea-tag-cloud :list="list" direction="right"></tea-tag-cloud>
</template>
<script setup>
const list = [
    {html: "<div class='hover'>浙江</div>"},
    {html: "<div class='hover'>上海</div>"},
    {html: "<div class='hover'>江苏</div>"},
    {html: "<div class='hover'>福建</div>"},
    {html: "<div class='hover'>湖南</div>"},
    {html: "<div class='hover'>湖北</div>"},
    {html: "<div class='hover'>江西</div>"},
    {html: "<div class='hover'>河北</div>"},
    {html: "<div class='hover'>河南</div>"},
]
</script>
```

:::

## 属性

| 参数        | 说明       | 类型                                             | 可选值                              | 是否必填 | 默认值     |
| --------- | -------- | ---------------------------------------------- | -------------------------------- | ---- | ------- |
| list      | 数据列表     | [{ html:&lt;string&gt;, href:&lt;string&gt; }] | -                                | 是    | []      |
| size      | 尺寸大小     | number             | -                                | -    | 300     |
| direction | 向某方向固定旋转 | enum                                           | 'right' / 'left' / 'up' / 'down' | -    | 'right' |
