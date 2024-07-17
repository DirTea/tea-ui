<script>
import { computed, h, ref, defineComponent } from "vue";

export default defineComponent({
  name: "TeaRoller",
  props: {
    height: {
      type: Number,
    },
    width: {
      type: [Number, String],
    },
  },
  setup(props, { slots }) {
    const nowIndex = ref([0]);
    const slotsDefault = slots.default();
    let renderList = [];
    // const parseHeight = computed(() => {
    //   return typeof props.height === "number"
    //     ? props.height + "px"
    //     : props.height;
    // });
    const parseWidth = computed(() => {
      return typeof props.width === "number" ? props.width + "px" : props.width;
    });
    const renderer = () => {
      renderList = [];
      let itemOffset = 0;
      for (let i in slotsDefault) {
        renderList.push(
          h(slotsDefault[i], {
            rollerLength: slotsDefault.length,
            itemIndex: Number(i),
            itemStack: nowIndex.value,
            itemOffset: itemOffset,
            rollerWidth: parseWidth.value,
            onNext(index) {
              nowIndex.value.push(index);
            },
            onPrev() {
              nowIndex.value.pop();
            },
          }),
        );
        itemOffset += slotsDefault[i].props?.height
          ? slotsDefault[i].props.height
          : 100;
      }
      return h(
        "div",
        {
          style: `height: ${props.height}vh;width: ${parseWidth.value}`,
          class: "roller",
        },
        renderList,
      );
    };

    return () => renderer();
  },
});
</script>

<style scoped>
.roller {
  overflow: scroll;
}
.roller::-webkit-scrollbar {
  display: none;
}
</style>
