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
      if (options?.props?.appendTo) {
        document
          .querySelector(options?.props.appendTo)
          .removeChild(dialogRef.value);
      } else {
        document.body.removeChild(dialogRef.value);
      }
      dialogRef.value = null;
    }
  };
  const div = document.createElement("div");
  if (options?.props?.appendTo) {
    document.querySelector(options?.props.appendTo).appendChild(div);
  } else {
    document.body.appendChild(div);
  }
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
  if (window.appContext) {
    vnode.appContext = window.appContext;
  }
  render(vnode, div);
  dialogRef.value = div;
};
