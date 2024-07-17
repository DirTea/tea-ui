import {
  installLabelLayout
} from "./chunk-YFIF3WP3.js";
import {
  createDimensions,
  createSeriesData_default
} from "./chunk-R4AQHW6Q.js";
import "./chunk-LAUGXQ7V.js";
import {
  AxisModelCommonMixin,
  Axis_default,
  Chart_default,
  Component_default as Component_default2,
  PRIORITY,
  SeriesData_default,
  connect,
  createScaleByModel,
  createSymbol,
  dataTool,
  dependencies,
  disConnect,
  disconnect,
  dispose,
  enableDataStack,
  getCoordinateSystemDimensions,
  getInstanceByDom,
  getInstanceById,
  getMap,
  getStackedDimension,
  init,
  isDimensionStacked,
  niceScaleExtent,
  parseGeoJSON,
  registerAction,
  registerCoordinateSystem,
  registerLayout,
  registerLoading,
  registerMap,
  registerPostInit,
  registerPostUpdate,
  registerPreprocessor,
  registerProcessor,
  registerTheme,
  registerTransform,
  registerUpdateLifecycle,
  registerVisual,
  setCanvasCreator,
  throttle,
  use,
  version
} from "./chunk-MXBY2BQY.js";
import {
  Arc_default,
  BezierCurve_default,
  Circle_default,
  Component_default,
  Ellipse_default,
  IncrementalDisplayable_default,
  Line_default,
  LinearGradient_default,
  MAX_SAFE_INTEGER,
  Model_default,
  Polygon_default,
  Polyline_default,
  RadialGradient_default,
  Ring_default,
  Sector_default,
  Series_default,
  addCommas,
  asc,
  capitalFirst,
  clipPointsByRect,
  clipRectByRect,
  createIcon,
  createTextStyle,
  enableHoverEmphasis,
  extendPath,
  extendShape,
  format,
  formatTime,
  formatTpl,
  getECData,
  getLayoutRect,
  getPercentWithPrecision,
  getPixelPrecision,
  getPrecision,
  getPrecisionSafe,
  getShapeClass,
  getTextRect,
  getTooltipMarker,
  getTransform,
  initProps,
  isNumeric,
  isRadianAroundZero,
  linearMap,
  makeImage,
  makePath,
  mergePath,
  nice,
  normalizeCssArray,
  numericToNumber,
  parseDate,
  quantile,
  quantity,
  quantityExponent,
  reformIntervals,
  registerLocale,
  registerShape,
  remRadian,
  resizePath,
  round,
  toCamelCase,
  updateProps
} from "./chunk-M3HCBZP4.js";
import {
  brushSingle,
  zrender_exports
} from "./chunk-XLIOIY5X.js";
import {
  BoundingRect_default,
  CompoundPath_default,
  Group_default,
  Image_default,
  Rect_default,
  Text_default,
  bind,
  clone,
  color_exports,
  curry,
  defaults,
  each,
  encodeHTML,
  env_default,
  extend,
  filter,
  indexOf,
  inherits,
  isArray,
  isFunction,
  isObject,
  isString,
  map,
  matrix_exports,
  merge,
  mixin,
  reduce,
  setPlatformAPI,
  truncateText,
  util_exports,
  vector_exports
} from "./chunk-GHHEI547.js";
import {
  __export
} from "./chunk-ZS7NZCD4.js";

// node_modules/echarts/lib/export/api/helper.js
var helper_exports = {};
__export(helper_exports, {
  createDimensions: () => createDimensions,
  createList: () => createList,
  createScale: () => createScale,
  createSymbol: () => createSymbol,
  createTextStyle: () => createTextStyle2,
  dataStack: () => dataStack,
  enableHoverEmphasis: () => enableHoverEmphasis,
  getECData: () => getECData,
  getLayoutRect: () => getLayoutRect,
  mixinAxisModelCommonMethods: () => mixinAxisModelCommonMethods
});
function createList(seriesModel) {
  return createSeriesData_default(null, seriesModel);
}
var dataStack = {
  isDimensionStacked,
  enableDataStack,
  getStackedDimension
};
function createScale(dataExtent, option) {
  var axisModel = option;
  if (!(option instanceof Model_default)) {
    axisModel = new Model_default(option);
  }
  var scale = createScaleByModel(axisModel);
  scale.setExtent(dataExtent[0], dataExtent[1]);
  niceScaleExtent(scale, axisModel);
  return scale;
}
function mixinAxisModelCommonMethods(Model) {
  mixin(Model, AxisModelCommonMixin);
}
function createTextStyle2(textStyleModel, opts) {
  opts = opts || {};
  return createTextStyle(textStyleModel, null, null, opts.state !== "normal");
}

// node_modules/echarts/lib/export/api/number.js
var number_exports = {};
__export(number_exports, {
  MAX_SAFE_INTEGER: () => MAX_SAFE_INTEGER,
  asc: () => asc,
  getPercentWithPrecision: () => getPercentWithPrecision,
  getPixelPrecision: () => getPixelPrecision,
  getPrecision: () => getPrecision,
  getPrecisionSafe: () => getPrecisionSafe,
  isNumeric: () => isNumeric,
  isRadianAroundZero: () => isRadianAroundZero,
  linearMap: () => linearMap,
  nice: () => nice,
  numericToNumber: () => numericToNumber,
  parseDate: () => parseDate,
  quantile: () => quantile,
  quantity: () => quantity,
  quantityExponent: () => quantityExponent,
  reformIntervals: () => reformIntervals,
  remRadian: () => remRadian,
  round: () => round
});

