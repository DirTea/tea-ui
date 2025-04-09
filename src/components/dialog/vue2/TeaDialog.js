import TeaDialogInstance from "./TeaDialog.vue";
import { h, render } from "vue";

export const TeaDialog = (options) => {
  let dialogRef = null;
  const updateShow = (show) => {
    if (!show) {
      render(null, dialogRef);
      if (options?.props?.appendTo) {
        document
          .querySelector(options?.props.appendTo)
          .removeChild(dialogRef.value);
      } else {
        document.body.removeChild(dialogRef.value);
      }
      dialogRef = null;
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
  render(vnode, div);
  dialogRef = div;
};
