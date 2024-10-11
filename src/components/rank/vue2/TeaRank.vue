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

<script>
export default {
  props: {
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
  },
  data() {
    return {
      isMounted: false,
      rank_title: null,
      // 列表数据预处理
      afterList: [],
      titleWidth: "auto",
      titleWidthNum: 0,
    };
  },
  computed: {
    // 宽度计算
    widthComputed() {
      return (index) => {
        // 先计算最大值
        let maxValue = this.max_value;
        if (this.auto_computed) {
          this.afterList.forEach((item) => {
            if (item[this.filed_value] > maxValue) {
              maxValue = item[this.filed_value];
            }
          });
        }
        // 确保dom渲染后
        if (this.isMounted) {
          // 获取所有宽度
          let rankWidth = this.$refs["rank"].offsetWidth;
          let valueWidth = this.getMax(this.$refs["rank_value"], "offsetWidth");
          if (this.type === "inner") {
            return (
              this.titleWidthNum +
              valueWidth +
              (this.afterList[index][this.filed_value] / maxValue) *
                (rankWidth - this.titleWidthNum - valueWidth) +
              "px"
            );
          } else if (this.type === "outer") {
            return (
              (this.afterList[index][this.filed_value] / maxValue) *
                (rankWidth - this.titleWidthNum - valueWidth) +
              "px"
            );
          }
        } else {
          return "auto";
        }
      };
    },
    // 动画时长
    animationDurationComputed() {
      return this.animation ? `${this.animation_duration / 1000}s` : "0s";
    },
    // 背景色
    backgroundComputed() {
      return (index) => {
        if (Array.isArray(this.background)) {
          let bac = this.background[index % this.background.length];
          if (Array.isArray(bac)) {
            return `linear-gradient(to right, ${bac[0]}, ${bac[1]})`;
          } else {
            return bac;
          }
        } else {
          return this.background;
        }
      };
    },
  },
  methods: {
    // 排序
    startSort() {
      this.afterList = JSON.parse(JSON.stringify(this.list));
      if (this.is_sort) {
        for (let i = 0; i < this.afterList.length - 1; i++) {
          for (let j = 0; j < this.afterList.length - 1 - i; j++) {
            if (
              this.asc
                ? this.afterList[j][this.filed_value] >
                  this.afterList[j + 1][this.filed_value]
                : this.afterList[j][this.filed_value] <
                  this.afterList[j + 1][this.filed_value]
            ) {
              let temp = this.afterList[j];
              this.afterList[j] = this.afterList[j + 1];
              this.afterList[j + 1] = temp;
            }
          }
        }
      }
      if (this.top !== 0) {
        this.afterList = this.afterList.slice(0, this.top);
      }
    },
    getMax(list, prop) {
      return Math.max.apply(
        Math,
        list.map((item) => {
          return item[prop];
        }),
      );
    },
  },
  watch: {
    list: {
      handler: function () {
        this.startSort();
      },
      immediate: true,
    },
    rank_title: {
      handler: function () {
        if (this.title_width === "auto") {
          this.titleWidthNum = this.getMax(
            this.$refs["rank_title"],
            "offsetWidth",
          );
          this.titleWidth = this.titleWidthNum + "px";
        } else {
          this.titleWidth = this.title_width;
          this.$nextTick(() => {
            this.titleWidthNum = this.$refs["rank_title"][0].offsetWidth;
          });
        }
      },
    },
  },
  mounted() {
    this.isMounted = true;
    this.rank_title = this.$refs["rank_title"];
  },
};
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
