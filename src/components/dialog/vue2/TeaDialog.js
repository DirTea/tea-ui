import TeaDialogInstance from "./TeaDialog.vue";
import { h, render } from "vue";

export const TeaDialog = (options) => {
  let dialogRef = null;
  const updateShow = (show) => {
    if (!show) {
      render(null, dialogRef);
      document.body.removeChild(dialogRef);
      dialogRef = null;
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
  dialogRef = div;
};
