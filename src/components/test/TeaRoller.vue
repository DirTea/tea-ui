<script>
import { computed, h, ref, defineComponent } from "vue";

export default defineComponent({
  name: "TeaRoller",
  props: {
    width: {
      type: Number,
      default: 100,
    },
  },
  setup(props, { slots }) {
    const slotsDefault = slots.default();
    let renderList = [];
    const itemStack = ref([{ height: 0 }]);
    const renderer = () => {
      renderList = [];
      let totalHeight = 0;
      for (let i in slotsDefault) {
        renderList.push(
          h(slotsDefault[i], {
            rollerLength: slotsDefault.length,
            itemIndex: Number(i) + 1,
            itemStack: itemStack.value,
            onNext(offsetHeight) {
              console.log(777, offsetHeight);
              itemStack.value.push({ height: offsetHeight });
            },
            onPrev() {},
          }),
        );
        let height = slotsDefault[i].props?.height;
        totalHeight += height ? height : 100;
      }
      return h(
        "div",
        {
          style: `height: ${totalHeight}vh;width: ${props.width}vw`,
        },
        renderList,
      );
    };

    return () => renderer();
  },
});
</script>

<style scoped></style>
