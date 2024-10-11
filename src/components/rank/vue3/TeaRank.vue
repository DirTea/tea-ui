<template>
  <div ref="rank" class="rank" :style="{ width: rank_width }">
    <template v-for="(item, index) in afterList" :key="index">
      <div class="rank-item-outer">
        <div class="center">
          <div
            ref="rank_title"
            class="rank-prefix"
            v-if="type === 'outer'"
            :style="{ width: titleWidth }"
          >
            {{ item[filed_title] }}
          </div>
          <div
            class="rank-item"
            :style="{
              width: widthComputed(index),
              height: item_height,
              background: backgroundComputed(index),
            }"
          >
            <div
              v-if="type === 'inner'"
              ref="rank_title"
              class="rank-title rank-text-animation center"
              :style="{ width: titleWidth }"
            >
              {{ item[filed_title] }}
            </div>
            <div
              v-if="type === 'inner'"
              ref="rank_value"
              class="rank-value rank-text-animation center"
            >
              {{ item[filed_value] }}
            </div>
          </div>
        </div>
        <div ref="rank_value" class="rank-suffix" v-if="type === 'outer'">
          {{ item[filed_value] }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";

const rank = ref<Object>();
const rank_title = ref<Object>();
const rank_value = ref<Object>();

const props = defineProps({
  // 数据列表
  list: {
    type: Array,
    required: true,
  },
  // 排行榜类型
  type: {
    type: String,
    values: ["inner", "outer"],
    default: "inner",
  },
  // 排行榜整体宽度
  rank_width: {
    type: String,
    default: "auto",
  },
  // 每行间距
  item_space: {
    type: String,
    default: "10px",
  },
  // 每行高度
  item_height: {
    type: String,
    default: "24px",
  },
  // 文字离排行榜的距离
  text_space: {
    type: String,
    default: "10px",
  },
  // 标题文字宽度
  title_width: {
    type: String,
    default: "auto",
  },
  // 只显示前几位 0表示全部显示
  top: {
    type: Number,
    default: 0,
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
    type: [String, Array],
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

let isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});

// 列表数据预处理
let afterList = ref([]);
// 排序
const startSort = () => {
  afterList.value = JSON.parse(JSON.stringify(props.list));
  if (props.is_sort) {
    for (let i = 0; i < afterList.value.length - 1; i++) {
      for (let j = 0; j < afterList.value.length - 1 - i; j++) {
        if (
          props.asc
            ? afterList.value[j][props.filed_value] >
              afterList.value[j + 1][props.filed_value]
            : afterList.value[j][props.filed_value] <
              afterList.value[j + 1][props.filed_value]
        ) {
          let temp = afterList.value[j];
          afterList.value[j] = afterList.value[j + 1];
          afterList.value[j + 1] = temp;
        }
      }
    }
  }
  if (props.top !== 0) {
    afterList.value = afterList.value?.slice(0, props.top);
  }
};
watch(
  () => props.list,
  () => {
    startSort();
  },
  { immediate: true },
);

let titleWidth = ref("auto");
let titleWidthNum = ref(0);
watch(
  () => rank_title.value,
  () => {
    if (props.title_width === "auto") {
      titleWidthNum.value = getMax(rank_title.value, "offsetWidth");
      titleWidth.value = titleWidthNum.value + "px";
    } else {
      titleWidth.value = props.title_width;
      nextTick(() => {
        titleWidthNum.value = rank_title.value?.[0].offsetWidth;
      });
    }
  },
);

// 宽度计算
const widthComputed = computed(() => (index) => {
  // 先计算最大值
  let maxValue = props.max_value;
  if (props.auto_computed) {
    afterList.value.forEach((item) => {
      if (item[props.filed_value] > maxValue) {
        maxValue = item[props.filed_value];
      }
    });
  }
  // 确保dom渲染后
  if (isMounted.value) {
    // 获取所有宽度
    let rankWidth = rank.value?.offsetWidth;
    let valueWidth = getMax(rank_value.value, "offsetWidth");
    if (props.type === "inner") {
      return (
        titleWidthNum.value +
        valueWidth +
        (afterList.value[index][props.filed_value] / maxValue) *
          (rankWidth - titleWidthNum.value - valueWidth) +
        "px"
      );
    } else if (props.type === "outer") {
      return (
        (afterList.value[index][props.filed_value] / maxValue) *
          (rankWidth - titleWidthNum.value - valueWidth) +
        "px"
      );
    }
  } else {
    return "auto";
  }
});

const getMax = (list, prop) => {
  return Math.max.apply(
    Math,
    list.map((item) => {
      return item[prop];
    }),
  );
};

// 动画时长
const animationDurationComputed = computed(() => {
  return props.animation ? `${props.animation_duration / 1000}s` : "0s";
});

// 背景色
const backgroundComputed = computed(() => (index) => {
  if (Array.isArray(props.background)) {
    let bac = props.background[index % props.background.length];
    if (Array.isArray(bac)) {
      return `linear-gradient(to right, ${bac[0]}, ${bac[1]})`;
    } else {
      return bac;
    }
  } else {
    return props.background;
  }
});
</script>

<style scoped>
div {
  box-sizing: border-box;
}
.center {
  display: flex;
  align-items: center;
}
.rank {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.rank > :not([hidden]) ~ :not([hidden]) {
  margin-top: v-bind(item_space);
}
.rank-item-outer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.rank-item {
  display: flex;
  justify-content: space-between;
  border-radius: 20px;
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
  white-space: nowrap;
  margin-left: v-bind(text_space);
}
.rank-value {
  color: white;
  margin-right: v-bind(text_space);
}
.rank-prefix {
  flex-shrink: 0;
  padding-right: v-bind(text_space);
}
.rank-suffix {
  flex-shrink: 0;
  padding-left: v-bind(text_space);
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
