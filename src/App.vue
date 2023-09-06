<template>
  <div>
    <count-to></count-to>
  </div>
  <div style="margin-top: 10px">
    <dialog @dialogVisible="dialogVisible">
      <div style="height: 200px;width: 400px;color: white;background-color: #25599f;display: flex;align-items: center;justify-content: center">
        这是弹出框，请自定义
      </div>
    </dialog>
    <hjkj-button @click="dialogVisible = true">弹出框</hjkj-button>
  </div>
  <div style="margin-top: 10px">
    <draggable-table></draggable-table>
  </div>
  <div style="margin-top: 10px">
    <rank rank_width="40vw"></rank>
  </div>
  <div style="margin-top: 10px">
    <tag-cloud :list="list" direction="right"></tag-cloud>
  </div>
</template>

<script setup>
import TagCloud from "./components/tag-cloud/HjkjTagCloud.vue";
import Rank from "./components/rank/HjkjRank.vue";
import DraggableTable from "./components/dragable-table/HjkjDraggableTable.vue";
import CountTo from "./components/count-to/HjkjCountTo.vue";
import HjkjButton from "./components/button/HjkjButton.vue";
import {ref} from "vue";

let dialogVisible = ref(false)
const list = [
  {html: "<div class='hover'>浙江</div>" },
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

<style scoped>
:deep(.hover) {
  color: #25599f;
}
</style>
