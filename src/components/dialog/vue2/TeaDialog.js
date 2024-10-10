import TeaDialogInstance from "./TeaDialog.vue";
import { h, render } from "vue";

let dialogRef = null;
export const TeaDialog = (options) => {
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
      ...options.props,
    },
    () => options.content,
  );
  render(vnode, div);
  dialogRef = div;
};
