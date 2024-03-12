export default {
    title: 'TEA-UI',
    titleTemplate: '非常规组件库',
    description: 'TeaUI组件库',
    themeConfig: {
        sidebar: [
            {
                text: '组件',
                items: [
                    {text: '按钮', link: '/components/tea-button'},
                    {text: '计数', link: '/components/tea-count-to'},
                    {text: '弹出框', link: '/components/tea-dialog'},
                    {text: '排行榜', link: '/components/tea-rank'},
                    {text: '翻转', link: '/components/tea-flip'},
                    {text: '卷帘', link: '/components/tea-roller'},
                    {text: '标签云', link: '/components/tea-tag-cloud'},
                ]
            },
            {
                text: '非组件',
                items: [
                    {text: 'element-plus可拖拽表格', link: '/demo/tea-draggable-table'},
                    {text: 'echarts环状图', link: '/demo/tea-doughnut-chart'},
                ]
            }
        ]
    }
}
