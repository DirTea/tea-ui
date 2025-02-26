import TeaDialogInstance from "./TeaDialog.vue";
import { h, ref, render } from "vue";

interface optionsType {
  props?: any;
  content: any;
}

export const TeaDialog = (options: optionsType) => {
  const dialogRef = ref();
  const updateShow = (show: boolean) => {
    if (!show) {
      render(null, dialogRef.value);
      document.body.removeChild(dialogRef.value);
      dialogRef.value = null;
    }
  };
  const div = document.createElement("div");
  document.body.appendChild(div);
  const vnode = h(
    TeaDialogInstance,
    {
      modelValue: true,
      "onUpdate:modelValue": updateShow,
      appendTo: div,
      ...options?.props,
    },
    () => options.content,
  );
  render(vnode, div);
  dialogRef.value = div;
};
