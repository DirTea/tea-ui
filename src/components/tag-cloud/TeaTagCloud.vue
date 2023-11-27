<template>
  <div id="tagsList">
    <template v-for="(item,index) in list" :key="index">
      <a :href="item.href ? item.href : ''">
        <div v-if="item.html" v-html="item.html"></div>
      </a>
    </template>
  </div>
</template>

<script setup>

const props = defineProps({
  // 数据列表
  list: {
    type: Array,
    default: ()=>  [],
    required: true
  },
  // 尺寸大小 px
  size: {
    type: Number,
    default: 300
  },
  // 向某方向固定旋转
  direction: {
    type: String
  }

})

let diameter = props.size // 直径
let radius = (diameter-100)/2; // 球体半径
let dtr = Math.PI / 180; // 角度转弧度
var d = 300;
var mcList = [];
let active = false; // 是否激活旋转
var lasta = 1;
var lastb = 1;
var distr = true;
let tspeed = 3; // 旋转速度
var size = props.size;

let mouseX = 0; // 鼠标在x轴的位置
let mouseY = 0; // 鼠标在y轴的位置

var howElliptical = 1;

var aA = null;
var oDiv = null;

var sa = 0
var ca = 0
var sb = 0
var cb = 0
var sc = 0
var cc = 0

window.onload = function () {
  var oTag = null;

  oDiv = document.getElementById('tagsList');
  aA = oDiv.getElementsByTagName('a');

  for (let i = 0; i < aA.length; i++) {
    oTag = {};
    oTag.offsetWidth = aA[i].offsetWidth;
    oTag.offsetHeight = aA[i].offsetHeight;
    mcList.push(oTag);
  }

  sineCosine(0, 0, 0);

  positionAll();

  // 直接激活
  if(props.direction) {
    active = true;
    switch (props.direction) {
      case 'right':
        mouseX = 10
        mouseY = 0
        break
      case 'left':
        mouseX = -10
        mouseY = 0
        break
      case 'up':
        mouseX = 0
        mouseY = 10
        break
      case 'down':
        mouseX = 0
        mouseY = -10
        break
    }
  } else {
    // 通过鼠标滚动球体
    oDiv.onmouseover = function () {
      active = true;
    };
    oDiv.onmouseout = function () {
      active = true;
    };
    oDiv.onmousemove = function (ev) {
      var oEvent = window.event || ev;
      mouseX = oEvent.clientX - (oDiv.offsetLeft + oDiv.offsetWidth / 2);
      mouseY = oEvent.clientY - (oDiv.offsetTop + oDiv.offsetHeight / 2);
      mouseX /= 5;
      mouseY /= 5;
    };
  }
  setInterval(update, 10);
};
function update() {
  var a;
  var b;
  if (active) {
    a = (-Math.min(Math.max(-mouseY, -size), size) / radius) * tspeed;
    b = (Math.min(Math.max(-mouseX, -size), size) / radius) * tspeed;
  }
  else {
    a = lasta * 0.98;
    b = lastb * 0.98;
  }
  lasta = a;
  lastb = b;

  if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
    return;
  }

  var c = 0;
  sineCosine(a, b, c);
  var per;
  for (let j = 0; j < mcList.length; j++) {
    var rx1 = mcList[j].cx;
    var ry1 = mcList[j].cy * ca + mcList[j].cz * (-sa);
    var rz1 = mcList[j].cy * sa + mcList[j].cz * ca;

    var rx2 = rx1 * cb + rz1 * sb;
    var ry2 = ry1;
    var rz2 = rx1 * (-sb) + rz1 * cb;

    var rx3 = rx2 * cc + ry2 * (-sc);
    var ry3 = rx2 * sc + ry2 * cc;
    var rz3 = rz2;

    mcList[j].cx = rx3;
    mcList[j].cy = ry3;
    mcList[j].cz = rz3;

    per = d / (d + rz3);

    mcList[j].x = (howElliptical * rx3 * per) - (howElliptical * 2);
    mcList[j].y = ry3 * per;
    mcList[j].scale = per;
    mcList[j].alpha = per;

    mcList[j].alpha = (mcList[j].alpha - 0.6) * (10 / 6);
  }

  doPosition();
  depthSort();
}

function depthSort() {
  var i = 0;
  var aTmp = [];

  for (i = 0; i < aA.length; i++) {
    aTmp.push(aA[i]);
  }

  aTmp.sort(function (vItem1, vItem2) {
    if (vItem1.cz > vItem2.cz) {
      return -1;
    }
    else if (vItem1.cz < vItem2.cz) {
      return 1;
    }
    else {
      return 0;
    }
  });
  for (i = 0; i < aTmp.length; i++) {
    aTmp[i].style.zIndex = i;
  }
}
function positionAll() {
  var phi = 0;
  var theta = 0;
  var max = mcList.length;

  var aTmp = [];
  var oFragment = document.createDocumentFragment();

  //随机排序
  for (let i = 0; i < aA.length; i++) {
    aTmp.push(aA[i]);
  }

  aTmp.sort(function () {
    return Math.random() < 0.5 ? 1 : -1;
  });
  for (let i = 0; i < aTmp.length; i++) {
    oFragment.appendChild(aTmp[i]);
  }
  oDiv.appendChild(oFragment);
  for (let i = 1; i < max + 1; i++) {
    if (distr) {
      phi = Math.acos(-1 + (2 * i - 1) / max);
      theta = Math.sqrt(max * Math.PI) * phi;
    }
    else {
      phi = Math.random() * (Math.PI);
      theta = Math.random() * (2 * Math.PI);
    }
    //坐标变换
    mcList[i - 1].cx = radius * Math.cos(theta) * Math.sin(phi);
    mcList[i - 1].cy = radius * Math.sin(theta) * Math.sin(phi);
    mcList[i - 1].cz = radius * Math.cos(phi);

    aA[i - 1].style.left=mcList[i - 1].cx+oDiv.offsetWidth /2-mcList[i - 1].offsetWidth/2+'px';
    aA[i - 1].style.top=mcList[i - 1].cy+oDiv.offsetHeight/2-mcList[i - 1].offsetHeight/2+'px';
  }
}
//
function doPosition() {
  var l = oDiv.offsetWidth / 2;
  var t = oDiv.offsetHeight / 2;
  for (var i = 0; i < mcList.length; i++) {
    aA[i].style.left = mcList[i].cx + l - mcList[i].offsetWidth / 2 + 'px';
    aA[i].style.top = mcList[i].cy + t - mcList[i].offsetHeight / 2 + 'px';

    // aA[i].style.fontSize = Math.ceil(12 * mcList[i].scale / 2) + 8 + 'px';
    aA[i].style.fontSize = '16px'

    aA[i].style.filter = "alpha(opacity=" + 100 * mcList[i].alpha + ")";
    aA[i].style.opacity = mcList[i].alpha; // 透明度
  }
}
// 计算abc的sin值和cos值
function sineCosine(a, b, c) {
  sa = Math.sin(a * dtr);
  ca = Math.cos(a * dtr);
  sb = Math.sin(b * dtr);
  cb = Math.cos(b * dtr);
  sc = Math.sin(c * dtr);
  cc = Math.cos(c * dtr);
}
</script>

<style scoped>
#tagsList {
  position: relative;
  width: v-bind(diameter + 'px');
  height: v-bind(diameter + 'px');
}
#tagsList a {
  position: absolute;
  top: 0;
  left: 0;
  font-family: Microsoft YaHei,serif;
  font-weight: bold;
  text-decoration: none;
  padding: 3px 6px;
  white-space: nowrap;
  color: #000;
}

</style>
