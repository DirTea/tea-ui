import DefaultTheme from "vitepress/theme";
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import "vitepress-theme-demoblock/dist/theme/styles/index.css";
import { useComponents } from "./useComponents";
import TeaButton from "../../../src/components/button/vue3/TeaButton.vue";
import TeaCountTo from "../../../src/components/count-to/TeaCountTo.vue";
import TeaDialog from "../../../src/components/dialog/TeaDialog.vue";
import TeaFlip from "../../../src/components/flip/TeaFlip.vue";
import TeaPreview from "../../../src/components/preview/TeaPreview.vue";
import TeaPreviewList from "../../../src/components/preview/TeaPreviewList.vue";
import TeaRank from "../../../src/components/rank/TeaRank.vue";
import TeaRollerItem from "../../../src/components/roller/vue3/TeaRollerItem.vue";
import TeaRoller from "../../../src/components/roller/vue3/TeaRoller.vue";
import TeaTagCloud from "../../../src/components/tag-cloud/TeaTagCloud.vue";
import TeaDoughnutChart from "../../../src/demo/echarts/vue2/TeaDoughnutChart.vue";
import TeaDraggableTable from "../../../src/demo/draggable-table/TeaDraggableTable.vue";
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
    ctx.app.component("tea-roller-item", TeaRollerItem);
    ctx.app.component("tea-roller", TeaRoller);
    ctx.app.component("tea-tag-cloud", TeaTagCloud);
    ctx.app.component("tea-doughnut-chart", TeaDoughnutChart);
    ctx.app.component("tea-draggable-table", TeaDraggableTable);
  },
};
