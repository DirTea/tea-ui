需要安装依赖
"@amap/amap-jsapi-loader": "^1.0.1",
"@amap/amap-jsapi-types": "^0.0.13",

记得修改aMapKey，并在项目的index.html文件加下添加如下

```html
<script type="text/javascript" >
  window._AMapSecurityConfig = {
    securityJsCode: "caa838cb22ee76eff5b6c973392e9e5d",
  }
</script>
```
