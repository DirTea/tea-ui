<template>
  <div class="count-to">
    <div class="count-to-item" v-for="i in endValStr.length">
      <span :id='setId(i)'>0123456789</span>
    </div>
  </div>

</template>

<script setup>
import {onMounted} from "vue";

const props =  defineProps({
  // startVal: {
  //   type: Number,
  //   default: 0
  // },
  endVal: {
    type: Number,
    default: 894151
  },
  duration: {
    type: Number,
    default: 100
  }
})
let endValStr = props.endVal.toString()
let endValList = endValStr.split('')

const setId = (i) => {
  return "span-" + i
}
onMounted(()=> {
  for(let i=1;i<=endValList.length+1;i++) {
    let spanDom = document.getElementById('span-'+i)
    if(spanDom) {
      let start = 0
      let end = parseInt(endValList[i-1])
      let timer = setInterval(fn, props.duration);
      function fn() {
        start++
        if(start>end+1){
          spanDom.style.transition = `none`
          start = 0
          clearInterval(timer)
        } else {
          spanDom.style.transition = `transform ${props.duration}ms ease-in-out`
        }
        spanDom.style.transform = `translate(-50%,-${start/10*100-12}%)`
      }
    }

  }

})

</script>

<style scoped>
.count-to {
  display: flex;
}
.count-to-item {
  border: rgba(0, 205, 226, 1) 1px solid;
  height: 60px;
  width: 48px;
  background: #25599f;
  margin: 0 3px;
  overflow: hidden;
}
span{
  position: relative;
  left: 50%;
  color: white;
  font-size: 36px;
  font-weight: 700;
  transform: translate(-50%,2%);
  transition: transform 500ms ease-in-out;
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 17px;
}

</style>
