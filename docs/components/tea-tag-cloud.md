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
