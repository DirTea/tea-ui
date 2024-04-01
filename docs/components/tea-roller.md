阳bug，还得改

:::demo

```vue

<template>
  <div style="height: 50vh;overflow: scroll">
    <tea-roller :width="30">
      <tea-roller-item :height="40">
        <div
            style="width: 100%;height: 100%;border: 1px white solid;background-color: black;display: flex;justify-content: center;align-items: center;">
          <span style="font-size: 50px;;color: white">1</span>
        </div>
      </tea-roller-item>
      <tea-roller-item :height="40">
        <div
            style="width: 100%;height: 100%;border: 1px white solid;background-color: black;display: flex;justify-content: center;align-items: center;">
          <span style="font-size: 50px;;color: white">2</span>
        </div>
      </tea-roller-item>
      <tea-roller-item :height="40">
        <div
            style="width: 100%;height: 100%;border: 1px white solid;background-color: black;display: flex;justify-content: center;align-items: center;">
          <span style="font-size: 50px;;color: white">3</span>
        </div>
      </tea-roller-item>
      <tea-roller-item :height="40">
        <div
            style="width: 100%;height: 100%;border: 1px white solid;background-color: black;display: flex;justify-content: center;align-items: center;">
          <span style="font-size: 50px;;color: white">4</span>
        </div>
      </tea-roller-item>
    </tea-roller>
  </div>
</template>

```

:::



