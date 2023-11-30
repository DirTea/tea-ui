<script setup>
import TeaDialog from '../src/components/dialog/TeaDialog.vue'; 
import TeaButton from '../src/components/button/vue3/TeaButton.vue';
import {ref} from "vue";

let dialogVisible = ref(false);
</script>

<TeaDialog v-model="dialogVisible">
  <div
      style="height: 200px;width: 400px;color: white;background-color: #25599f;display: flex;align-items: center;justify-content: center">
    这是弹出框，请自定义
  </div>
</TeaDialog>
<TeaButton @click="dialogVisible = true">弹出框</TeaButton>

