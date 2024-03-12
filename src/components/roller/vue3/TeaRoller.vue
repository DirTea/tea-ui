<script>
import {h, ref} from 'vue'

export default {
  props: {
    width: {
      type: Number
    }
  },
  setup(props, content) {
    const nowIndex = ref([0])
    const slots = content.slots.default()
    let renderList = []
    const renderer = () => {
      renderList = []
      let itemOffset = 0
      for (let i in slots) {
        renderList.push(h(slots[i], {
          rollerLength: slots.length,
          itemIndex: Number(i),
          itemStack: nowIndex.value,
          itemOffset: itemOffset,
          rollerWidth: props.width,
          onNext(index) {
            nowIndex.value.push(index)
          },
          onPrev() {
            nowIndex.value.pop()
          }
        }))
        itemOffset += slots[i].props?.height ? slots[i].props.height : 100
      }
      return h('div', {}, renderList)
    }

    return () => renderer()
  }
}


</script>

<style lang="scss" scoped>

</style>
