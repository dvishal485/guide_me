// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-05-24
// @description  try to take over the world!
// @author       You
// @match        https://team.dtutimes.com/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shepherdjs.dev
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
// node_modules/shepherd.js/dist/shepherd.mjs
var isElement$1 = function(value) {
  return value instanceof Element;
};
var isHTMLElement$1 = function(value) {
  return value instanceof HTMLElement;
};
var isFunction = function(value) {
  return typeof value === "function";
};
var isString = function(value) {
  return typeof value === "string";
};
var isUndefined = function(value) {
  return value === undefined;
};
var _AsyncGenerator = function(e) {
  var r, t;
  function resume(r2, t2) {
    try {
      var n = e[r2](t2), o = n.value, u = o instanceof _OverloadYield;
      Promise.resolve(u ? o.v : o).then(function(t3) {
        if (u) {
          var i = r2 === "return" ? "return" : "next";
          if (!o.k || t3.done)
            return resume(i, t3);
          t3 = e[i](t3).value;
        }
        settle(n.done ? "return" : "normal", t3);
      }, function(e2) {
        resume("throw", e2);
      });
    } catch (e2) {
      settle("throw", e2);
    }
  }
  function settle(e2, n) {
    switch (e2) {
      case "return":
        r.resolve({
          value: n,
          done: true
        });
        break;
      case "throw":
        r.reject(n);
        break;
      default:
        r.resolve({
          value: n,
          done: false
        });
    }
    (r = r.next) ? resume(r.key, r.arg) : t = null;
  }
  this._invoke = function(e2, n) {
    return new Promise(function(o, u) {
      var i = {
        key: e2,
        arg: n,
        resolve: o,
        reject: u,
        next: null
      };
      t ? t = t.next = i : (r = t = i, resume(e2, n));
    });
  }, typeof e.return != "function" && (this.return = undefined);
};
var _OverloadYield = function(t, e) {
  this.v = t, this.k = e;
};
var _awaitAsyncGenerator = function(e) {
  return new _OverloadYield(e, 0);
};
var _wrapAsyncGenerator = function(fn) {
  return function() {
    return new _AsyncGenerator(fn.apply(this, arguments));
  };
};
var _extends = function() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1;i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
};
var _objectWithoutPropertiesLoose = function(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
  }
  return target;
};
var defaultMetaDataUpdater = function(previousMeta, metaMeta) {
  return metaMeta;
};
var getObjectType = function(object) {
  if (typeof object !== "object" || object === null) {
    return 0;
  }
  if (Array.isArray(object)) {
    return 2;
  }
  if (isRecord(object)) {
    return 1;
  }
  if (object instanceof Set) {
    return 3;
  }
  if (object instanceof Map) {
    return 4;
  }
  return 5;
};
var getKeys = function(objects) {
  const keys = new Set;
  for (const object of objects) {
    for (const key of [...Object.keys(object), ...Object.getOwnPropertySymbols(object)]) {
      keys.add(key);
    }
  }
  return keys;
};
var objectHasProperty = function(object, property) {
  return typeof object === "object" && Object.prototype.propertyIsEnumerable.call(object, property);
};
var getIterableOfIterables = function(iterables) {
  return {
    *[Symbol.iterator]() {
      for (const iterable of iterables) {
        for (const value of iterable) {
          yield value;
        }
      }
    }
  };
};
var isRecord = function(value) {
  if (!validRecordToStringValues.has(Object.prototype.toString.call(value))) {
    return false;
  }
  const {
    constructor
  } = value;
  if (constructor === undefined) {
    return true;
  }
  const prototype = constructor.prototype;
  if (prototype === null || typeof prototype !== "object" || !validRecordToStringValues.has(Object.prototype.toString.call(prototype))) {
    return false;
  }
  if (!prototype.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
};
var mergeRecords$2 = function(values, utils, meta) {
  const result = {};
  for (const key of getKeys(values)) {
    const propValues = [];
    for (const value of values) {
      if (objectHasProperty(value, key)) {
        propValues.push(value[key]);
      }
    }
    if (propValues.length === 0) {
      continue;
    }
    const updatedMeta = utils.metaDataUpdater(meta, {
      key,
      parents: values
    });
    const propertyResult = mergeUnknowns(propValues, utils, updatedMeta);
    if (propertyResult === actions.skip) {
      continue;
    }
    if (key === "__proto__") {
      Object.defineProperty(result, key, {
        value: propertyResult,
        configurable: true,
        enumerable: true,
        writable: true
      });
    } else {
      result[key] = propertyResult;
    }
  }
  return result;
};
var mergeArrays$2 = function(values) {
  return values.flat();
};
var mergeSets$2 = function(values) {
  return new Set(getIterableOfIterables(values));
};
var mergeMaps$2 = function(values) {
  return new Map(getIterableOfIterables(values));
};
var mergeOthers$2 = function(values) {
  return values.at(-1);
};
var deepmerge = function(...objects) {
  return deepmergeCustom({})(...objects);
};
var deepmergeCustom = function(options, rootMetaData) {
  const utils = getUtils(options, customizedDeepmerge);
  function customizedDeepmerge(...objects) {
    return mergeUnknowns(objects, utils, rootMetaData);
  }
  return customizedDeepmerge;
};
var getUtils = function(options, customizedDeepmerge) {
  var _options$metaDataUpda, _options$enableImplic;
  return {
    defaultMergeFunctions,
    mergeFunctions: _extends({}, defaultMergeFunctions, Object.fromEntries(Object.entries(options).filter(([key, option]) => Object.hasOwn(defaultMergeFunctions, key)).map(([key, option]) => option === false ? [key, mergeOthers$2] : [key, option]))),
    metaDataUpdater: (_options$metaDataUpda = options.metaDataUpdater) != null ? _options$metaDataUpda : defaultMetaDataUpdater,
    deepmerge: customizedDeepmerge,
    useImplicitDefaultMerging: (_options$enableImplic = options.enableImplicitDefaultMerging) != null ? _options$enableImplic : false,
    actions
  };
};
var mergeUnknowns = function(values, utils, meta) {
  if (values.length === 0) {
    return;
  }
  if (values.length === 1) {
    return mergeOthers$1(values, utils, meta);
  }
  const type = getObjectType(values[0]);
  if (type !== 0 && type !== 5) {
    for (let m_index = 1;m_index < values.length; m_index++) {
      if (getObjectType(values[m_index]) === type) {
        continue;
      }
      return mergeOthers$1(values, utils, meta);
    }
  }
  switch (type) {
    case 1: {
      return mergeRecords$1(values, utils, meta);
    }
    case 2: {
      return mergeArrays$1(values, utils, meta);
    }
    case 3: {
      return mergeSets$1(values, utils, meta);
    }
    case 4: {
      return mergeMaps$1(values, utils, meta);
    }
    default: {
      return mergeOthers$1(values, utils, meta);
    }
  }
};
var mergeRecords$1 = function(values, utils, meta) {
  const result = utils.mergeFunctions.mergeRecords(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === undefined && utils.mergeFunctions.mergeRecords !== utils.defaultMergeFunctions.mergeRecords) {
    return utils.defaultMergeFunctions.mergeRecords(values, utils, meta);
  }
  return result;
};
var mergeArrays$1 = function(values, utils, meta) {
  const result = utils.mergeFunctions.mergeArrays(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === undefined && utils.mergeFunctions.mergeArrays !== utils.defaultMergeFunctions.mergeArrays) {
    return utils.defaultMergeFunctions.mergeArrays(values);
  }
  return result;
};
var mergeSets$1 = function(values, utils, meta) {
  const result = utils.mergeFunctions.mergeSets(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === undefined && utils.mergeFunctions.mergeSets !== utils.defaultMergeFunctions.mergeSets) {
    return utils.defaultMergeFunctions.mergeSets(values);
  }
  return result;
};
var mergeMaps$1 = function(values, utils, meta) {
  const result = utils.mergeFunctions.mergeMaps(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === undefined && utils.mergeFunctions.mergeMaps !== utils.defaultMergeFunctions.mergeMaps) {
    return utils.defaultMergeFunctions.mergeMaps(values);
  }
  return result;
};
var mergeOthers$1 = function(values, utils, meta) {
  const result = utils.mergeFunctions.mergeOthers(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === undefined && utils.mergeFunctions.mergeOthers !== utils.defaultMergeFunctions.mergeOthers) {
    return utils.defaultMergeFunctions.mergeOthers(values);
  }
  return result;
};
var autoBind = function(self) {
  const keys = Object.getOwnPropertyNames(self.constructor.prototype);
  for (let i = 0;i < keys.length; i++) {
    const key = keys[i];
    const val = self[key];
    if (key !== "constructor" && typeof val === "function") {
      self[key] = val.bind(self);
    }
  }
  return self;
};
var _setupAdvanceOnHandler = function(step, selector) {
  return (event) => {
    if (step.isOpen()) {
      const targetIsEl = step.el && event.currentTarget === step.el;
      const targetIsSelector = !isUndefined(selector) && event.currentTarget.matches(selector);
      if (targetIsSelector || targetIsEl) {
        step.tour.next();
      }
    }
  };
};
var bindAdvance = function(step) {
  const { event, selector } = step.options.advanceOn || {};
  if (event) {
    const handler = _setupAdvanceOnHandler(step, selector);
    let el = null;
    if (!isUndefined(selector)) {
      el = document.querySelector(selector);
      if (!el) {
        return console.error(`No element was found for the selector supplied to advanceOn: ${selector}`);
      }
    }
    if (el) {
      el.addEventListener(event, handler);
      step.on("destroy", () => {
        return el.removeEventListener(event, handler);
      });
    } else {
      document.body.addEventListener(event, handler, true);
      step.on("destroy", () => {
        return document.body.removeEventListener(event, handler, true);
      });
    }
  } else {
    return console.error("advanceOn was defined, but no event name was passed.");
  }
};
var normalizePrefix = function(prefix) {
  if (!isString(prefix) || prefix === "") {
    return "";
  }
  return prefix.charAt(prefix.length - 1) !== "-" ? `${prefix}-` : prefix;
};
var parseAttachTo = function(step) {
  const options = step.options.attachTo || {};
  const returnOpts = Object.assign({}, options);
  if (isFunction(returnOpts.element)) {
    returnOpts.element = returnOpts.element.call(step);
  }
  if (isString(returnOpts.element)) {
    try {
      returnOpts.element = document.querySelector(returnOpts.element);
    } catch (e) {
    }
    if (!returnOpts.element) {
      console.error(`The element for this Shepherd step was not found ${options.element}`);
    }
  }
  return returnOpts;
};
var shouldCenterStep = function(resolvedAttachToOptions) {
  if (resolvedAttachToOptions === undefined || resolvedAttachToOptions === null) {
    return true;
  }
  return !resolvedAttachToOptions.element || !resolvedAttachToOptions.on;
};
var uuid = function() {
  let d = Date.now();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : r & 3 | 8).toString(16);
  });
};
var clamp = function(start, value, end) {
  return max(start, min(value, end));
};
var evaluate = function(value, param) {
  return typeof value === "function" ? value(param) : value;
};
var getSide = function(placement) {
  return placement.split("-")[0];
};
var getAlignment = function(placement) {
  return placement.split("-")[1];
};
var getOppositeAxis = function(axis) {
  return axis === "x" ? "y" : "x";
};
var getAxisLength = function(axis) {
  return axis === "y" ? "height" : "width";
};
var getSideAxis = function(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
};
var getAlignmentAxis = function(placement) {
  return getOppositeAxis(getSideAxis(placement));
};
var getAlignmentSides = function(placement, rects, rtl) {
  if (rtl === undefined) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
};
var getExpandedPlacements = function(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
};
var getOppositeAlignmentPlacement = function(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
};
var getSideList = function(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl)
        return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
};
var getOppositeAxisPlacements = function(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
};
var getOppositePlacement = function(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
};
var expandPaddingObject = function(padding) {
  return _extends({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }, padding);
};
var getPaddingObject = function(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
};
var rectToClientRect = function(rect) {
  return _extends({}, rect, {
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
};
var computeCoordsFromPlacement = function(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === undefined) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? undefined : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? undefined : platform.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? _extends({}, rects.floating, {
    x,
    y
  }) : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? undefined : platform.getOffsetParent(elements.floating));
  const offsetScale = await (platform.isElement == null ? undefined : platform.isElement(offsetParent)) ? await (platform.getScale == null ? undefined : platform.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
var getNodeName = function(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
};
var getWindow = function(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? undefined : _node$ownerDocument.defaultView) || window;
};
var getDocumentElement = function(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? undefined : _ref.documentElement;
};
var isNode = function(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
};
var isElement = function(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
};
var isHTMLElement = function(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
};
var isShadowRoot = function(value) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
};
var isOverflowElement = function(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
};
var isTableElement = function(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
};
var isContainingBlock = function(element) {
  const webkit = isWebKit();
  const css = getComputedStyle(element);
  return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
};
var getContainingBlock = function(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
};
var isWebKit = function() {
  if (typeof CSS === "undefined" || !CSS.supports)
    return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
};
var isLastTraversableNode = function(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
};
var getComputedStyle = function(element) {
  return getWindow(element).getComputedStyle(element);
};
var getNodeScroll = function(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
};
var getParentNode = function(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
};
var getNearestOverflowAncestor = function(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
};
var getOverflowAncestors = function(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === undefined) {
    list = [];
  }
  if (traverseIframes === undefined) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? undefined : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
};
var getCssDimensions = function(element) {
  const css = getComputedStyle(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
};
var unwrapElement = function(element) {
  return !isElement(element) ? element.contextElement : element;
};
var getScale = function(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
};
var getVisualOffsets = function(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
};
var shouldAddVisualOffsets = function(element, isFixed, floatingOffsetParent) {
  if (isFixed === undefined) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
};
var getBoundingClientRect = function(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === undefined) {
    includeScale = false;
  }
  if (isFixedStrategy === undefined) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = currentWin.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = currentWin.frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
};
var isTopLayer = function(floating) {
  return topLayerSelectors.some((selector) => {
    try {
      return floating.matches(selector);
    } catch (e) {
      return false;
    }
  });
};
var convertOffsetParentRelativeRectToViewportRelativeRect = function(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
};
var getClientRects = function(element) {
  return Array.from(element.getClientRects());
};
var getWindowScrollBarX = function(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
};
var getDocumentRect = function(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
};
var getViewportRect = function(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
};
var getInnerBoundingClientRect = function(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
};
var getClientRectFromClippingAncestor = function(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = _extends({}, clippingAncestor, {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    });
  }
  return rectToClientRect(rect);
};
var hasFixedPositionAncestor = function(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
};
var getClippingElementAncestors = function(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
};
var getClippingRect = function(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
};
var getDimensions = function(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
};
var getRectRelativeToOffsetParent = function(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const x = rect.left + scroll.scrollLeft - offsets.x;
  const y = rect.top + scroll.scrollTop - offsets.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
};
var getTrueOffsetParent = function(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
};
var getOffsetParent = function(element, polyfill) {
  const window2 = getWindow(element);
  if (!isHTMLElement(element) || isTopLayer(element)) {
    return window2;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static" && !isContainingBlock(offsetParent))) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
};
var isRTL = function(element) {
  return getComputedStyle(element).direction === "rtl";
};
var observeMove = function(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === undefined) {
      skip = false;
    }
    if (threshold === undefined) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 0.0000001);
          }, 100);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, _extends({}, options, {
        root: root.ownerDocument
      }));
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
};
var autoUpdate = function(reference, floating, update, options) {
  if (options === undefined) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
};
var setupTooltip = function(step) {
  if (step.cleanup) {
    step.cleanup();
  }
  const attachToOptions = step._getResolvedAttachToOptions();
  let target = attachToOptions.element;
  const floatingUIOptions = getFloatingUIOptions(attachToOptions, step);
  const shouldCenter = shouldCenterStep(attachToOptions);
  if (shouldCenter) {
    target = document.body;
    const content = step.shepherdElementComponent.getElement();
    content.classList.add("shepherd-centered");
  }
  step.cleanup = autoUpdate(target, step.el, () => {
    if (!step.el) {
      step.cleanup?.();
      return;
    }
    setPosition(target, step, floatingUIOptions, shouldCenter);
  });
  step.target = attachToOptions.element;
  return floatingUIOptions;
};
var mergeTooltipConfig = function(tourOptions, options) {
  return {
    floatingUIOptions: deepmerge(tourOptions.floatingUIOptions || {}, options.floatingUIOptions || {})
  };
};
var destroyTooltip = function(step) {
  if (step.cleanup) {
    step.cleanup();
  }
  step.cleanup = null;
};
var setPosition = function(target, step, floatingUIOptions, shouldCenter) {
  return computePosition(target, step.el, floatingUIOptions).then(floatingUIposition(step, shouldCenter)).then((step2) => new Promise((resolve) => {
    setTimeout(() => resolve(step2), 300);
  })).then((step2) => {
    if (step2?.el) {
      step2.el.focus({ preventScroll: true });
    }
  });
};
var floatingUIposition = function(step, shouldCenter) {
  return ({ x, y, placement, middlewareData }) => {
    if (!step.el) {
      return step;
    }
    if (shouldCenter) {
      Object.assign(step.el.style, {
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
      });
    } else {
      Object.assign(step.el.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`
      });
    }
    step.el.dataset["popperPlacement"] = placement;
    placeArrow(step.el, middlewareData);
    return step;
  };
};
var placeArrow = function(el, middlewareData) {
  const arrowEl = el.querySelector(".shepherd-arrow");
  if (isHTMLElement$1(arrowEl) && middlewareData.arrow) {
    const { x: arrowX, y: arrowY } = middlewareData.arrow;
    Object.assign(arrowEl.style, {
      left: arrowX != null ? `${arrowX}px` : "",
      top: arrowY != null ? `${arrowY}px` : ""
    });
  }
};
var getFloatingUIOptions = function(attachToOptions, step) {
  const options = {
    strategy: "absolute"
  };
  options.middleware = [];
  const arrowEl = addArrow(step);
  const shouldCenter = shouldCenterStep(attachToOptions);
  if (!shouldCenter) {
    options.middleware.push(flip2(), shift2({
      limiter: limitShift2(),
      crossAxis: true
    }));
    if (arrowEl) {
      options.middleware.push(arrow({ element: arrowEl }));
    }
    options.placement = attachToOptions.on;
  }
  return deepmerge(step.options.floatingUIOptions || {}, options);
};
var addArrow = function(step) {
  if (step.options.arrow && step.el) {
    return step.el.querySelector(".shepherd-arrow");
  }
  return false;
};
var noop = function() {
};
var assign = function(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
};
var run = function(fn) {
  return fn();
};
var blank_object = function() {
  return Object.create(null);
};
var run_all = function(fns) {
  fns.forEach(run);
};
var is_function = function(thing) {
  return typeof thing === "function";
};
var safe_not_equal = function(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
};
var is_empty = function(obj) {
  return Object.keys(obj).length === 0;
};
var append = function(target, node) {
  target.appendChild(node);
};
var insert = function(target, node, anchor) {
  target.insertBefore(node, anchor || null);
};
var detach = function(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
};
var destroy_each = function(iterations, detaching) {
  for (let i = 0;i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
};
var element = function(name) {
  return document.createElement(name);
};
var svg_element = function(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
};
var text = function(data) {
  return document.createTextNode(data);
};
var space = function() {
  return text(" ");
};
var empty = function() {
  return text("");
};
var listen = function(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
};
var attr = function(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
};
var set_attributes = function(node, attributes) {
  const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
  for (const key in attributes) {
    if (attributes[key] == null) {
      node.removeAttribute(key);
    } else if (key === "style") {
      node.style.cssText = attributes[key];
    } else if (key === "__value") {
      node.value = node[key] = attributes[key];
    } else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
      node[key] = attributes[key];
    } else {
      attr(node, key, attributes[key]);
    }
  }
};
var children = function(element2) {
  return Array.from(element2.childNodes);
};
var toggle_class = function(element2, name, toggle) {
  element2.classList.toggle(name, !!toggle);
};
var set_current_component = function(component) {
  current_component = component;
};
var get_current_component = function() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
};
var onMount = function(fn) {
  get_current_component().$$.on_mount.push(fn);
};
var afterUpdate = function(fn) {
  get_current_component().$$.after_update.push(fn);
};
var schedule_update = function() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
};
var add_render_callback = function(fn) {
  render_callbacks.push(fn);
};
var flush = function() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0;i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
};
var update = function($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
};
var flush_render_callbacks = function(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
};
var group_outros = function() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
};
var check_outros = function() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
};
var transition_in = function(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
};
var transition_out = function(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
};
var ensure_array_like = function(array_like_or_iterator) {
  return (array_like_or_iterator == null ? undefined : array_like_or_iterator.length) !== undefined ? array_like_or_iterator : Array.from(array_like_or_iterator);
};
var get_spread_update = function(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = {
    $$scope: 1
  };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n))
          to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2))
      update2[key] = undefined;
  }
  return update2;
};
var create_component = function(block) {
  block && block.c();
};
var mount_component = function(component, target, anchor) {
  const {
    fragment,
    after_update
  } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
};
var destroy_component = function(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
};
var make_dirty = function(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
};
var init = function(component, options, instance, create_fragment, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance ? instance(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
};
var create_fragment$8 = function(ctx) {
  let button;
  let button_aria_label_value;
  let button_class_value;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      attr(button, "aria-label", button_aria_label_value = ctx[3] ? ctx[3] : null);
      attr(button, "class", button_class_value = `${ctx[1] || ""} shepherd-button ${ctx[4] ? "shepherd-button-secondary" : ""}`);
      button.disabled = ctx[2];
      attr(button, "tabindex", "0");
      attr(button, "type", "button");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      button.innerHTML = ctx[5];
      if (!mounted) {
        dispose = listen(button, "click", function() {
          if (is_function(ctx[0]))
            ctx[0].apply(this, arguments);
        });
        mounted = true;
      }
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      if (dirty & 32)
        button.innerHTML = ctx[5];
      if (dirty & 8 && button_aria_label_value !== (button_aria_label_value = ctx[3] ? ctx[3] : null)) {
        attr(button, "aria-label", button_aria_label_value);
      }
      if (dirty & 18 && button_class_value !== (button_class_value = `${ctx[1] || ""} shepherd-button ${ctx[4] ? "shepherd-button-secondary" : ""}`)) {
        attr(button, "class", button_class_value);
      }
      if (dirty & 4) {
        button.disabled = ctx[2];
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      mounted = false;
      dispose();
    }
  };
};
var instance$8 = function($$self, $$props, $$invalidate) {
  let {
    config,
    step
  } = $$props;
  let action, classes, disabled, label, secondary, text2;
  function getConfigOption(option) {
    if (isFunction(option)) {
      return option = option.call(step);
    }
    return option;
  }
  $$self.$$set = ($$props2) => {
    if ("config" in $$props2)
      $$invalidate(6, config = $$props2.config);
    if ("step" in $$props2)
      $$invalidate(7, step = $$props2.step);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 192) {
      {
        $$invalidate(0, action = config.action ? config.action.bind(step.tour) : null);
        $$invalidate(1, classes = config.classes);
        $$invalidate(2, disabled = config.disabled ? getConfigOption(config.disabled) : false);
        $$invalidate(3, label = config.label ? getConfigOption(config.label) : null);
        $$invalidate(4, secondary = config.secondary);
        $$invalidate(5, text2 = config.text ? getConfigOption(config.text) : null);
      }
    }
  };
  return [action, classes, disabled, label, secondary, text2, config, step];
};
var get_each_context = function(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[2] = list[i];
  return child_ctx;
};
var create_if_block$3 = function(ctx) {
  let each_1_anchor;
  let current;
  let each_value = ensure_array_like(ctx[1]);
  let each_blocks = [];
  for (let i = 0;i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      for (let i = 0;i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0;i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, each_1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & 3) {
        each_value = ensure_array_like(ctx2[1]);
        let i;
        for (i = 0;i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        group_outros();
        for (i = each_value.length;i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0;i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0;i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(each_1_anchor);
      }
      destroy_each(each_blocks, detaching);
    }
  };
};
var create_each_block = function(ctx) {
  let shepherdbutton;
  let current;
  shepherdbutton = new Shepherd_button({
    props: {
      config: ctx[2],
      step: ctx[0]
    }
  });
  return {
    c() {
      create_component(shepherdbutton.$$.fragment);
    },
    m(target, anchor) {
      mount_component(shepherdbutton, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const shepherdbutton_changes = {};
      if (dirty & 2)
        shepherdbutton_changes.config = ctx2[2];
      if (dirty & 1)
        shepherdbutton_changes.step = ctx2[0];
      shepherdbutton.$set(shepherdbutton_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(shepherdbutton.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(shepherdbutton.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(shepherdbutton, detaching);
    }
  };
};
var create_fragment$7 = function(ctx) {
  let footer;
  let current;
  let if_block = ctx[1] && create_if_block$3(ctx);
  return {
    c() {
      footer = element("footer");
      if (if_block)
        if_block.c();
      attr(footer, "class", "shepherd-footer");
    },
    m(target, anchor) {
      insert(target, footer, anchor);
      if (if_block)
        if_block.m(footer, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[1]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$3(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(footer, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(footer);
      }
      if (if_block)
        if_block.d();
    }
  };
};
var instance$7 = function($$self, $$props, $$invalidate) {
  let buttons;
  let {
    step
  } = $$props;
  $$self.$$set = ($$props2) => {
    if ("step" in $$props2)
      $$invalidate(0, step = $$props2.step);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1) {
      $$invalidate(1, buttons = step.options.buttons);
    }
  };
  return [step, buttons];
};
var create_fragment$6 = function(ctx) {
  let button;
  let span;
  let button_aria_label_value;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      span = element("span");
      span.textContent = "\xD7";
      attr(span, "aria-hidden", "true");
      attr(button, "aria-label", button_aria_label_value = ctx[0].label ? ctx[0].label : "Close Tour");
      attr(button, "class", "shepherd-cancel-icon");
      attr(button, "type", "button");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, span);
      if (!mounted) {
        dispose = listen(button, "click", ctx[1]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1 && button_aria_label_value !== (button_aria_label_value = ctx2[0].label ? ctx2[0].label : "Close Tour")) {
        attr(button, "aria-label", button_aria_label_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      mounted = false;
      dispose();
    }
  };
};
var instance$6 = function($$self, $$props, $$invalidate) {
  let {
    cancelIcon,
    step
  } = $$props;
  const handleCancelClick = (e) => {
    e.preventDefault();
    step.cancel();
  };
  $$self.$$set = ($$props2) => {
    if ("cancelIcon" in $$props2)
      $$invalidate(0, cancelIcon = $$props2.cancelIcon);
    if ("step" in $$props2)
      $$invalidate(2, step = $$props2.step);
  };
  return [cancelIcon, handleCancelClick, step];
};
var create_fragment$5 = function(ctx) {
  let h3;
  return {
    c() {
      h3 = element("h3");
      attr(h3, "id", ctx[1]);
      attr(h3, "class", "shepherd-title");
    },
    m(target, anchor) {
      insert(target, h3, anchor);
      ctx[3](h3);
    },
    p(ctx2, [dirty]) {
      if (dirty & 2) {
        attr(h3, "id", ctx2[1]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(h3);
      }
      ctx[3](null);
    }
  };
};
var instance$5 = function($$self, $$props, $$invalidate) {
  let {
    labelId,
    element: element2,
    title
  } = $$props;
  afterUpdate(() => {
    if (isFunction(title)) {
      $$invalidate(2, title = title());
    }
    $$invalidate(0, element2.innerHTML = title, element2);
  });
  function h3_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("labelId" in $$props2)
      $$invalidate(1, labelId = $$props2.labelId);
    if ("element" in $$props2)
      $$invalidate(0, element2 = $$props2.element);
    if ("title" in $$props2)
      $$invalidate(2, title = $$props2.title);
  };
  return [element2, labelId, title, h3_binding];
};
var create_if_block_1$1 = function(ctx) {
  let shepherdtitle;
  let current;
  shepherdtitle = new Shepherd_title({
    props: {
      labelId: ctx[0],
      title: ctx[2]
    }
  });
  return {
    c() {
      create_component(shepherdtitle.$$.fragment);
    },
    m(target, anchor) {
      mount_component(shepherdtitle, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const shepherdtitle_changes = {};
      if (dirty & 1)
        shepherdtitle_changes.labelId = ctx2[0];
      if (dirty & 4)
        shepherdtitle_changes.title = ctx2[2];
      shepherdtitle.$set(shepherdtitle_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(shepherdtitle.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(shepherdtitle.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(shepherdtitle, detaching);
    }
  };
};
var create_if_block$2 = function(ctx) {
  let shepherdcancelicon;
  let current;
  shepherdcancelicon = new Shepherd_cancel_icon({
    props: {
      cancelIcon: ctx[3],
      step: ctx[1]
    }
  });
  return {
    c() {
      create_component(shepherdcancelicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(shepherdcancelicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const shepherdcancelicon_changes = {};
      if (dirty & 8)
        shepherdcancelicon_changes.cancelIcon = ctx2[3];
      if (dirty & 2)
        shepherdcancelicon_changes.step = ctx2[1];
      shepherdcancelicon.$set(shepherdcancelicon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(shepherdcancelicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(shepherdcancelicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(shepherdcancelicon, detaching);
    }
  };
};
var create_fragment$4 = function(ctx) {
  let header;
  let t;
  let current;
  let if_block0 = ctx[2] && create_if_block_1$1(ctx);
  let if_block1 = ctx[3] && ctx[3].enabled && create_if_block$2(ctx);
  return {
    c() {
      header = element("header");
      if (if_block0)
        if_block0.c();
      t = space();
      if (if_block1)
        if_block1.c();
      attr(header, "class", "shepherd-header");
    },
    m(target, anchor) {
      insert(target, header, anchor);
      if (if_block0)
        if_block0.m(header, null);
      append(header, t);
      if (if_block1)
        if_block1.m(header, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[2]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & 4) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$1(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(header, t);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (ctx2[3] && ctx2[3].enabled) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & 8) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$2(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(header, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(header);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
    }
  };
};
var instance$4 = function($$self, $$props, $$invalidate) {
  let {
    labelId,
    step
  } = $$props;
  let title, cancelIcon;
  $$self.$$set = ($$props2) => {
    if ("labelId" in $$props2)
      $$invalidate(0, labelId = $$props2.labelId);
    if ("step" in $$props2)
      $$invalidate(1, step = $$props2.step);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 2) {
      {
        $$invalidate(2, title = step.options.title);
        $$invalidate(3, cancelIcon = step.options.cancelIcon);
      }
    }
  };
  return [labelId, step, title, cancelIcon];
};
var create_fragment$3 = function(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "shepherd-text");
      attr(div, "id", ctx[1]);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      ctx[3](div);
    },
    p(ctx2, [dirty]) {
      if (dirty & 2) {
        attr(div, "id", ctx2[1]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      ctx[3](null);
    }
  };
};
var instance$3 = function($$self, $$props, $$invalidate) {
  let {
    descriptionId,
    element: element2,
    step
  } = $$props;
  afterUpdate(() => {
    let {
      text: text2
    } = step.options;
    if (isFunction(text2)) {
      text2 = text2.call(step);
    }
    if (isHTMLElement$1(text2)) {
      element2.appendChild(text2);
    } else {
      $$invalidate(0, element2.innerHTML = text2, element2);
    }
  });
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("descriptionId" in $$props2)
      $$invalidate(1, descriptionId = $$props2.descriptionId);
    if ("element" in $$props2)
      $$invalidate(0, element2 = $$props2.element);
    if ("step" in $$props2)
      $$invalidate(2, step = $$props2.step);
  };
  return [element2, descriptionId, step, div_binding];
};
var create_if_block_2 = function(ctx) {
  let shepherdheader;
  let current;
  shepherdheader = new Shepherd_header({
    props: {
      labelId: ctx[1],
      step: ctx[2]
    }
  });
  return {
    c() {
      create_component(shepherdheader.$$.fragment);
    },
    m(target, anchor) {
      mount_component(shepherdheader, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const shepherdheader_changes = {};
      if (dirty & 2)
        shepherdheader_changes.labelId = ctx2[1];
      if (dirty & 4)
        shepherdheader_changes.step = ctx2[2];
      shepherdheader.$set(shepherdheader_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(shepherdheader.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(shepherdheader.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(shepherdheader, detaching);
    }
  };
};
var create_if_block_1 = function(ctx) {
  let shepherdtext;
  let current;
  shepherdtext = new Shepherd_text({
    props: {
      descriptionId: ctx[0],
      step: ctx[2]
    }
  });
  return {
    c() {
      create_component(shepherdtext.$$.fragment);
    },
    m(target, anchor) {
      mount_component(shepherdtext, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const shepherdtext_changes = {};
      if (dirty & 1)
        shepherdtext_changes.descriptionId = ctx2[0];
      if (dirty & 4)
        shepherdtext_changes.step = ctx2[2];
      shepherdtext.$set(shepherdtext_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(shepherdtext.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(shepherdtext.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(shepherdtext, detaching);
    }
  };
};
var create_if_block$1 = function(ctx) {
  let shepherdfooter;
  let current;
  shepherdfooter = new Shepherd_footer({
    props: {
      step: ctx[2]
    }
  });
  return {
    c() {
      create_component(shepherdfooter.$$.fragment);
    },
    m(target, anchor) {
      mount_component(shepherdfooter, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const shepherdfooter_changes = {};
      if (dirty & 4)
        shepherdfooter_changes.step = ctx2[2];
      shepherdfooter.$set(shepherdfooter_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(shepherdfooter.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(shepherdfooter.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(shepherdfooter, detaching);
    }
  };
};
var create_fragment$2 = function(ctx) {
  let div;
  let show_if_2 = !isUndefined(ctx[2].options.title) || ctx[2].options.cancelIcon && ctx[2].options.cancelIcon.enabled;
  let t0;
  let show_if_1 = !isUndefined(ctx[2].options.text);
  let t1;
  let show_if = Array.isArray(ctx[2].options.buttons) && ctx[2].options.buttons.length;
  let current;
  let if_block0 = show_if_2 && create_if_block_2(ctx);
  let if_block1 = show_if_1 && create_if_block_1(ctx);
  let if_block2 = show_if && create_if_block$1(ctx);
  return {
    c() {
      div = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if (if_block1)
        if_block1.c();
      t1 = space();
      if (if_block2)
        if_block2.c();
      attr(div, "class", "shepherd-content");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (if_block0)
        if_block0.m(div, null);
      append(div, t0);
      if (if_block1)
        if_block1.m(div, null);
      append(div, t1);
      if (if_block2)
        if_block2.m(div, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & 4)
        show_if_2 = !isUndefined(ctx2[2].options.title) || ctx2[2].options.cancelIcon && ctx2[2].options.cancelIcon.enabled;
      if (show_if_2) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & 4) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_2(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (dirty & 4)
        show_if_1 = !isUndefined(ctx2[2].options.text);
      if (show_if_1) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & 4) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_1(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div, t1);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (dirty & 4)
        show_if = Array.isArray(ctx2[2].options.buttons) && ctx2[2].options.buttons.length;
      if (show_if) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
          if (dirty & 4) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block$1(ctx2);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(div, null);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(if_block2);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      transition_out(if_block2);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
    }
  };
};
var instance$2 = function($$self, $$props, $$invalidate) {
  let {
    descriptionId,
    labelId,
    step
  } = $$props;
  $$self.$$set = ($$props2) => {
    if ("descriptionId" in $$props2)
      $$invalidate(0, descriptionId = $$props2.descriptionId);
    if ("labelId" in $$props2)
      $$invalidate(1, labelId = $$props2.labelId);
    if ("step" in $$props2)
      $$invalidate(2, step = $$props2.step);
  };
  return [descriptionId, labelId, step];
};
var create_if_block = function(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "shepherd-arrow");
      attr(div, "data-popper-arrow", "");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
};
var create_fragment$1 = function(ctx) {
  let div;
  let t;
  let shepherdcontent;
  let div_aria_describedby_value;
  let div_aria_labelledby_value;
  let current;
  let mounted;
  let dispose;
  let if_block = ctx[4].options.arrow && ctx[4].options.attachTo && ctx[4].options.attachTo.element && ctx[4].options.attachTo.on && create_if_block();
  shepherdcontent = new Shepherd_content({
    props: {
      descriptionId: ctx[2],
      labelId: ctx[3],
      step: ctx[4]
    }
  });
  let div_levels = [{
    "aria-describedby": div_aria_describedby_value = !isUndefined(ctx[4].options.text) ? ctx[2] : null
  }, {
    "aria-labelledby": div_aria_labelledby_value = ctx[4].options.title ? ctx[3] : null
  }, ctx[1], {
    role: "dialog"
  }, {
    tabindex: "0"
  }];
  let div_data = {};
  for (let i = 0;i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (if_block)
        if_block.c();
      t = space();
      create_component(shepherdcontent.$$.fragment);
      set_attributes(div, div_data);
      toggle_class(div, "shepherd-has-cancel-icon", ctx[5]);
      toggle_class(div, "shepherd-has-title", ctx[6]);
      toggle_class(div, "shepherd-element", true);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (if_block)
        if_block.m(div, null);
      append(div, t);
      mount_component(shepherdcontent, div, null);
      ctx[13](div);
      current = true;
      if (!mounted) {
        dispose = listen(div, "keydown", ctx[7]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (ctx2[4].options.arrow && ctx2[4].options.attachTo && ctx2[4].options.attachTo.element && ctx2[4].options.attachTo.on) {
        if (if_block)
          ;
        else {
          if_block = create_if_block();
          if_block.c();
          if_block.m(div, t);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      const shepherdcontent_changes = {};
      if (dirty & 4)
        shepherdcontent_changes.descriptionId = ctx2[2];
      if (dirty & 8)
        shepherdcontent_changes.labelId = ctx2[3];
      if (dirty & 16)
        shepherdcontent_changes.step = ctx2[4];
      shepherdcontent.$set(shepherdcontent_changes);
      set_attributes(div, div_data = get_spread_update(div_levels, [(!current || dirty & 20 && div_aria_describedby_value !== (div_aria_describedby_value = !isUndefined(ctx2[4].options.text) ? ctx2[2] : null)) && {
        "aria-describedby": div_aria_describedby_value
      }, (!current || dirty & 24 && div_aria_labelledby_value !== (div_aria_labelledby_value = ctx2[4].options.title ? ctx2[3] : null)) && {
        "aria-labelledby": div_aria_labelledby_value
      }, dirty & 2 && ctx2[1], {
        role: "dialog"
      }, {
        tabindex: "0"
      }]));
      toggle_class(div, "shepherd-has-cancel-icon", ctx2[5]);
      toggle_class(div, "shepherd-has-title", ctx2[6]);
      toggle_class(div, "shepherd-element", true);
    },
    i(local) {
      if (current)
        return;
      transition_in(shepherdcontent.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(shepherdcontent.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (if_block)
        if_block.d();
      destroy_component(shepherdcontent);
      ctx[13](null);
      mounted = false;
      dispose();
    }
  };
};
var getClassesArray = function(classes) {
  return classes.split(" ").filter((className) => !!className.length);
};
var instance$1 = function($$self, $$props, $$invalidate) {
  let {
    classPrefix,
    element: element2,
    descriptionId,
    firstFocusableElement,
    focusableElements,
    labelId,
    lastFocusableElement,
    step,
    dataStepId
  } = $$props;
  let hasCancelIcon, hasTitle, classes;
  const getElement = () => element2;
  onMount(() => {
    $$invalidate(1, dataStepId = {
      [`data-${classPrefix}shepherd-step-id`]: step.id
    });
    $$invalidate(9, focusableElements = element2.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'));
    $$invalidate(8, firstFocusableElement = focusableElements[0]);
    $$invalidate(10, lastFocusableElement = focusableElements[focusableElements.length - 1]);
  });
  afterUpdate(() => {
    if (classes !== step.options.classes) {
      updateDynamicClasses();
    }
  });
  function updateDynamicClasses() {
    removeClasses(classes);
    classes = step.options.classes;
    addClasses(classes);
  }
  function removeClasses(classes2) {
    if (isString(classes2)) {
      const oldClasses = getClassesArray(classes2);
      if (oldClasses.length) {
        element2.classList.remove(...oldClasses);
      }
    }
  }
  function addClasses(classes2) {
    if (isString(classes2)) {
      const newClasses = getClassesArray(classes2);
      if (newClasses.length) {
        element2.classList.add(...newClasses);
      }
    }
  }
  const handleKeyDown = (e) => {
    const {
      tour
    } = step;
    switch (e.keyCode) {
      case KEY_TAB:
        if (focusableElements.length === 0) {
          e.preventDefault();
          break;
        }
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement || document.activeElement.classList.contains("shepherd-element")) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
        break;
      case KEY_ESC:
        if (tour.options.exitOnEsc) {
          e.preventDefault();
          e.stopPropagation();
          step.cancel();
        }
        break;
      case LEFT_ARROW:
        if (tour.options.keyboardNavigation) {
          e.preventDefault();
          e.stopPropagation();
          tour.back();
        }
        break;
      case RIGHT_ARROW:
        if (tour.options.keyboardNavigation) {
          e.preventDefault();
          e.stopPropagation();
          tour.next();
        }
        break;
    }
  };
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("classPrefix" in $$props2)
      $$invalidate(11, classPrefix = $$props2.classPrefix);
    if ("element" in $$props2)
      $$invalidate(0, element2 = $$props2.element);
    if ("descriptionId" in $$props2)
      $$invalidate(2, descriptionId = $$props2.descriptionId);
    if ("firstFocusableElement" in $$props2)
      $$invalidate(8, firstFocusableElement = $$props2.firstFocusableElement);
    if ("focusableElements" in $$props2)
      $$invalidate(9, focusableElements = $$props2.focusableElements);
    if ("labelId" in $$props2)
      $$invalidate(3, labelId = $$props2.labelId);
    if ("lastFocusableElement" in $$props2)
      $$invalidate(10, lastFocusableElement = $$props2.lastFocusableElement);
    if ("step" in $$props2)
      $$invalidate(4, step = $$props2.step);
    if ("dataStepId" in $$props2)
      $$invalidate(1, dataStepId = $$props2.dataStepId);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 16) {
      {
        $$invalidate(5, hasCancelIcon = step.options && step.options.cancelIcon && step.options.cancelIcon.enabled);
        $$invalidate(6, hasTitle = step.options && step.options.title);
      }
    }
  };
  return [element2, dataStepId, descriptionId, labelId, step, hasCancelIcon, hasTitle, handleKeyDown, firstFocusableElement, focusableElements, lastFocusableElement, classPrefix, getElement, div_binding];
};
var getContext = function(window2) {
  let context = {};
  if (window2.navigator) {
    const userAgent = window2.navigator.userAgent;
    context = {
      ...context,
      $os: os(window2),
      $browser: browser(userAgent, window2.navigator.vendor, !!window2.opera),
      $referrer: window2.document.referrer,
      $referring_domain: referringDomain(window2.document.referrer),
      $device: device(userAgent),
      $current_url: window2.location.href,
      $host: window2.location.host,
      $pathname: window2.location.pathname,
      $browser_version: browserVersion(userAgent, window2.navigator.vendor, !!window2.opera),
      $screen_height: window2.screen.height,
      $screen_width: window2.screen.width,
      $screen_dpr: window2.devicePixelRatio
    };
  }
  context = {
    ...context,
    $lib: "js",
    $insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
    $time: new Date().getTime() / 1000
  };
  return context;
};
var includes = function(haystack, needle) {
  return haystack.indexOf(needle) >= 0;
};
var browser = function(userAgent, vendor, opera) {
  vendor = vendor || "";
  if (opera || includes(userAgent, " OPR/")) {
    if (includes(userAgent, "Mini")) {
      return "Opera Mini";
    }
    return "Opera";
  } else if (/(BlackBerry|PlayBook|BB10)/i.test(userAgent)) {
    return "BlackBerry";
  } else if (includes(userAgent, "IEMobile") || includes(userAgent, "WPDesktop")) {
    return "Internet Explorer Mobile";
  } else if (includes(userAgent, "SamsungBrowser/")) {
    return "Samsung Internet";
  } else if (includes(userAgent, "Edge") || includes(userAgent, "Edg/")) {
    return "Microsoft Edge";
  } else if (includes(userAgent, "FBIOS")) {
    return "Facebook Mobile";
  } else if (includes(userAgent, "Chrome")) {
    return "Chrome";
  } else if (includes(userAgent, "CriOS")) {
    return "Chrome iOS";
  } else if (includes(userAgent, "UCWEB") || includes(userAgent, "UCBrowser")) {
    return "UC Browser";
  } else if (includes(userAgent, "FxiOS")) {
    return "Firefox iOS";
  } else if (includes(vendor, "Apple")) {
    if (includes(userAgent, "Mobile")) {
      return "Mobile Safari";
    }
    return "Safari";
  } else if (includes(userAgent, "Android")) {
    return "Android Mobile";
  } else if (includes(userAgent, "Konqueror")) {
    return "Konqueror";
  } else if (includes(userAgent, "Firefox")) {
    return "Firefox";
  } else if (includes(userAgent, "MSIE") || includes(userAgent, "Trident/")) {
    return "Internet Explorer";
  } else if (includes(userAgent, "Gecko")) {
    return "Mozilla";
  } else {
    return "";
  }
};
var browserVersion = function(userAgent, vendor, opera) {
  const regexList = {
    "Internet Explorer Mobile": /rv:(\d+(\.\d+)?)/,
    "Microsoft Edge": /Edge?\/(\d+(\.\d+)?)/,
    Chrome: /Chrome\/(\d+(\.\d+)?)/,
    "Chrome iOS": /CriOS\/(\d+(\.\d+)?)/,
    "UC Browser": /(UCBrowser|UCWEB)\/(\d+(\.\d+)?)/,
    Safari: /Version\/(\d+(\.\d+)?)/,
    "Mobile Safari": /Version\/(\d+(\.\d+)?)/,
    Opera: /(Opera|OPR)\/(\d+(\.\d+)?)/,
    Firefox: /Firefox\/(\d+(\.\d+)?)/,
    "Firefox iOS": /FxiOS\/(\d+(\.\d+)?)/,
    Konqueror: /Konqueror:(\d+(\.\d+)?)/,
    BlackBerry: /BlackBerry (\d+(\.\d+)?)/,
    "Android Mobile": /android\s(\d+(\.\d+)?)/,
    "Samsung Internet": /SamsungBrowser\/(\d+(\.\d+)?)/,
    "Internet Explorer": /(rv:|MSIE )(\d+(\.\d+)?)/,
    Mozilla: /rv:(\d+(\.\d+)?)/
  };
  const browserString = browser(userAgent, vendor, opera);
  const regex = regexList[browserString] || undefined;
  if (regex === undefined) {
    return null;
  }
  const matches = userAgent.match(regex);
  if (!matches) {
    return null;
  }
  return parseFloat(matches[matches.length - 2]);
};
var os = function(window2) {
  const a = window2.navigator.userAgent;
  if (/Windows/i.test(a)) {
    if (/Phone/.test(a) || /WPDesktop/.test(a)) {
      return "Windows Phone";
    }
    return "Windows";
  } else if (/(iPhone|iPad|iPod)/.test(a)) {
    return "iOS";
  } else if (/Android/.test(a)) {
    return "Android";
  } else if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
    return "BlackBerry";
  } else if (/Mac/i.test(a)) {
    return "Mac OS X";
  } else if (/Linux/.test(a)) {
    return "Linux";
  } else if (/CrOS/.test(a)) {
    return "Chrome OS";
  } else {
    return "";
  }
};
var device = function(userAgent) {
  if (/Windows Phone/i.test(userAgent) || /WPDesktop/.test(userAgent)) {
    return "Windows Phone";
  } else if (/iPad/.test(userAgent)) {
    return "iPad";
  } else if (/iPod/.test(userAgent)) {
    return "iPod Touch";
  } else if (/iPhone/.test(userAgent)) {
    return "iPhone";
  } else if (/(BlackBerry|PlayBook|BB10)/i.test(userAgent)) {
    return "BlackBerry";
  } else if (/Android/.test(userAgent)) {
    return "Android";
  } else {
    return "";
  }
};
var referringDomain = function(referrer) {
  const split = referrer.split("/");
  if (split.length >= 3) {
    return split[2];
  }
  return "";
};
var cleanupSteps = function(tour) {
  if (tour) {
    const { steps } = tour;
    steps.forEach((step) => {
      if (step.options && step.options.canClickTarget === false && step.options.attachTo) {
        if (isHTMLElement$1(step.target)) {
          step.target.classList.remove("shepherd-target-click-disabled");
        }
      }
    });
  }
};
var getIdbProxyableTypes = function() {
  return idbProxyableTypes || (idbProxyableTypes = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
};
var getCursorAdvanceMethods = function() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey]);
};
var promisifyRequest = function(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  reverseTransformCache.set(promise, request);
  return promise;
};
var cacheDonePromiseForTransaction = function(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
};
var replaceTraps = function(callback) {
  idbProxyTraps = callback(idbProxyTraps);
};
var wrapFunction = function(func) {
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(this.request);
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
};
var transformCachableValue = function(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
};
var wrap = function(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
};
var openDB = function(name, version, {
  blocked,
  upgrade,
  blocking,
  terminated
} = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
};
var getMethod = function(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
    return;
  }
  const method = async function method(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([target2[targetFuncName](...args), isWrite && tx.done]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
};
var iterate = function() {
  return _iterate.apply(this, arguments);
};
var _iterate = function() {
  _iterate = _wrapAsyncGenerator(function* (...args) {
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
      cursor = yield _awaitAsyncGenerator(cursor.openCursor(...args));
    }
    if (!cursor)
      return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while (cursor) {
      yield proxiedCursor;
      cursor = yield _awaitAsyncGenerator(advanceResults.get(proxiedCursor) || cursor.continue());
      advanceResults.delete(proxiedCursor);
    }
  });
  return _iterate.apply(this, arguments);
};
var isIteratorProp = function(target, prop) {
  return prop === Symbol.asyncIterator && instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor]) || prop === "iterate" && instanceOfAny(target, [IDBIndex, IDBObjectStore]);
};
var makeOverlayPath = function({ width, height, x = 0, y = 0, r = 0 }) {
  const { innerWidth: w, innerHeight: h } = window;
  const { topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0 } = typeof r === "number" ? { topLeft: r, topRight: r, bottomRight: r, bottomLeft: r } : r;
  return `M${w},${h}H0V0H${w}V${h}ZM${x + topLeft},${y}a${topLeft},${topLeft},0,0,0-${topLeft},${topLeft}V${height + y - bottomLeft}a${bottomLeft},${bottomLeft},0,0,0,${bottomLeft},${bottomLeft}H${width + x - bottomRight}a${bottomRight},${bottomRight},0,0,0,${bottomRight}-${bottomRight}V${y + topRight}a${topRight},${topRight},0,0,0-${topRight}-${topRight}Z`;
};
var create_fragment = function(ctx) {
  let svg;
  let path;
  let svg_class_value;
  let mounted;
  let dispose;
  return {
    c() {
      svg = svg_element("svg");
      path = svg_element("path");
      attr(path, "d", ctx[2]);
      attr(svg, "class", svg_class_value = `${ctx[1] ? "shepherd-modal-is-visible" : ""} shepherd-modal-overlay-container`);
    },
    m(target, anchor) {
      insert(target, svg, anchor);
      append(svg, path);
      ctx[11](svg);
      if (!mounted) {
        dispose = listen(svg, "touchmove", ctx[3]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 4) {
        attr(path, "d", ctx2[2]);
      }
      if (dirty & 2 && svg_class_value !== (svg_class_value = `${ctx2[1] ? "shepherd-modal-is-visible" : ""} shepherd-modal-overlay-container`)) {
        attr(svg, "class", svg_class_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(svg);
      }
      ctx[11](null);
      mounted = false;
      dispose();
    }
  };
};
var _getScrollParent = function(element2) {
  if (!element2) {
    return null;
  }
  const isHtmlElement = element2 instanceof HTMLElement;
  const overflowY = isHtmlElement && window.getComputedStyle(element2).overflowY;
  const isScrollable = overflowY !== "hidden" && overflowY !== "visible";
  if (isScrollable && element2.scrollHeight >= element2.clientHeight) {
    return element2;
  }
  return _getScrollParent(element2.parentElement);
};
var _getIframeOffset = function(element2) {
  let offset = {
    top: 0,
    left: 0
  };
  if (!element2) {
    return offset;
  }
  let targetWindow = element2.ownerDocument.defaultView;
  while (targetWindow !== window.top) {
    var _targetWindow;
    const targetIframe = (_targetWindow = targetWindow) == null ? undefined : _targetWindow.frameElement;
    if (targetIframe) {
      var _targetIframeRect$scr, _targetIframeRect$scr2;
      const targetIframeRect = targetIframe.getBoundingClientRect();
      offset.top += targetIframeRect.top + ((_targetIframeRect$scr = targetIframeRect.scrollTop) != null ? _targetIframeRect$scr : 0);
      offset.left += targetIframeRect.left + ((_targetIframeRect$scr2 = targetIframeRect.scrollLeft) != null ? _targetIframeRect$scr2 : 0);
    }
    targetWindow = targetWindow.parent;
  }
  return offset;
};
var _getVisibleHeight = function(element2, scrollParent) {
  const elementRect = element2.getBoundingClientRect();
  let top = elementRect.y || elementRect.top;
  let bottom = elementRect.bottom || top + elementRect.height;
  if (scrollParent) {
    const scrollRect = scrollParent.getBoundingClientRect();
    const scrollTop = scrollRect.y || scrollRect.top;
    const scrollBottom = scrollRect.bottom || scrollTop + scrollRect.height;
    top = Math.max(top, scrollTop);
    bottom = Math.min(bottom, scrollBottom);
  }
  const height = Math.max(bottom - top, 0);
  return {
    y: top,
    height
  };
};
var instance = function($$self, $$props, $$invalidate) {
  let {
    element: element2,
    openingProperties
  } = $$props;
  let modalIsVisible = false;
  let rafId = undefined;
  let pathDefinition;
  closeModalOpening();
  const getElement = () => element2;
  function closeModalOpening() {
    $$invalidate(4, openingProperties = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      r: 0
    });
  }
  function hide() {
    $$invalidate(1, modalIsVisible = false);
    _cleanupStepEventListeners();
  }
  function positionModal(modalOverlayOpeningPadding = 0, modalOverlayOpeningRadius = 0, modalOverlayOpeningXOffset = 0, modalOverlayOpeningYOffset = 0, scrollParent, targetElement) {
    if (targetElement) {
      const {
        y,
        height
      } = _getVisibleHeight(targetElement, scrollParent);
      const {
        x,
        width,
        left
      } = targetElement.getBoundingClientRect();
      $$invalidate(4, openingProperties = {
        width: width + modalOverlayOpeningPadding * 2,
        height: height + modalOverlayOpeningPadding * 2,
        x: (x || left) + modalOverlayOpeningXOffset - modalOverlayOpeningPadding,
        y: y + modalOverlayOpeningYOffset - modalOverlayOpeningPadding,
        r: modalOverlayOpeningRadius
      });
    } else {
      closeModalOpening();
    }
  }
  function setupForStep(step) {
    _cleanupStepEventListeners();
    if (step.tour.options.useModalOverlay) {
      _styleForStep(step);
      show();
    } else {
      hide();
    }
  }
  function show() {
    $$invalidate(1, modalIsVisible = true);
  }
  const _preventModalBodyTouch = (e) => {
    e.preventDefault();
  };
  const _preventModalOverlayTouch = (e) => {
    e.stopPropagation();
  };
  function _addStepEventListeners() {
    window.addEventListener("touchmove", _preventModalBodyTouch, {
      passive: false
    });
  }
  function _cleanupStepEventListeners() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = undefined;
    }
    window.removeEventListener("touchmove", _preventModalBodyTouch, {
      passive: false
    });
  }
  function _styleForStep(step) {
    const {
      modalOverlayOpeningPadding,
      modalOverlayOpeningRadius,
      modalOverlayOpeningXOffset = 0,
      modalOverlayOpeningYOffset = 0
    } = step.options;
    const iframeOffset = _getIframeOffset(step.target);
    const scrollParent = _getScrollParent(step.target);
    const rafLoop = () => {
      rafId = undefined;
      positionModal(modalOverlayOpeningPadding, modalOverlayOpeningRadius, modalOverlayOpeningXOffset + iframeOffset.left, modalOverlayOpeningYOffset + iframeOffset.top, scrollParent, step.target);
      rafId = requestAnimationFrame(rafLoop);
    };
    rafLoop();
    _addStepEventListeners();
  }
  function svg_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(0, element2);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("element" in $$props2)
      $$invalidate(0, element2 = $$props2.element);
    if ("openingProperties" in $$props2)
      $$invalidate(4, openingProperties = $$props2.openingProperties);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 16) {
      $$invalidate(2, pathDefinition = makeOverlayPath(openingProperties));
    }
  };
  return [element2, modalIsVisible, pathDefinition, _preventModalOverlayTouch, openingProperties, getElement, closeModalOpening, hide, positionModal, setupForStep, show, svg_binding];
};
/*! shepherd.js 12.0.2 */

class Evented {
  on(event, handler, ctx, once = false) {
    if (isUndefined(this.bindings)) {
      this.bindings = {};
    }
    if (isUndefined(this.bindings[event])) {
      this.bindings[event] = [];
    }
    this.bindings[event]?.push({ handler, ctx, once });
    return this;
  }
  once(event, handler, ctx) {
    return this.on(event, handler, ctx, true);
  }
  off(event, handler) {
    if (isUndefined(this.bindings) || isUndefined(this.bindings[event])) {
      return this;
    }
    if (isUndefined(handler)) {
      delete this.bindings[event];
    } else {
      this.bindings[event]?.forEach((binding, index) => {
        if (binding.handler === handler) {
          this.bindings[event]?.splice(index, 1);
        }
      });
    }
    return this;
  }
  trigger(event, ...args) {
    if (!isUndefined(this.bindings) && this.bindings[event]) {
      this.bindings[event]?.forEach((binding, index) => {
        const { ctx, handler, once } = binding;
        const context = ctx || this;
        handler.apply(context, args);
        if (once) {
          this.bindings[event]?.splice(index, 1);
        }
      });
    }
    return this;
  }
}
_AsyncGenerator.prototype[typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
  return this;
}, _AsyncGenerator.prototype.next = function(e) {
  return this._invoke("next", e);
}, _AsyncGenerator.prototype.throw = function(e) {
  return this._invoke("throw", e);
}, _AsyncGenerator.prototype.return = function(e) {
  return this._invoke("return", e);
};
var actions = {
  defaultMerge: Symbol("deepmerge-ts: default merge"),
  skip: Symbol("deepmerge-ts: skip")
};
actions.defaultMerge;
var validRecordToStringValues = new Set(["[object Object]", "[object Module]"]);
var defaultMergeFunctions = Object.freeze({
  __proto__: null,
  mergeArrays: mergeArrays$2,
  mergeMaps: mergeMaps$2,
  mergeOthers: mergeOthers$2,
  mergeRecords: mergeRecords$2,
  mergeSets: mergeSets$2
});

class StepNoOp {
  constructor(_options) {
  }
}

class TourNoOp {
  constructor(_tour, _options) {
  }
}
var min = Math.min;
var max = Math.max;
var round = Math.round;
var floor = Math.floor;
var createCoords = (v) => ({
  x: v,
  y: v
});
var oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
var oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
var _excluded2 = ["mainAxis", "crossAxis", "fallbackPlacements", "fallbackStrategy", "fallbackAxisSideDirection", "flipAlignment"];
var _excluded4 = ["mainAxis", "crossAxis", "limiter"];
var computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? undefined : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0;i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = _extends({}, middlewareData, {
      [name]: _extends({}, middlewareData[name], data)
    });
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
var arrow$1 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    const {
      element: element2,
      padding = 0
    } = evaluate(options, state) || {};
    if (element2 == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform.getDimensions(element2);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? undefined : platform.getOffsetParent(element2));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform.isElement == null ? undefined : platform.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: _extends({
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset
      }, shouldAddOffset && {
        alignmentOffset
      }),
      reset: shouldAddOffset
    };
  }
});
var flip$1 = function flip(options) {
  if (options === undefined) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const _evaluate2 = evaluate(options, state), {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true
      } = _evaluate2, detectOverflowOptions = _objectWithoutPropertiesLoose(_evaluate2, _excluded2);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? undefined : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== "none") {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? undefined : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? undefined : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? undefined : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$map$so;
              const placement2 = (_overflowsData$map$so = overflowsData.map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? undefined : _overflowsData$map$so[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
var shift$1 = function shift(options) {
  if (options === undefined) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const _evaluate4 = evaluate(options, state), {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        }
      } = _evaluate4, detectOverflowOptions = _objectWithoutPropertiesLoose(_evaluate4, _excluded4);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn(_extends({}, state, {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      }));
      return _extends({}, limitedCoords, {
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      });
    }
  };
};
var limitShift$1 = function limitShift(options) {
  if (options === undefined) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset, state);
      const computedOffset = typeof rawOffset === "number" ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : _extends({
        mainAxis: 0,
        crossAxis: 0
      }, rawOffset);
      if (checkMainAxis) {
        const len = mainAxis === "y" ? "height" : "width";
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === "y" ? "width" : "height";
        const isOriginSide = ["top", "left"].includes(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? undefined : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? undefined : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};
var noOffsets = createCoords(0);
var topLayerSelectors = [":popover-open", ":modal"];
var getElementRects = async function getElementRects2(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: _extends({
      x: 0,
      y: 0
    }, await getDimensionsFn(data.floating))
  };
};
var platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
var shift2 = shift$1;
var flip2 = flip$1;
var arrow = arrow$1;
var limitShift2 = limitShift$1;
var computePosition = (reference, floating, options) => {
  const cache = new Map;
  const mergedOptions = _extends({
    platform
  }, options);
  const platformWithCache = _extends({}, mergedOptions.platform, {
    _c: cache
  });
  return computePosition$1(reference, floating, _extends({}, mergedOptions, {
    platform: platformWithCache
  }));
};
var always_set_through_set_attribute = ["width", "height"];
var current_component;
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
var seen_callbacks = new Set;
var flushidx = 0;
var outroing = new Set;
var outros;

class SvelteComponent {
  constructor() {
    this.$$ = undefined;
    this.$$set = undefined;
  }
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
var PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = {
    v: new Set
  })).v.add(PUBLIC_VERSION);

class Shepherd_button extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$8, safe_not_equal, {
      config: 6,
      step: 7
    });
  }
}

class Shepherd_footer extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$7, safe_not_equal, {
      step: 0
    });
  }
}

class Shepherd_cancel_icon extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, {
      cancelIcon: 0,
      step: 2
    });
  }
}

class Shepherd_title extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {
      labelId: 1,
      element: 0,
      title: 2
    });
  }
}

class Shepherd_header extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, {
      labelId: 0,
      step: 1
    });
  }
}

class Shepherd_text extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {
      descriptionId: 1,
      element: 0,
      step: 2
    });
  }
}

class Shepherd_content extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, {
      descriptionId: 0,
      labelId: 1,
      step: 2
    });
  }
}
var KEY_TAB = 9;
var KEY_ESC = 27;
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;

class Shepherd_element extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      classPrefix: 11,
      element: 0,
      descriptionId: 2,
      firstFocusableElement: 8,
      focusableElements: 9,
      labelId: 3,
      lastFocusableElement: 10,
      step: 4,
      dataStepId: 1,
      getElement: 12
    });
  }
  get getElement() {
    return this.$$.ctx[12];
  }
}

class Step extends Evented {
  constructor(tour, options = {}) {
    super();
    this.tour = tour;
    this.classPrefix = this.tour.options ? normalizePrefix(this.tour.options.classPrefix) : "";
    this.styles = tour.styles;
    this._resolvedAttachTo = null;
    autoBind(this);
    this._setOptions(options);
    return this;
  }
  cancel() {
    this.tour.cancel();
    this.trigger("cancel");
  }
  complete() {
    this.tour.complete();
    this.trigger("complete");
  }
  destroy() {
    destroyTooltip(this);
    if (isHTMLElement$1(this.el)) {
      this.el.remove();
      this.el = null;
    }
    this._updateStepTargetOnHide();
    this.trigger("destroy");
  }
  getTour() {
    return this.tour;
  }
  hide() {
    this.tour.modal?.hide();
    this.trigger("before-hide");
    if (this.el) {
      this.el.hidden = true;
    }
    this._updateStepTargetOnHide();
    this.trigger("hide");
  }
  _resolveAttachToOptions() {
    this._resolvedAttachTo = parseAttachTo(this);
    return this._resolvedAttachTo;
  }
  _getResolvedAttachToOptions() {
    if (this._resolvedAttachTo === null) {
      return this._resolveAttachToOptions();
    }
    return this._resolvedAttachTo;
  }
  isOpen() {
    return Boolean(this.el && !this.el.hidden);
  }
  show() {
    if (isFunction(this.options.beforeShowPromise)) {
      return Promise.resolve(this.options.beforeShowPromise()).then(() => this._show());
    }
    return Promise.resolve(this._show());
  }
  updateStepOptions(options) {
    Object.assign(this.options, options);
    if (this.shepherdElementComponent) {
      this.shepherdElementComponent.$set({ step: this });
    }
  }
  getElement() {
    return this.el;
  }
  getTarget() {
    return this.target;
  }
  _createTooltipContent() {
    const descriptionId = `${this.id}-description`;
    const labelId = `${this.id}-label`;
    this.shepherdElementComponent = new Shepherd_element({
      target: this.tour.options.stepsContainer || document.body,
      props: {
        classPrefix: this.classPrefix,
        descriptionId,
        labelId,
        step: this,
        styles: this.styles
      }
    });
    return this.shepherdElementComponent.getElement();
  }
  _scrollTo(scrollToOptions) {
    const { element: element2 } = this._getResolvedAttachToOptions();
    if (isFunction(this.options.scrollToHandler)) {
      this.options.scrollToHandler(element2);
    } else if (isElement$1(element2) && typeof element2.scrollIntoView === "function") {
      element2.scrollIntoView(scrollToOptions);
    }
  }
  _getClassOptions(stepOptions) {
    const defaultStepOptions = this.tour && this.tour.options && this.tour.options.defaultStepOptions;
    const stepClasses = stepOptions.classes ? stepOptions.classes : "";
    const defaultStepOptionsClasses = defaultStepOptions && defaultStepOptions.classes ? defaultStepOptions.classes : "";
    const allClasses = [
      ...stepClasses.split(" "),
      ...defaultStepOptionsClasses.split(" ")
    ];
    const uniqClasses = new Set(allClasses);
    return Array.from(uniqClasses).join(" ").trim();
  }
  _setOptions(options = {}) {
    let tourOptions = this.tour && this.tour.options && this.tour.options.defaultStepOptions;
    tourOptions = deepmerge({}, tourOptions || {});
    this.options = Object.assign({
      arrow: true
    }, tourOptions, options, mergeTooltipConfig(tourOptions, options));
    const { when } = this.options;
    this.options.classes = this._getClassOptions(options);
    this.destroy();
    this.id = this.options.id || `step-${uuid()}`;
    if (when) {
      Object.keys(when).forEach((event) => {
        this.on(event, when[event], this);
      });
    }
  }
  _setupElements() {
    if (!isUndefined(this.el)) {
      this.destroy();
    }
    this.el = this._createTooltipContent();
    if (this.options.advanceOn) {
      bindAdvance(this);
    }
    setupTooltip(this);
  }
  _show() {
    this.trigger("before-show");
    this._resolveAttachToOptions();
    this._setupElements();
    if (!this.tour.modal) {
      this.tour.setupModal();
    }
    this.tour.modal?.setupForStep(this);
    this._styleTargetElementForStep(this);
    if (this.el) {
      this.el.hidden = false;
    }
    if (this.options.scrollTo) {
      setTimeout(() => {
        this._scrollTo(this.options.scrollTo);
      });
    }
    if (this.el) {
      this.el.hidden = false;
    }
    const content = this.shepherdElementComponent.getElement();
    const target = this.target || document.body;
    target.classList.add(`${this.classPrefix}shepherd-enabled`);
    target.classList.add(`${this.classPrefix}shepherd-target`);
    content.classList.add("shepherd-enabled");
    this.trigger("show");
  }
  _styleTargetElementForStep(step) {
    const targetElement = step.target;
    if (!targetElement) {
      return;
    }
    if (step.options.highlightClass) {
      targetElement.classList.add(step.options.highlightClass);
    }
    targetElement.classList.remove("shepherd-target-click-disabled");
    if (step.options.canClickTarget === false) {
      targetElement.classList.add("shepherd-target-click-disabled");
    }
  }
  _updateStepTargetOnHide() {
    const target = this.target || document.body;
    if (this.options.highlightClass) {
      target.classList.remove(this.options.highlightClass);
    }
    target.classList.remove("shepherd-target-click-disabled", `${this.classPrefix}shepherd-enabled`, `${this.classPrefix}shepherd-target`);
  }
}
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
var transactionDoneMap = new WeakMap;
var transformCache = new WeakMap;
var reverseTransformCache = new WeakMap;
var idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
var unwrap = (value) => reverseTransformCache.get(value);
var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
var writeMethods = ["put", "add", "delete", "clear"];
var cachedMethods = new Map;
replaceTraps((oldTraps) => _extends({}, oldTraps, {
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
var advanceMethodProps = ["continue", "continuePrimaryKey", "advance"];
var methodMap = {};
var advanceResults = new WeakMap;
var ittrProxiedCursorToOriginalProxy = new WeakMap;
var cursorIteratorTraps = {
  get(target, prop) {
    if (!advanceMethodProps.includes(prop))
      return target[prop];
    let cachedFunc = methodMap[prop];
    if (!cachedFunc) {
      cachedFunc = methodMap[prop] = function(...args) {
        advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
      };
    }
    return cachedFunc;
  }
};
replaceTraps((oldTraps) => _extends({}, oldTraps, {
  get(target, prop, receiver) {
    if (isIteratorProp(target, prop))
      return iterate;
    return oldTraps.get(target, prop, receiver);
  },
  has(target, prop) {
    return isIteratorProp(target, prop) || oldTraps.has(target, prop);
  }
}));

class DataRequest {
  constructor(apiKey, apiPath, properties) {
    if (!apiKey) {
      throw new Error("Shepherd Pro: Missing required apiKey option.");
    }
    if (!apiPath) {
      throw new Error("Shepherd Pro: Missing required apiPath option.");
    }
    this.apiKey = apiKey;
    this.apiPath = apiPath;
    this.properties = properties;
  }
  async getTourState() {
    try {
      const response = await fetch(`${this.apiPath}/api/v1/state`, {
        headers: {
          Authorization: `ApiKey ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        method: "GET"
      });
      if (!response.ok) {
        throw new Error("Could not fetch state for tours \uD83D\uDC11");
      }
      const { data } = await response.json();
      this.tourStateDb = await openDB("TourState", 1, {
        upgrade(db) {
          db.createObjectStore("tours", {
            keyPath: "uniqueId"
          });
        }
      });
      if (Array.isArray(data) && data.length) {
        const tx = this.tourStateDb.transaction("tours", "readwrite");
        const tourAddTxs = data.map((tourState) => {
          return tx.store.put(tourState);
        });
        await Promise.all([...tourAddTxs, tx.done]);
      }
    } catch (error) {
      throw new Error("Error fetching data: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }
  async sendEvents(body) {
    body.data["properties"] = this.properties;
    try {
      const response = await fetch(`${this.apiPath}/api/v1/actor`, {
        headers: {
          Authorization: `ApiKey ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error("Could not create an event \uD83D\uDC11");
      }
      const { data } = await response.json();
      return data;
    } catch (error) {
      throw new Error("Error fetching data: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }
}

class Shepherd_modal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {
      element: 0,
      openingProperties: 4,
      getElement: 5,
      closeModalOpening: 6,
      hide: 7,
      positionModal: 8,
      setupForStep: 9,
      show: 10
    });
  }
  get getElement() {
    return this.$$.ctx[5];
  }
  get closeModalOpening() {
    return this.$$.ctx[6];
  }
  get hide() {
    return this.$$.ctx[7];
  }
  get positionModal() {
    return this.$$.ctx[8];
  }
  get setupForStep() {
    return this.$$.ctx[9];
  }
  get show() {
    return this.$$.ctx[10];
  }
}
var SHEPHERD_DEFAULT_API = "https://shepherdpro.com";
var SHEPHERD_USER_ID = "shepherdPro:userId";

class ShepherdPro extends Evented {
  constructor() {
    super(...arguments);
    this.isProEnabled = false;
  }
  async init(apiKey, apiPath, properties) {
    if (!apiKey) {
      throw new Error("Shepherd Pro: Missing required apiKey option.");
    }
    this.apiKey = apiKey;
    this.apiPath = apiPath ?? SHEPHERD_DEFAULT_API;
    this.properties = properties ?? {};
    this.properties["context"] = getContext(window);
    if (this.apiKey) {
      this.dataRequester = new DataRequest(this.apiKey, this.apiPath, this.properties);
      this.isProEnabled = true;
      const shepherdProId = localStorage.getItem(SHEPHERD_USER_ID);
      const promises = [this.dataRequester.getTourState()];
      if (!shepherdProId) {
        promises.push(this.createNewActor());
      }
      await Promise.all(promises);
    }
  }
  async createNewActor() {
    if (!this.dataRequester)
      return;
    const response = await this.dataRequester.sendEvents({
      data: {
        currentUserId: null,
        eventType: "setup"
      }
    });
    localStorage.setItem(SHEPHERD_USER_ID, String(response.actorId));
  }
  async isTourEnabled(tourId) {
    if (!this.dataRequester)
      return;
    const tourState = await this.dataRequester.tourStateDb?.get("tours", tourId);
    return tourState?.isActive ?? true;
  }
}

class Tour extends Evented {
  constructor(options = {}) {
    super();
    this.trackedEvents = ["active", "cancel", "complete", "show"];
    autoBind(this);
    const defaultTourOptions = {
      exitOnEsc: true,
      keyboardNavigation: true
    };
    this.options = Object.assign({}, defaultTourOptions, options);
    this.classPrefix = normalizePrefix(this.options.classPrefix);
    this.steps = [];
    this.addSteps(this.options.steps);
    const events = [
      "active",
      "cancel",
      "complete",
      "inactive",
      "show",
      "start"
    ];
    events.map((event) => {
      ((e) => {
        this.on(e, (opts) => {
          opts = opts || {};
          opts["tour"] = this;
          Shepherd.trigger(e, opts);
        });
      })(event);
    });
    this._setTourID(options.id);
    const { dataRequester } = Shepherd;
    if (dataRequester) {
      this.trackedEvents.forEach((event) => this.on(event, (opts) => {
        const { tour } = opts;
        const { id, steps } = tour;
        let position;
        if (event !== "active") {
          const { step: currentStep } = opts;
          if (currentStep) {
            position = steps.findIndex((step) => step.id === currentStep.id) + 1;
          }
        }
        const data = {
          currentUserId: localStorage.getItem(SHEPHERD_USER_ID),
          eventType: event,
          journeyData: {
            id,
            currentStep: position,
            numberOfSteps: steps.length,
            tourOptions: tour.options
          }
        };
        dataRequester.sendEvents({ data });
      }));
    }
    return this;
  }
  addStep(options, index) {
    let step = options;
    if (!(step instanceof Step)) {
      step = new Step(this, step);
    } else {
      step.tour = this;
    }
    if (!isUndefined(index)) {
      this.steps.splice(index, 0, step);
    } else {
      this.steps.push(step);
    }
    return step;
  }
  addSteps(steps) {
    if (Array.isArray(steps)) {
      steps.forEach((step) => {
        this.addStep(step);
      });
    }
    return this;
  }
  back() {
    const index = this.steps.indexOf(this.currentStep);
    this.show(index - 1, false);
  }
  async cancel() {
    if (this.options.confirmCancel) {
      const cancelMessage = this.options.confirmCancelMessage || "Are you sure you want to stop the tour?";
      let stopTour;
      if (isFunction(this.options.confirmCancel)) {
        stopTour = await this.options.confirmCancel();
      } else {
        stopTour = window.confirm(cancelMessage);
      }
      if (stopTour) {
        this._done("cancel");
      }
    } else {
      this._done("cancel");
    }
  }
  complete() {
    this._done("complete");
  }
  getById(id) {
    return this.steps.find((step) => {
      return step.id === id;
    });
  }
  getCurrentStep() {
    return this.currentStep;
  }
  hide() {
    const currentStep = this.getCurrentStep();
    if (currentStep) {
      return currentStep.hide();
    }
  }
  isActive() {
    return Shepherd.activeTour === this;
  }
  next() {
    const index = this.steps.indexOf(this.currentStep);
    if (index === this.steps.length - 1) {
      this.complete();
    } else {
      this.show(index + 1, true);
    }
  }
  removeStep(name) {
    const current = this.getCurrentStep();
    this.steps.some((step, i) => {
      if (step.id === name) {
        if (step.isOpen()) {
          step.hide();
        }
        step.destroy();
        this.steps.splice(i, 1);
        return true;
      }
    });
    if (current && current.id === name) {
      this.currentStep = undefined;
      this.steps.length ? this.show(0) : this.cancel();
    }
  }
  show(key = 0, forward = true) {
    const step = isString(key) ? this.getById(key) : this.steps[key];
    if (step) {
      this._updateStateBeforeShow();
      const shouldSkipStep = isFunction(step.options.showOn) && !step.options.showOn();
      if (shouldSkipStep) {
        this._skipStep(step, forward);
      } else {
        this.trigger("show", {
          step,
          previous: this.currentStep
        });
        this.currentStep = step;
        step.show();
      }
    }
  }
  async start() {
    if (Shepherd.isProEnabled && !await Shepherd.isTourEnabled(this.options.id)) {
      return;
    }
    this.trigger("start");
    this.focusedElBeforeOpen = document.activeElement;
    this.currentStep = null;
    this.setupModal();
    this._setupActiveTour();
    this.next();
  }
  _done(event) {
    const index = this.steps.indexOf(this.currentStep);
    if (Array.isArray(this.steps)) {
      this.steps.forEach((step) => step.destroy());
    }
    cleanupSteps(this);
    this.trigger(event, { index });
    Shepherd.activeTour = null;
    this.trigger("inactive", { tour: this });
    if (this.modal) {
      this.modal.hide();
    }
    if (event === "cancel" || event === "complete") {
      if (this.modal) {
        const modalContainer = document.querySelector(".shepherd-modal-overlay-container");
        if (modalContainer) {
          modalContainer.remove();
          this.modal = null;
        }
      }
    }
    if (isHTMLElement$1(this.focusedElBeforeOpen)) {
      this.focusedElBeforeOpen.focus();
    }
  }
  _setupActiveTour() {
    this.trigger("active", { tour: this });
    Shepherd.activeTour = this;
  }
  setupModal() {
    this.modal = new Shepherd_modal({
      target: this.options.modalContainer || document.body,
      props: {
        styles: this.styles
      }
    });
  }
  _skipStep(step, forward) {
    const index = this.steps.indexOf(step);
    if (index === this.steps.length - 1) {
      this.complete();
    } else {
      const nextIndex = forward ? index + 1 : index - 1;
      this.show(nextIndex, forward);
    }
  }
  _updateStateBeforeShow() {
    if (this.currentStep) {
      this.currentStep.hide();
    }
    if (!this.isActive()) {
      this._setupActiveTour();
    }
  }
  _setTourID(optionsId) {
    const tourName = this.options.tourName || "tour";
    const tourId = optionsId || uuid();
    this.id = `${tourName}--${tourId}`;
  }
}
var Shepherd = new ShepherdPro;
var isServerSide = typeof window === "undefined";
Shepherd.Step = isServerSide ? StepNoOp : Step;
Shepherd.Tour = isServerSide ? TourNoOp : Tour;

    var styles = `.shepherd-button{background:#3288e6;border:0;border-radius:3px;color:hsla(0,0%,100%,.75);cursor:pointer;margin-right:.5rem;padding:.5rem 1.5rem;transition:all .5s ease}.shepherd-button:not(:disabled):hover{background:#196fcc;color:hsla(0,0%,100%,.75)}.shepherd-button.shepherd-button-secondary{background:#f1f2f3;color:rgba(0,0,0,.75)}.shepherd-button.shepherd-button-secondary:not(:disabled):hover{background:#d6d9db;color:rgba(0,0,0,.75)}.shepherd-button:disabled{cursor:not-allowed}
.shepherd-footer{border-bottom-left-radius:5px;border-bottom-right-radius:5px;display:flex;justify-content:flex-end;padding:0 .75rem .75rem}.shepherd-footer .shepherd-button:last-child{margin-right:0}
.shepherd-cancel-icon{background:transparent;border:none;color:hsla(0,0%,50%,.75);cursor:pointer;font-size:2em;font-weight:400;margin:0;padding:0;transition:color .5s ease}.shepherd-cancel-icon:hover{color:rgba(0,0,0,.75)}.shepherd-has-title .shepherd-content .shepherd-cancel-icon{color:hsla(0,0%,50%,.75)}.shepherd-has-title .shepherd-content .shepherd-cancel-icon:hover{color:rgba(0,0,0,.75)}
.shepherd-title{color:rgba(0,0,0,.75);display:flex;flex:1 0 auto;font-size:1rem;font-weight:400;margin:0;padding:0}
.shepherd-header{align-items:center;border-top-left-radius:5px;border-top-right-radius:5px;display:flex;justify-content:flex-end;line-height:2em;padding:.75rem .75rem 0}.shepherd-has-title .shepherd-content .shepherd-header{background:#e6e6e6;padding:1em}
.shepherd-text{color:rgba(0,0,0,.75);font-size:1rem;line-height:1.3em;padding:.75em}.shepherd-text p{margin-top:0}.shepherd-text p:last-child{margin-bottom:0}
.shepherd-content{border-radius:5px;outline:none;padding:0}
.shepherd-element{background:#fff;border-radius:5px;box-shadow:0 1px 4px rgba(0,0,0,.2);max-width:400px;opacity:0;outline:none;transition:opacity .3s,visibility .3s;visibility:hidden;width:100%;z-index:9999}.shepherd-enabled.shepherd-element{opacity:1;visibility:visible}.shepherd-element[data-popper-reference-hidden]:not(.shepherd-centered){opacity:0;pointer-events:none;visibility:hidden}.shepherd-element,.shepherd-element *,.shepherd-element :after,.shepherd-element :before{box-sizing:border-box}.shepherd-arrow,.shepherd-arrow:before{height:16px;position:absolute;width:16px;z-index:-1}.shepherd-arrow:before{background:#fff;content:"";transform:rotate(45deg)}.shepherd-element[data-popper-placement^=top]>.shepherd-arrow{bottom:-8px}.shepherd-element[data-popper-placement^=bottom]>.shepherd-arrow{top:-8px}.shepherd-element[data-popper-placement^=left]>.shepherd-arrow{right:-8px}.shepherd-element[data-popper-placement^=right]>.shepherd-arrow{left:-8px}.shepherd-element.shepherd-centered>.shepherd-arrow{opacity:0}.shepherd-element.shepherd-has-title[data-popper-placement^=bottom]>.shepherd-arrow:before{background-color:#e6e6e6}.shepherd-target-click-disabled.shepherd-enabled.shepherd-target,.shepherd-target-click-disabled.shepherd-enabled.shepherd-target *{pointer-events:none}
.shepherd-modal-overlay-container{height:0;left:0;opacity:0;overflow:hidden;pointer-events:none;position:fixed;top:0;transition:all .3s ease-out,height 0ms .3s,opacity .3s 0ms;width:100vw;z-index:9997}.shepherd-modal-overlay-container.shepherd-modal-is-visible{height:100vh;opacity:.5;transform:translateZ(0);transition:all .3s ease-out,height 0s 0s,opacity .3s 0s}.shepherd-modal-overlay-container.shepherd-modal-is-visible path{pointer-events:all}`;
    var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)
console.log("Shepherd injection!");

const myFukingTour = new Shepherd.Tour({
  useModalOverlay: false,
  defaultStepOptions: {
    classes: "shadow-md bg-purple-dark",
    scrollTo: true,
  },
});

myFukingTour.addStep({
  id: "email",
  text: "email elem",
  attachTo: {
    element: "#email",
    on: "bottom",
  },
  classes: "email",
  buttons: [
    {
      text: "Next",
      action: myFukingTour.next,
    },
  ],
});

myFukingTour.addStep({
  id: "password",
  text: "pwd elem",
  attachTo: {
    element: "#password",
    on: "bottom",
  },
  classes: "password",
  buttons: [
    {
      text: "Next",
      action: myFukingTour.next,
    },
  ],
});

myFukingTour.start();

    // Your code here...
})();