<template>
  <div class="draggable-table">
    <el-table
        :data="tableData"
        :header-cell-style="headerState"
        :row-style="rowState"
        border
        row-key="id"
    >
      <el-table-column
          v-for="(col, index) in columns" :key="index"
          :label="col.label"
          :prop="col.prop"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {onMounted} from "vue"
import Sortable from 'sortablejs'
import {ElTable, ElTableColumn} from 'element-plus'

onMounted(() => {
  // 表格行拖拽
  rowDrop()
})

const rowDrop = () => {
  let tbody = document.querySelector(".el-table__body-wrapper tbody");
  Sortable.create(tbody, {
    // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
    group: {
      name: "words",
      pull: true,
      put: true,
    },
    animation: 150, // ms, number 单位：ms，定义排序动画的时间
    // 拖拽时候添加有新的节点
    onAdd: function (evt) {
      // console.log("onAdd.foo:", [evt.item, evt.from]);
    },
    // 拖拽更新节点位置
    onUpdate: function (evt) {
      // console.log("onUpdate.foo:", [evt.item, evt.from]);
    },
    // 删除拖拽节点
    onRemove: function (evt) {
      // console.log("onRemove.foo:", [evt.item, evt.from]);
    },
    // 开始拖拽
    onStart: function (evt) {
      // console.log("onStart.foo:", [evt.item, evt.from]);
    },
    // 发生排序发生该事件
    onSort: function (evt) {
      // console.log("onSort.foo:", [evt.item, evt.from]);
    },
    // 结束拖拽
    onEnd(evt) {
      // 如果拖拽结束后顺序发生了变化，则对数据进行修改
      if (evt.oldIndex !== evt.newIndex) {
        let currRow = tableData.splice(evt.oldIndex, 1)[0];
        tableData.splice(evt.newIndex, 0, currRow);
        // 将排序后的ID抽离成数组传给后端
        let optIDs = [];
        tableData.forEach((item) => {
          optIDs.push(item.ID);
        });
        console.log('重排后的数组', tableData)
      }
    },
  });
};
// 表格数据
const tableData = [
  {
    id: 1,
    name: 'Apple',
    price: 5.99,
    category: 'Fruit'
  },
  {
    id: 2,
    name: 'Banana',
    price: 2.99,
    category: 'Fruit'
  },
  {
    id: 3,
    name: 'Tomato',
    price: 1.99,
    category: 'Vegetable'
  },
  {
    id: 4,
    name: 'Carrot',
    price: 0.99,
    category: 'Vegetable'
  }
]
// 列
const columns = [
  {
    label: 'ID',
    prop: 'id',
  },
  {
    label: 'Name',
    prop: 'name',
  },
  {
    label: 'Price',
    prop: 'price',
  },
  {
    label: 'Category',
    prop: 'category',
  }
]

const headerState = () => {
  return {
    backgroundColor: '#25599f',
    color: 'white'
  }
}
const rowState = () => {
  return {
    backgroundColor: '#25599f',
    color: 'white'
  }
}
</script>

<style scoped>
:deep(.el-table--enable-row-hover) .el-table__body tr:hover > td.el-table__cell {
  background-color: #4473a2;
}

</style>