// node_modules/echarts/lib/export/api/time.js
var time_exports = {};
__export(time_exports, {
  format: () => format,
  parse: () => parseDate
});

// node_modules/echarts/lib/export/api/graphic.js
var graphic_exports = {};
__export(graphic_exports, {
  Arc: () => Arc_default,
  BezierCurve: () => BezierCurve_default,
  BoundingRect: () => BoundingRect_default,
  Circle: () => Circle_default,
  CompoundPath: () => CompoundPath_default,
  Ellipse: () => Ellipse_default,
  Group: () => Group_default,
  Image: () => Image_default,
  IncrementalDisplayable: () => IncrementalDisplayable_default,
  Line: () => Line_default,
  LinearGradient: () => LinearGradient_default,
  Polygon: () => Polygon_default,
  Polyline: () => Polyline_default,
  RadialGradient: () => RadialGradient_default,
  Rect: () => Rect_default,
  Ring: () => Ring_default,
  Sector: () => Sector_default,
  Text: () => Text_default,
  clipPointsByRect: () => clipPointsByRect,
  clipRectByRect: () => clipRectByRect,
  createIcon: () => createIcon,
  extendPath: () => extendPath,
  extendShape: () => extendShape,
  getShapeClass: () => getShapeClass,
  getTransform: () => getTransform,
  initProps: () => initProps,
  makeImage: () => makeImage,
  makePath: () => makePath,
  mergePath: () => mergePath,
  registerShape: () => registerShape,
  resizePath: () => resizePath,
  updateProps: () => updateProps
});

// node_modules/echarts/lib/export/api/format.js
var format_exports = {};
__export(format_exports, {
  addCommas: () => addCommas,
  capitalFirst: () => capitalFirst,
  encodeHTML: () => encodeHTML,
  formatTime: () => formatTime,
  formatTpl: () => formatTpl,
  getTextRect: () => getTextRect,
  getTooltipMarker: () => getTooltipMarker,
  normalizeCssArray: () => normalizeCssArray,
  toCamelCase: () => toCamelCase,
  truncateText: () => truncateText
});

// node_modules/echarts/lib/export/api/util.js
var util_exports2 = {};
__export(util_exports2, {
  bind: () => bind,
  clone: () => clone,
  curry: () => curry,
  defaults: () => defaults,
  each: () => each,
  extend: () => extend,
  filter: () => filter,
  indexOf: () => indexOf,
  inherits: () => inherits,
  isArray: () => isArray,
  isFunction: () => isFunction,
  isObject: () => isObject,
  isString: () => isString,
  map: () => map,
  merge: () => merge,
  reduce: () => reduce
});

// node_modules/echarts/lib/export/api.js
function extendComponentModel(proto) {
  var Model = Component_default.extend(proto);
  Component_default.registerClass(Model);
  return Model;
}
function extendComponentView(proto) {
  var View = Component_default2.extend(proto);
  Component_default2.registerClass(View);
  return View;
}
function extendSeriesModel(proto) {
  var Model = Series_default.extend(proto);
  Series_default.registerClass(Model);
  return Model;
}
function extendChartView(proto) {
  var View = Chart_default.extend(proto);
  Chart_default.registerClass(View);
  return View;
}

// node_modules/echarts/lib/export/core.js
use(installLabelLayout);
export {
  Axis_default as Axis,
  Chart_default as ChartView,
  Component_default as ComponentModel,
  Component_default2 as ComponentView,
  SeriesData_default as List,
  Model_default as Model,
  PRIORITY,
  Series_default as SeriesModel,
  color_exports as color,
  connect,
  dataTool,
  dependencies,
  disConnect,
  disconnect,
  dispose,
  env_default as env,
  extendChartView,
  extendComponentModel,
  extendComponentView,
  extendSeriesModel,
  format_exports as format,
  getCoordinateSystemDimensions,
  getInstanceByDom,
  getInstanceById,
  getMap,
  graphic_exports as graphic,
  helper_exports as helper,
  init,
  brushSingle as innerDrawElementOnCanvas,
  matrix_exports as matrix,
  number_exports as number,
  parseGeoJSON,
  parseGeoJSON as parseGeoJson,
  registerAction,
  registerCoordinateSystem,
  registerLayout,
  registerLoading,
  registerLocale,
  registerMap,
  registerPostInit,
  registerPostUpdate,
  registerPreprocessor,
  registerProcessor,
  registerTheme,
  registerTransform,
  registerUpdateLifecycle,
  registerVisual,
  setCanvasCreator,
  setPlatformAPI,
  throttle,
  time_exports as time,
  use,
  util_exports2 as util,
  vector_exports as vector,
  version,
  util_exports as zrUtil,
  zrender_exports as zrender
};
//# sourceMappingURL=echarts_core.js.map
