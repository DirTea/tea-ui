<script setup>
import TeaFlip from '../../src/components/flip/TeaFlip.vue'; 

</script>

<tea-flip height="500px" width="300px">
    <template #front>
      <div style="background-color: blue;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center">
        <div style="color: white;font-size: 50px;">
            正面
        </div>
      </div>
    </template>
    <template #back>
      <div style="background-color: green;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center">
        <div style="color: white;font-size: 50px;">
            反面
        </div>
      </div>
    </template>
</tea-flip>
