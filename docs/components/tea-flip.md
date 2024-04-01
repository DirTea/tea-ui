:::demo

```vue

<template>
  <tea-flip height="300px" width="500px">
    <template #front>
      <div style="background-color: #25599f;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center">
        <div style="color: white;font-size: 50px;">
          正面
        </div>
      </div>
    </template>
    <template #back>
      <div style="background-color: #009844;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center">
        <div style="color: white;font-size: 50px;">
          反面
        </div>
      </div>
    </template>
  </tea-flip>
</template>

```

:::
