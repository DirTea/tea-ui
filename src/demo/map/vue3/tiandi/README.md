需要在index.html文件中加入以下script

```html

<!-- 天地图测试使用，开发时请替换tk -->
<script src="http://api.tianditu.gov.cn/api?v=4.0&tk=*********" type="text/javascript"></script>
<!-- d3用于加载geojson文件 -->
<!-- 这两个文件加载较慢建议下载到本地 -->
<script src="http://cdn.bootcss.com/d3/3.5.17/d3.js " charset="utf-8"></script>
<script src="http://lbs.tianditu.gov.cn/api/js4.0/opensource/openlibrary/D3SvgOverlay.js"></script>
```
