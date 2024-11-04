# element-plus可拖拽表格

warning：非组件，请安装相应依赖后，直接复制粘贴代码并调整修改部分代码使用

:::demo

```vue
<template>
  <div class="draggable-table">
    <VueDraggable
      v-model="tableData"
      target="tbody"
      :animation="150"
      @change="onChange"
    >
      <el-table
        :data="tableData"
        :header-cell-style="headerState"
        :row-style="rowState"
        border
        row-key="id"
      >
        <el-table-column
          v-for="(col, index) in columns"
          :key="index"
          :label="col.label"
          :prop="col.prop"
        >
        </el-table-column>
      </el-table>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import { VueDraggable } from "vue-draggable-plus";

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: "Apple",
    price: 5.99,
    category: "Fruit",
  },
  {
    id: 2,
    name: "Banana",
    price: 2.99,
    category: "Fruit",
  },
  {
    id: 3,
    name: "Tomato",
    price: 1.99,
    category: "Vegetable",
  },
  {
    id: 4,
    name: "Carrot",
    price: 0.99,
    category: "Vegetable",
  },
]);
// 列
const columns = ref([
  {
    label: "ID",
    prop: "id",
  },
  {
    label: "Name",
    prop: "name",
  },
  {
    label: "Price",
    prop: "price",
  },
  {
    label: "Category",
    prop: "category",
  },
]);

const onChange = () => {
  console.log(tableData.value);
};

const headerState = () => {
  return {
    backgroundColor: "#25599f",
    color: "white",
  };
};
const rowState = () => {
  return {
    backgroundColor: "#25599f",
    color: "white",
  };
};
</script>

<style scoped>
:deep(.el-table--enable-row-hover)
  .el-table__body
  tr:hover
  > td.el-table__cell {
  background-color: #4473a2;
}
</style>
```

:::
