<template>
  <tea-dialog v-model="dialogVisible" background="/src/assets/vue.svg">
    <div style="width: 500px;height: 500px"> 这是弹出框，请自定义</div>
  </tea-dialog>
  <tea-button @click="dialogVisible = true">弹出框</tea-button>
</template>

<script setup>
import {ref} from 'vue';
import TeaDialog from "./components/dialog/TeaDialog.vue";
import TeaButton from "./components/button/vue2/TeaButton.vue";
let dialogVisible = ref(false);
</script>

<style scoped>

</style>
