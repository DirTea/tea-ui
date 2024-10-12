# 排行榜

## 基础用法
:::demo
```vue
<template>
  <tea-rank rank_width="30vw" :list="list"></tea-rank>
</template>

<script setup>
import { ref } from 'vue'
const list = ref([
  { title: '第一名', value: 100 },
  { title: '第二名', value: 70 }, 
  { title: '第三名', value: 20 },
])
</script>
```
:::

## 在外部的标题和数值
:::demo
```vue
<template>
  <tea-rank rank_width="30vw" :list="list" type="outer"></tea-rank>
</template>

<script setup>
import { ref } from 'vue'
const list = ref([
  { title: '第一名', value: 100 },
  { title: '第二名', value: 70 },
  { title: '第三名', value: 20 },
])
</script>
```
:::

## 开启加载动画
:::demo
```vue
<template>
  <tea-rank rank_width="30vw" :list="list" :animation="true"></tea-rank>
</template>

<script setup>
import { ref } from 'vue'
const list = ref([
  { title: '第一名', value: 100 },
  { title: '第二名', value: 70 },
  { title: '第三名', value: 20 },
])
</script>
```
:::

## 属性
| 参数                 | 说明                                                | 类型                                               | 可选值               | 是否必填 | 默认值                           |
| ------------------ | ------------------------------------------------- | ------------------------------------------------ | ----------------- | ---- | ----------------------------- |
| list               | 数据列表                                              | [{ title:&lt;string&gt;, value:&lt;number&gt; }] | -                 | 是    | -                             |
| type               | 排行榜类型                                             | string                                           | 'inner' / 'outer' | -    | 'inner'                       |
| rank_width         | 整体宽度                                              | string                                           | -                 | -    | 'auto'                        |
| item_space         | 行间距                                               | string                                           | -                 | -    | '10px'                        |
| item_height        | 行高度                                               | string                                           | -                 | -    | 'auto'                        |
| text_space         | 文字离排行榜的距离                                         | string                                           | -                 | -    | '10px'                        |
| title_width        | 标题宽度                                              | string                                           | -                 | -    | 'auto'                        |
| top                | 只显示前几位，0代表全部                                      | number                                           | -                 | -    | 0 |
| max_value          | 最大值（若设置了100，则值为50的项长度会占总长度的一半）                    | number                                           | -                 | -    | 100                           |
| auto_computed      | 自动计算每项的长度，开启后max_value会失效，每项长度将以list中的最大value值来计算 | boolean                                          | -                 | -    | true                          |
| background         | 每项的背景颜色                                           | string                                           | -                 | -    | #25599f                       |
| is_order           | 是否自动排序                                            | boolean                                          | -                 | -    | true                          |
| asc                | 是否正序                                              | boolean                                          | -                 | -    | false                         |
| filed_title        | 指定标签属性名                                           | string                                           | -                 | -    | 'title'                       |
| filed_value        | 指定值属性名                                            | string                                           | -                 | -    | 'value'                       |
| animation          | 是否开启加载动画                                          | boolean                                          | -                 | -    | false                         |
| animation_duration | 动画时长                                              | number                                           | -                 | -    | 500                           |


