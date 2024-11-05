import DefaultTheme from "vitepress/theme";
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import "vitepress-theme-demoblock/dist/theme/styles/index.css";
import { useComponents } from "./useComponents";
import TeaButton from "../../../src/components/button/vue3/TeaButton.vue";
import TeaCountTo from "../../../src/components/count-to/vue3/TeaCountTo.vue";
import TeaDialog from "../../../src/components/dialog/vue3/TeaDialog.vue";
import TeaFlip from "../../../src/components/flip/vue3/TeaFlip.vue";
import TeaPreview from "../../../src/components/preview/vue3/TeaPreview.vue";
import TeaPreviewList from "../../../src/components/preview/vue3/TeaPreviewList.vue";
import TeaRank from "../../../src/components/rank/vue3/TeaRank.vue";
import TeaTagCloud from "../../../src/components/tag-cloud/TeaTagCloud.vue";
import TeaChartDoughnut from "../../../src/demo/echarts/vue3/TeaChartDoughnut.vue";
import TeaChartPolar from "../../../src/demo/echarts/vue3/TeaChartPolar.vue";
import TeaDraggableTable from "../../../src/demo/draggable-table/vue3/TeaDraggableTable.vue";
export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.use(ElementPlus);
    useComponents(ctx.app);
    ctx.app.component("tea-button", TeaButton);
    ctx.app.component("tea-count-to", TeaCountTo);
    ctx.app.component("tea-dialog", TeaDialog);
    ctx.app.component("tea-flip", TeaFlip);
    ctx.app.component("tea-preview", TeaPreview);
    ctx.app.component("tea-preview-list", TeaPreviewList);
    ctx.app.component("tea-rank", TeaRank);
    ctx.app.component("tea-tag-cloud", TeaTagCloud);
    ctx.app.component("tea-chart-doughnut", TeaChartDoughnut);
    ctx.app.component("tea-chart-polar", TeaChartPolar);
    ctx.app.component("tea-draggable-table", TeaDraggableTable);
  },
};
