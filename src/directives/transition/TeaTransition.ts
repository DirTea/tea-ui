const elementStates = new WeakMap<
  HTMLElement,
  {
    isFirstLoad: boolean;
    height: number;
    width: number;
    padding: string[];
  }
>();
const onSetStatus = (
  el: HTMLElement,
  value: boolean,
  arg: string | undefined,
) => {
  let argList = arg?.toLowerCase().replace(",", "|").split("|");
  if (arg === undefined) argList = ["height"];
  argList = argList?.map((item: string) => {
    if (item === "height" || item === "h" || item === "col") {
      item = "height";
    } else if (item === "width" || item === "w" || item === "row") {
      item = "width";
    } else if (item === "opacity" || item === "o") {
      item = "opacity";
    } else {
      console.log("arg指令参数非法");
    }
    return item;
  });
  let heightC = elementStates.get(el).height + "px";
  let widthC = elementStates.get(el).width + "px";
  const transitionList: string[] = [];
  argList?.forEach((item: string) => {
    if (item === "height") {
      transitionList.push("height 0.5s");
      heightC = "0px";
    }
    if (item === "width") {
      transitionList.push("width 0.5s");
      widthC = "0px";
    }
    if (item === "opacity") {
      transitionList.push("opacity 0.5s");
    }
  });
  if (value) {
    elementStates.get(el).isFirstLoad = false;
    el.setAttribute(
      "style",
      setConvertStyle({
        height: elementStates.get(el).height + "px",
        width: elementStates.get(el).width + "px",
        opacity: 1,
        transition: transitionList.join(","),
        overflow: "hidden",
        padding: elementStates.get(el).padding.join(" "),
      }),
    );
  } else {
    if (elementStates.get(el).isFirstLoad) {
      el.setAttribute(
        "style",
        setConvertStyle({
          height: "0px",
          width: "0px",
          overflow: "hidden",
          padding: "unset",
        }),
      );
    } else {
      el.setAttribute(
        "style",
        setConvertStyle({
          height: heightC,
          width: widthC,
          opacity: argList?.indexOf("opacity") !== -1 ? 0 : 1,
          transition: transitionList.join(","),
          overflow: "hidden",
          padding: "unset",
        }),
      );
    }
  }
};

export const vTransition = {
  mounted(el: HTMLElement, binding) {
    const computedStyle = window.getComputedStyle(el);
    const state = {
      height: el.offsetHeight,
      width: el.offsetWidth,
      padding: [
        computedStyle.paddingTop,
        computedStyle.paddingRight,
        computedStyle.paddingBottom,
        computedStyle.paddingLeft,
      ],
      isFirstLoad: true,
    };
    elementStates.set(el, state);
    onSetStatus(el, binding.value, binding.arg);
  },
  updated(el: HTMLElement, binding) {
    onSetStatus(el, binding.value, binding.arg);
  },
};

function setConvertStyle(obj: { [key: string]: unknown }) {
  let style: string = "";
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) style += `${i}:${obj[i]};`;
  }
  return style;
}
