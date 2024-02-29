<script setup>
import Roller from '../../src/components/roller/vue3/TeaRoller.vue';
import RollerItem from "../../src/components/roller/vue3/TeaRollerItem.vue";
</script>



<Roller :width="30">
  <RollerItem :height="100">
    <div
        style="width: 100%;height: 100%;border: 1px white solid;background-color: black;display: flex;justify-content: center;align-items: center;">
      <span style="font-size: 50px;;color: white">1</span>
    </div>
  </RollerItem>
  <RollerItem :height="100">
    <div
        style="width: 100%;height: 100%;border: 1px white solid;background-color: black;display: flex;justify-content: center;align-items: center;">
      <span style="font-size: 50px;;color: white">2</span>
    </div>
  </RollerItem>
  <RollerItem :height="100">
    <div
        style="width: 100%;height: 100%;border: 1px white solid;background-color: black;display: flex;justify-content: center;align-items: center;">
      <span style="font-size: 50px;;color: white">3</span>
    </div>
  </RollerItem>
  <RollerItem :height="100">
    <div
        style="width: 100%;height: 100%;border: 1px white solid;background-color: black;display: flex;justify-content: center;align-items: center;">
      <span style="font-size: 50px;;color: white">4</span>
    </div>
  </RollerItem>
</Roller>







