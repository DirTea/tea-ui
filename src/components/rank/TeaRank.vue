<template>
  <div ref="rank" class="rank" :style="{ width: rank_width }">
    <div
      v-for="(item, index) in sortList"
      :key="index"
      class="rank-item"
      :style="{ width: widthComputed(index) }"
    >
      <div
        ref="rank_title"
        class="rank-title rank-text-animation"
        :style="{ width: title_width }"
      >
        {{ item[filed_title] }}
      </div>
      <div class="rank-value rank-text-animation">{{ item[filed_value] }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

const rank = ref(null);
const rank_title = ref(null);

const props = defineProps({
  // 数据列表
  list: {
    type: Array,
    required: true,
  },
  // 每行间距
  space: {
    type: String,
    default: "5px",
  },
  // 排行榜整体宽度
  rank_width: {
    type: String,
    default: "auto",
  },
  // 标题文字宽度
  title_width: {
    type: String,
    default: "auto",
  },
  // 最大值
  max_value: {
    type: Number,
    default: 100,
  },
  // 开启后max_value将失效，宽度将以list中的最大value值来计算
  auto_computed: {
    type: Boolean,
    default: true,
  },
  // item背景颜色
  background: {
    type: String,
    default: "#25599f",
  },
  // 是否排序
  is_sort: {
    type: Boolean,
    default: true,
  },
  // 是否正序
  asc: {
    type: Boolean,
    default: false,
  },
  // 指定选项标签
  filed_title: {
    type: String,
    default: "title",
  },
  // 指定选项的值
  filed_value: {
    type: String,
    default: "value",
  },
  // 是否开启动画
  animation: {
    type: Boolean,
    default: false,
  },
  // 动画时长 单位ms
  animation_duration: {
    type: Number,
    default: 500,
  },
});
// 列表数据预处理

// 排序
let sortList = [];
const startSort = () => {
  sortList = JSON.parse(JSON.stringify(props.list));
  if (props.is_sort) {
    for (let i = 0; i < sortList.length - 1; i++) {
      for (let j = 0; j < sortList.length - 1 - i; j++) {
        if (
          props.asc
            ? sortList[j][props.filed_value] >
              sortList[j + 1][props.filed_value]
            : sortList[j][props.filed_value] <
              sortList[j + 1][props.filed_value]
        ) {
          let temp = sortList[j];
          sortList[j] = sortList[j + 1];
          sortList[j + 1] = temp;
        }
      }
    }
  }
};
startSort();

// 宽度计算
const widthComputed = computed(() => (index) => {
  if (rank.value && rank_title.value) {
    let rankWidth = rank.value.offsetWidth;
    let titleWidth = rank_title.value[0].offsetWidth;
    if (props.auto_computed) {
      let maxValue = sortList[0][props.filed_value];
      sortList.forEach((item) => {
        if (item[props.filed_value] > maxValue) {
          maxValue = item[props.filed_value];
        }
      });
      return (
        titleWidth +
        (sortList[index][props.filed_value] / maxValue) *
          (rankWidth - titleWidth) +
        "px"
      );
    } else {
      return (
        titleWidth +
        (sortList[index][props.filed_value] / props.max_value) *
          (rankWidth - titleWidth) +
        "px"
      );
    }
  } else {
    return "auto";
  }
});

// 动画时长
const animationDurationComputed = computed(() => {
  return props.animation ? `${props.animation_duration / 1000}s` : "0s";
});
</script>

<style scoped>
div {
  box-sizing: border-box;
}
.rank {
  display: flex;
  flex-direction: column;
}
.rank > :not([hidden]) ~ :not([hidden]) {
  margin-top: v-bind(space);
}
.rank-item {
  display: flex;
  justify-content: space-between;
  background: v-bind(background);
  border-radius: 20px;
  padding: 0 10px;
  animation: widthAnimation v-bind(animationDurationComputed);
}
@keyframes widthAnimation {
  0% {
    transform: scaleX(0);
    transform-origin: left;
  }
  100% {
    transform: scaleX(1);
    transform-origin: left;
  }
}
.rank-title {
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rank-value {
  color: white;
  margin-left: 5px;
}
.rank-text-animation {
  animation: textAnimation v-bind(animationDurationComputed);
  animation-delay: v-bind(animationDurationComputed);
  animation-fill-mode: forwards;
  opacity: v-bind("animation ? 0 : 1");
}
@keyframes textAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
