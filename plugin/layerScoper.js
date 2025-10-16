/**
 * 位移焦点控制器
*/
let Scrren_Multipler = 0;
if (window.innerWidth === 1280) {
  Scrren_Multipler = 0.666667;
} else {
  Scrren_Multipler = window.innerWidth / 1920;
}

export function LogPrint() {
  this.info = (text) => {
    console.log(`[layerscoper-info]: ${text}`);
  };
  this.warn = (text) => {
    console.warn(`[layerscoper-warn]: ${text}`);
  };
  this.error = (text) => {
    console.error(`[layerscoper-error]: ${text}`);
  };
}
const Loger = new LogPrint();


/**
 * animateUtils的最基本的方法
 * 用于给元素添加类
 * 当isInfinite为否（默认值即为否）时， 将自动监听动画结束， 然后去掉添加的动画类
 * @param el
 * @param animateClass
 * @param isInfinite
 * @private
 */
const addAnimate = ({ el, animateClass, isInfinite = false }) => {
  el.classList.add(animateClass);
  if (isInfinite) return;
  const listener = () => {
    el.classList.remove(animateClass);
    el.removeEventListener('webkitAnimationEnd', listener);
  };
  el.addEventListener('webkitAnimationEnd', listener);
};

/**
 * 增加默认纵向回弹动效
 * @param el
 */
export const bounceVerticalAnimate = el => addAnimate({ el, animateClass: 'bounce-verticalcls' });
/**
 * 增加默认横向回弹动效
 * @param el
 */
export const bounceHorizonAnimate = el => addAnimate({ el, animateClass: 'bounce-horizoncls' });


export const backToData = (str) => {
  try {
    if (str) {
      const obj = JSON.parse(str);
      if (typeof obj === 'object') {
        return obj;
      }
      Loger.error(`isJson: binddata is not JSON Object`);
      return null;
    }
    Loger.info(`isJson: binddata is undefined`);
    return null;
  } catch (e) {
    Loger.error(`isJson: error`);
    return null;
  }
};

// 键盘键值
const KeyBoard_KeyCode = {
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  LEFT: 37,
  ENTER: 13,
  BACKSPACE: 8,
  END: 35,
  ESC: 27,
};

// 遥控器键值
const RemoteControl_KeyCode = {
  UP: 19,
  DOWN: 20,
  RIGHT: 22,
  LEFT: 21,
  ENTER: 23,
  BACKSPACE: 4,
};

/*
  计算两点之间距离- 跨scoped

  getBoundingClientRect 是一个历史悠久的 DOM 方法，最初由微软引入，后来被标准化。
  由于它的历史根源，几乎所有现代浏览器以及大多数较旧的浏览器都支持 getBoundingClientRect 方法。
  具体的浏览器版本支持情况如下：

  Internet Explorer: 支持从版本 IE4 开始的旧版方法，但从 IE9 开始完全符合现代标准。
  Firefox: 从版本 3 开始支持。
  Chrome: 从最初版本 1 开始支持。
  Safari: 从版本 4 开始支持。
  Opera: 从版本 9.5 开始支持
*/
export const twoPointDistance = ({ currentPoint, nextEle }) => {
  const rect1 = currentPoint.getBoundingClientRect();
  const rect2 = nextEle.getBoundingClientRect();
  const x1 = rect1.x + 0.5 * rect1.width;
  const y1 = rect1.y + 0.5 * rect1.height;
  const x2 = rect2.x + 0.5 * rect2.width;
  const y2 = rect2.y + 0.5 * rect2.height;
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
};

// 计算上下两点之间距离- 同scoped 用于Transit
export const twoPointDistanceSameScoped = ({ currentPoint, nextEle, direct }) => {
  const y1 = currentPoint.getBoundingClientRect().y + 0.5 * currentPoint.getBoundingClientRect().height;
  const y2 = nextEle.getBoundingClientRect().y + 0.5 * nextEle.getBoundingClientRect().height;
  if (direct === 'down') {
    if (Math.ceil(y2) > Math.ceil(y1)) {
      const x1 = currentPoint.getBoundingClientRect().x + 0.5 * currentPoint.getBoundingClientRect().width;
      const x2 = nextEle.getBoundingClientRect().x + 0.5 * nextEle.getBoundingClientRect().width;
      const a = Math.abs(x1 - x2);
      const b = Math.abs(y1 - y2);
      const c = Math.sqrt(a * a + b * b);
      return c;
    }
  } else if (direct === 'up') {
    if (Math.ceil(y2) < Math.ceil(y1)) {
      const x1 = currentPoint.getBoundingClientRect().x + 0.5 * currentPoint.getBoundingClientRect().width;
      const x2 = nextEle.getBoundingClientRect().x + 0.5 * nextEle.getBoundingClientRect().width;
      const a = Math.abs(x1 - x2);
      const b = Math.abs(y1 - y2);
      const c = Math.sqrt(a * a + b * b);
      return c;
    }
  }
  return 0;
};

export const scopedCompare = () => (a, b) => {
  const value1 = a.attributes["data-scoped"].value;
  const value2 = b.attributes["data-scoped"].value;
  if (value1 === value2) {
    Loger.error(`same scoped number is not allowed, scoped=${value1}`);
    throw new Error(`Same scoped number is not allowed, scoped=${value1}`);
  }
  return value1 - value2;
};


export const sortNumber = () => (a, b) => a - b;

export const runCallbackFn = ({ currentMap, direct, isBoundary, domEle }) => {
  if (!currentMap?.callBackFn) {
    return;
  }
  const cbData = {
    locationName: currentMap?.domList[currentMap?.stepList.indexOf(currentMap.currentY)][currentMap.currentX - 1].attributes?.locationname?.value || '',
    currentY: currentMap.currentY,
    currentX: currentMap.currentX,
    lastY: currentMap.lastY,
    lastX: currentMap.lastX,
    isBoundary,
    dataSource: backToData(currentMap?.domList[currentMap?.stepList.indexOf(currentMap.currentY)][currentMap.currentX - 1].attributes?.binddata?.value),
  };

  // 默认方式移动焦点时，添加回弹动画，如果走了手动方式，需要开发者手动触发动画或者不触发动画
  if (isBoundary && domEle) {
    Loger.info(`bounce-${direct}`);
    if (direct === 'left' || direct === 'right') {
      bounceHorizonAnimate(domEle);
    }
    if (direct === 'up' || direct === 'down') {
      bounceVerticalAnimate(domEle);
    }
  }
  switch (direct) {
    case 'up':
      currentMap?.callBackFn?.cbFocusUp && currentMap?.callBackFn?.cbFocusUp(cbData);
      break;
    case 'down':
      currentMap?.callBackFn?.cbFocusDown && currentMap?.callBackFn?.cbFocusDown(cbData);
      break;
    case 'left':
      currentMap?.callBackFn?.cbFocusLeft && currentMap?.callBackFn?.cbFocusLeft(cbData);
      break;
    case 'right':
      currentMap?.callBackFn?.cbFocusRight && currentMap?.callBackFn?.cbFocusRight(cbData);
      break;
    case 'backspace':
      currentMap?.callBackFn?.cbBackSpace && currentMap?.callBackFn?.cbBackSpace(cbData);
      break;
    default:
      break;
  }
};

/*
  改变当前焦点CSS, 并触发焦点改变的默认回调
  currentMap： 当前激活的实例
  direct: 方向  left-左  right-右 up-上 down-下  click-鼠标点击  handler-手动指定 system-系统矫正
*/
export const changeCurrentFocus = ({ currentMap, direct }) => {
  const _searchYIndex = currentMap.stepList.indexOf(currentMap.currentY);
  const _lastSearchYIndex = currentMap.stepList.indexOf(currentMap.lastY);
  const isNeedRemember = currentMap.recordList.indexOf(currentMap.currentY) !== -1;
  Loger.info(`changeCurrentFocus isNeedRemember:${isNeedRemember} direct:${direct}`);
  // 如果带有remember的scoped,需要记录选中态,选中态是跟随着focus一起动的
  if (isNeedRemember) {
    currentMap.domList[_searchYIndex].forEach((ele, idx) => {
      ele.classList.remove('selected');
      if (idx === currentMap.currentX - 1) {
        ele.classList.add('selected');
      }
    });
  }
  // 当某个已经落焦点所在的Scope DOM被重新渲染了,系统会矫正再重新找一个落焦点
  if (direct === 'system' && currentMap.domList[_lastSearchYIndex].length > 0) {
    console.warn('system last length > 0', currentMap.domList[_lastSearchYIndex], currentMap.domList[_lastSearchYIndex].length);
    currentMap.domList[_lastSearchYIndex].forEach((ele) => {
      ele.classList.remove('focus');
    });
  }
  if ((currentMap.lastY !== -1 || currentMap.lastX !== -1) && direct !== 'system') {
    const isLastNeedRemember = currentMap.domList[_lastSearchYIndex][0].parentNode.classList.value.indexOf('remembered') !== -1;
    currentMap.domList[_lastSearchYIndex][currentMap.lastX - 1].classList.remove('focus');
    // 选中态是跟随着focus一起移除，但是兼容鼠标点选，要清理所有，因为可能跨scoped点击
    if (isLastNeedRemember && (_searchYIndex === _lastSearchYIndex)) {
      currentMap.domList[_lastSearchYIndex][currentMap.lastX - 1].classList.remove('selected');
    }
  }
  // 添加新的焦点
  currentMap.domList[_searchYIndex][currentMap.currentX - 1].classList.add('focus');
  // 焦点有变化默认回调
  if (currentMap?.callBackFn?.cbFocusChange && (typeof currentMap?.callBackFn?.cbFocusChange === 'function')) {
    const cbData = {
      locationName: currentMap?.domList[currentMap?.stepList.indexOf(currentMap.currentY)][currentMap.currentX - 1].attributes?.locationname?.value || '',
      currentY: currentMap.currentY,
      currentX: currentMap.currentX,
      lastY: currentMap.lastY,
      lastX: currentMap.lastX,
      dataSource: backToData(currentMap?.domList[currentMap?.stepList.indexOf(currentMap.currentY)][currentMap.currentX - 1].attributes?.binddata?.value),
    };
    currentMap?.callBackFn?.cbFocusChange(cbData);
  }
};

export function LayerScoper() {
  let isInitFinish = false;

  // 多实例ids
  const controllerIds = [];

  // 当前唤醒实例
  let wakeUpIndex = 0;

  // 多实例存储
  const controllerMaps = {
    // content: {
    //   domList: [],
    //   stepList: [],
    //   transitList: [],
    //   recordList: [],
    //   openBoundaryList: [],
    //   scrollzoneList: [],
    //   lastY: -1,
    //   lastX: -1,
    //   currentY: -1,
    //   currentX: -1,
    //   callBackFn: {},
    //   selfDefinedCallBackFn: {},
    //   needScroll: false,
    //   scrollDirection: '',
    //   scrollData: {
    //     outerWidth: -1,
    //     outerHeight: -1,
    //     innerWidth: -1,
    //     innerHeight: -1,
    //   },
    // },
    // dialog-content: {
    //   domList: [],
    //   stepList: [],
    //   transitList: [],
    //   recordList: [],
    //   openBoundaryList: [],
    //   scrollzoneList: [],
    //   lastY: -1,
    //   lastX: -1,
    //   currentY: -1,
    //   currentX: -1,
    //   callBackFn: {},
    //   selfDefinedCallBackFn: {},
    //   needScroll: false,
    //   scrollDirection: '',
    //   scrollData: {
    //     outerWidth: -1,
    //     outerHeight: -1,
    //     innerWidth: -1,
    //     innerHeight: -1,
    //   },
    // },

  };

  /*
    改变当前焦点触发区块滚动 scoped-incontroll-scroll
  */
  this.currentScopeScroll = ({ currentMap, direct }) => {
    Loger.info(`currentScopeScroll direct: ${direct}`);
    const _id = controllerIds[wakeUpIndex];
    const outerDom = document.getElementById(_id).querySelectorAll('.scrollzone')[currentMap.scrollzoneList.indexOf(currentMap.currentY)];
    const innerDom = outerDom?.querySelector(':scope > .scoped-incontroll-scroll');
    if (!(outerDom && innerDom)) {
      Loger.info(`currentScopeScroll don't need to scopezone scroll`);
      return;
    }
    const _currentScoped = {
      outerWidth: outerDom.offsetWidth,
      outerHeight: outerDom.offsetHeight,
      innerWidth: innerDom.clientWidth,
      innerHeight: innerDom.clientHeight,
    };
    const focusDom = currentMap.domList[currentMap.stepList.indexOf(currentMap.currentY)][currentMap.currentX - 1];
    // focusDom几何中点相对于父级左边和顶部的距离，实际屏幕显示的真实距离值
    const relativeFather = {
      focusCenterToFatherTop: focusDom.getBoundingClientRect().top - outerDom.getBoundingClientRect().top + (0.5 * focusDom.getBoundingClientRect().height),
      focusCenterToFatherLeft: focusDom.getBoundingClientRect().left - outerDom.getBoundingClientRect().left + (0.5 * focusDom.getBoundingClientRect().width),
    };
    // 竖向滚动，判断内层高度要大于外层高度
    // if ((direct === 'up' || direct === 'down') && (_currentScoped.innerHeight > _currentScoped.outerHeight)) {
    if (_currentScoped.innerHeight > _currentScoped.outerHeight) {
      /*
        cha：表示目前获焦元素与滚动区中心的偏移量
        正数：获焦元素位于滚动区中心下面，需要向上滚
        负数：获焦元素位于滚动区中心上面，需要向下滚
      */
      const cha = relativeFather.focusCenterToFatherTop - (_currentScoped.outerHeight * 0.5 * Scrren_Multipler);
      const scrollVal = ((outerDom.scrollTop * Scrren_Multipler) + cha) / Scrren_Multipler;
      outerDom.scrollTo(0, scrollVal);
    }

    // 横向滚动，判断内层宽度要大于外层宽度
    // if ((direct === 'left' || direct === 'right') && (_currentScoped.innerWidth > _currentScoped.outerWidth)) {
    if (_currentScoped.innerWidth > _currentScoped.outerWidth) {
      /*
        cha：表示目前获焦元素与滚动区中心的偏移量
        正数：获焦元素位于滚动区中心右面，需要向左滚
        负数：获焦元素位于滚动区中心左面，需要向右滚
      */
      const cha = relativeFather.focusCenterToFatherLeft - (_currentScoped.outerWidth * 0.5 * Scrren_Multipler);
      const scrollVal = ((outerDom.scrollLeft * Scrren_Multipler) + cha) / Scrren_Multipler;
      outerDom.scrollTo(scrollVal, 0);
    }
  };

  /*
    改变当前焦点触发页面滚动 map-incontroll-scroll
  */
  this.currentMapScroll = () => {
    const _id = controllerIds[wakeUpIndex];
    const currentMap = controllerMaps[_id];
    if (!currentMap.needScroll || (currentMap.needScroll && !currentMap.scrollDirection)) {
      Loger.info('currentMapScroll: dont needScroll');
      return;
    }
    if (currentMap.needScroll && !currentMap.scrollDirection) {
      Loger.error('currentMapScroll: scrollDirection is null');
      return;
    }
    const outerDom = document.getElementById(_id);
    const innerDom = outerDom.querySelector(':scope > .map-incontroll-scroll');
    currentMap.scrollData.outerWidth = outerDom.offsetWidth;
    currentMap.scrollData.outerHeight = outerDom.offsetHeight;
    currentMap.scrollData.innerWidth = innerDom.clientWidth;
    currentMap.scrollData.innerHeight = innerDom.clientHeight;
    const focusDom = currentMap.domList[currentMap.stepList.indexOf(currentMap.currentY)][currentMap.currentX - 1];
    // 相对于父级的距离，实际屏幕显示的真实距离值
    const relativeFather = {
      focusCenterToFatherTop: focusDom.getBoundingClientRect().top - outerDom.getBoundingClientRect().top + (0.5 * focusDom.getBoundingClientRect().height),
      focusCenterToFatherLeft: focusDom.getBoundingClientRect().left - outerDom.getBoundingClientRect().left + (0.5 * focusDom.getBoundingClientRect().width),
    };

    // 竖向滚动，判断内层高度要大于外层高度
    if (currentMap.scrollDirection === 'vertical' && (currentMap.scrollData.innerHeight > currentMap.scrollData.outerHeight)) {
      /*
        cha：表示目前获焦元素与滚动区中心的偏移量
        正数：获焦元素位于滚动区中心下面，需要向上滚
        负数：获焦元素位于滚动区中心上面，需要向下滚
      */
      const cha = relativeFather.focusCenterToFatherTop - (currentMap.scrollData.outerHeight * 0.5 * Scrren_Multipler);
      const scrollVal = ((outerDom.scrollTop * Scrren_Multipler) + cha) / Scrren_Multipler;
      setTimeout(() => {
        outerDom.scrollTo(0, scrollVal);
      }, 10);
      return;
    }

    // 横向滚动，判断内层宽度要大于外层宽度
    if (currentMap.scrollDirection === 'horizontal' && (currentMap.scrollData.innerWidth > currentMap.scrollData.outerWidth)) {
      /*
        cha：表示目前获焦元素与滚动区中心的偏移量
        正数：获焦元素位于滚动区中心右面，需要向左滚
        负数：获焦元素位于滚动区中心左面，需要向右滚
      */
      const cha = relativeFather.focusCenterToFatherLeft - (currentMap.scrollData.outerWidth * 0.5 * Scrren_Multipler);
      const scrollVal = ((outerDom.scrollLeft * Scrren_Multipler) + cha) / Scrren_Multipler;
      setTimeout(() => {
        outerDom.scrollTo(scrollVal, 0);
      }, 10);
    }
  };

  this.onFocusDown = () => {
    const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
    // 手动控制
    const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
    if (_target[0]?.attributes?.godown?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.godown?.value]) === 'function') {
      try {
        // 返回当前Focus的坐标的信息，以及传入的参数
        currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.godown?.value]({
          locationName: _target[0].attributes?.locationname?.value || '',
          currentY: currentMap.currentY,
          currentX: currentMap.currentX,
          lastY: currentMap.lastY,
          lastX: currentMap.lastX,
          dataSource: backToData(_target[0]?.attributes?.binddata?.value),
        });
      } catch (e) {
        Loger.error(`godown error ${e}`);
      }
      return;
    }
    Loger.info('dont find godown or godown is not a function, use default');
    const _currentYIndex = currentMap.stepList.indexOf(currentMap.currentY);
    let flag = 0;
    let nearly = 0;
    let nearlyNextLine = Infinity;
    let remembered = -1;
    const isTransit = currentMap.transitList.indexOf(currentMap.currentY) !== -1;
    if (isTransit) {
      currentMap.domList[_currentYIndex].forEach((ele, index) => {
        const _nearlyNextLine = twoPointDistanceSameScoped({
          currentPoint: currentMap.domList[_currentYIndex][currentMap.currentX - 1],
          nextEle: ele,
          direct: 'down',
        });
        if (_nearlyNextLine !== 0 && _nearlyNextLine < nearlyNextLine) {
          flag = index;
          nearlyNextLine = _nearlyNextLine;
        }
      });
      // 如果没有找到同scoped下一行匹配, 可能会正常向下移动焦点也可能触碰到底部
      if (nearlyNextLine !== 0 && nearlyNextLine !== Infinity) {
        currentMap.lastY = currentMap.currentY;
        currentMap.lastX = currentMap.currentX;
        currentMap.currentX = flag + 1;
        Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
        // 改变css焦点
        changeCurrentFocus({ currentMap, direct: 'down' });
        // 触发区块滚动
        this.currentScopeScroll({ currentMap, direct: 'down' });
        // 触发页面滚动
        this.currentMapScroll();
        runCallbackFn({ currentMap, direct: 'down', isBoundary: false, domEle: _target[0] });
        return;
      }
    }
    /*
      触碰下壁
      case 1: 当前的scope值已经是stepList中的最后一个
      case 2: stepList中当前的scope值之后的所有domList子集都是空[]
    */
    if ((_currentYIndex + 1) >= currentMap.stepList.length) {
      Loger.info('触碰下壁');
      runCallbackFn({ currentMap, direct: 'down', isBoundary: true, domEle: _target[0] });
      return;
    }
    let _findNextIndex = -1;
    currentMap.stepList.forEach((scopedVal, index) => {
      if ((_findNextIndex === -1) && (index > _currentYIndex) && (currentMap.domList[index].length > 0)) {
        _findNextIndex = index;
      }
    });
    if (_findNextIndex === -1) {
      Loger.info('触碰下壁');
      runCallbackFn({ currentMap, direct: 'down', isBoundary: true, domEle: _target[0] });
      return;
    }

    currentMap.domList[_findNextIndex].forEach((ele, index) => {
      if (ele.classList.value.indexOf('selected') !== -1) {
        remembered = index;
      }
      const _nearly = twoPointDistance({
        currentPoint: currentMap.domList[_currentYIndex][currentMap.currentX - 1],
        nextEle: ele,
      });
      if (nearly === 0 || _nearly < nearly) {
        flag = index;
        nearly = _nearly;
      }
    });
    currentMap.lastY = currentMap.currentY;
    currentMap.lastX = currentMap.currentX;
    // 有记忆选中的焦点就直接跳到记忆焦点
    if (remembered !== -1) {
      currentMap.currentY = currentMap.stepList[_findNextIndex];
      currentMap.currentX = remembered + 1;
    } else {
      currentMap.currentY = currentMap.stepList[_findNextIndex];
      currentMap.currentX = flag + 1;
    }
    Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
    // 改变css焦点
    changeCurrentFocus({ currentMap, direct: 'down' });
    // 触发区块滚动
    this.currentScopeScroll({ currentMap, direct: 'down' });
    // 触发滚动
    this.currentMapScroll();
    runCallbackFn({ currentMap, direct: 'down', isBoundary: false, domEle: _target[0] });
  };

  this.onFocusUp = () => {
    const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
    // 手动控制
    const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
    if (_target[0]?.attributes?.goup?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goup?.value]) === 'function') {
      try {
        // 返回当前Focus的坐标的信息，以及传入的参数
        currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goup?.value]({
          locationName: _target[0].attributes?.locationname?.value || '',
          currentY: currentMap.currentY,
          currentX: currentMap.currentX,
          lastY: currentMap.lastY,
          lastX: currentMap.lastX,
          dataSource: backToData(_target[0]?.attributes?.binddata?.value),
        });
      } catch (e) {
        Loger.error(`goup error ${e}`);
      }
      return;
    }
    Loger.info('dont find goup or goup is not a function, use default');
    const _currentYIndex = currentMap.stepList.indexOf(currentMap.currentY);
    let flag = 0;
    let nearly = 0;
    let nearlyUpLine = Infinity;
    let remembered = -1;
    const isTransit = currentMap.transitList.indexOf(currentMap.currentY) !== -1;
    if (isTransit) {
      currentMap.domList[_currentYIndex].forEach((ele, index) => {
        const _nearlyUpLine = twoPointDistanceSameScoped({
          currentPoint: currentMap.domList[_currentYIndex][currentMap.currentX - 1],
          nextEle: ele,
          direct: 'up',
        });
        if (_nearlyUpLine !== 0 && _nearlyUpLine < nearlyUpLine) {
          flag = index;
          nearlyUpLine = _nearlyUpLine;
        }
      });
      // 如果没有找到同scoped下一行匹配, 可能会正常向下移动焦点也可能触碰到底部
      if (nearlyUpLine !== 0 && nearlyUpLine !== Infinity) {
        currentMap.lastY = currentMap.currentY;
        currentMap.lastX = currentMap.currentX;
        currentMap.currentX = flag + 1;
        Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
        // 改变css焦点
        changeCurrentFocus({ currentMap, direct: 'up' });
        // 触发区块滚动
        this.currentScopeScroll({ currentMap, direct: 'up' });
        // 触发滚动
        this.currentMapScroll();
        runCallbackFn({ currentMap, direct: 'up', isBoundary: false, domEle: _target[0] });
        return;
      }
    }
    /*
      触碰上壁
      case 1: 当前的scope值已经是stepList中的第一个
      case 2: stepList中当前的scope值之前的所有domList子集都是空[]
    */
    if (_currentYIndex <= 0) {
      Loger.info('触碰上壁');
      runCallbackFn({ currentMap, direct: 'up', isBoundary: true, domEle: _target[0] });
      return;
    }
    let _findNextIndex = -1;
    currentMap.stepList.forEach((scopedVal, index) => {
      if ((index < _currentYIndex) && (currentMap.domList[index].length > 0)) {
        _findNextIndex = index;
      }
    });
    if (_findNextIndex === -1) {
      Loger.info('触碰上壁');
      runCallbackFn({ currentMap, direct: 'up', isBoundary: true, domEle: _target[0] });
      return;
    }

    currentMap.domList[_findNextIndex].forEach((ele, index) => {
      if (ele.classList.value.indexOf('selected') !== -1) {
        remembered = index;
      }
      const _nearly = twoPointDistance({
        currentPoint: currentMap.domList[_currentYIndex][currentMap.currentX - 1],
        nextEle: ele,
      });
      if (nearly === 0 || _nearly < nearly) {
        flag = index;
        nearly = _nearly;
      }
    });
    currentMap.lastY = currentMap.currentY;
    currentMap.lastX = currentMap.currentX;
    // 有记忆选中的焦点就直接跳到记忆焦点
    if (remembered !== -1) {
      currentMap.currentY = currentMap.stepList[_findNextIndex];
      currentMap.currentX = remembered + 1;
    } else {
      currentMap.currentY = currentMap.stepList[_findNextIndex];
      currentMap.currentX = flag + 1;
    }
    Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
    // 改变css焦点
    changeCurrentFocus({ currentMap, direct: 'up' });
    // 触发区块滚动
    this.currentScopeScroll({ currentMap, direct: 'up' });
    // 触发滚动
    this.currentMapScroll();
    runCallbackFn({ currentMap, direct: 'up', isBoundary: false, domEle: _target[0] });
  };

  this.onFocusLeft = () => {
    const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
    // 手动控制
    const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
    if (_target[0]?.attributes?.goleft?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goleft?.value]) === 'function') {
      try {
        // 返回当前Focus的坐标的信息，以及传入的参数
        currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goleft?.value]({
          locationName: _target[0].attributes?.locationname?.value || '',
          currentY: currentMap.currentY,
          currentX: currentMap.currentX,
          lastY: currentMap.lastY,
          lastX: currentMap.lastX,
          dataSource: backToData(_target[0]?.attributes?.binddata?.value),
        });
      } catch (e) {
        Loger.error(`goleft error ${e}`);
      }
      return;
    }
    Loger.info('dont find goleft or goleft is not a function, use default');
    // 自动控制
    const _currentYIndex = currentMap.stepList.indexOf(currentMap.currentY);
    const isOpenBoundary = currentMap.openBoundaryList.indexOf(currentMap.currentY) !== -1;
    // 开放边界 && 位于当前scope第一个 && 存在上一个scope不为空的分组
    if (isOpenBoundary && (currentMap.currentX === 1)) {
      let _findNextIndex = -1;
      currentMap.stepList.forEach((scopedVal, index) => {
        if ((index < _currentYIndex) && (currentMap.domList[index].length > 0)) {
          _findNextIndex = index;
        }
      });
      if (_findNextIndex === -1) {
        Loger.info('触碰左壁');
        runCallbackFn({ currentMap, direct: 'left', isBoundary: true, domEle: _target[0] });
        return;
      }
      currentMap.lastY = currentMap.currentY;
      currentMap.lastX = currentMap.currentX;
      currentMap.currentY = currentMap.stepList[_findNextIndex];
      currentMap.currentX = currentMap.domList[_findNextIndex].length; // 这个地方要确认上一个scoped是否走记忆落焦 还是都定位到第一个 暂定先落焦到最后一个
      Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
      // 改变css焦点
      changeCurrentFocus({ currentMap, direct: 'left' });
      // 触发区块滚动
      this.currentScopeScroll({ currentMap, direct: 'left' });
      // 触发滚动
      this.currentMapScroll();
      runCallbackFn({ currentMap, direct: 'left', isBoundary: false, domEle: _target[0] });
      return;
    }
    if (currentMap.currentX <= 1) {
      Loger.info('触碰左壁');
      runCallbackFn({ currentMap, direct: 'left', isBoundary: true, domEle: _target[0] });
      return;
    }
    currentMap.lastY = currentMap.currentY;
    currentMap.lastX = currentMap.currentX;
    currentMap.currentX -= 1;
    Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
    // 改变css焦点
    changeCurrentFocus({ currentMap, direct: 'left' });
    // 触发区块滚动
    this.currentScopeScroll({ currentMap, direct: 'left' });
    // 触发滚动
    this.currentMapScroll();
    runCallbackFn({ currentMap, direct: 'left', isBoundary: false, domEle: _target[0] });
  };

  this.onFocusRight = () => {
    const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
    // 手动控制
    const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
    if (_target[0]?.attributes?.goright?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goright?.value]) === 'function') {
      try {
        // 返回当前Focus的坐标的信息，以及传入的参数
        currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goright?.value]({
          locationName: _target[0].attributes?.locationname?.value || '',
          currentY: currentMap.currentY,
          currentX: currentMap.currentX,
          lastY: currentMap.lastY,
          lastX: currentMap.lastX,
          dataSource: backToData(_target[0]?.attributes?.binddata?.value),
        });
      } catch (e) {
        Loger.error(`goright error ${e}`);
      }
      return;
    }
    Loger.info('dont find goright or goright is not a function, use default');
    const _currentYIndex = currentMap.stepList.indexOf(currentMap.currentY);
    const isOpenBoundary = currentMap.openBoundaryList.indexOf(currentMap.currentY) !== -1;
    // 开放边界 && 位于当前scope最后一个 && 存在下一个scope不为空的分组
    if (isOpenBoundary && (currentMap.currentX === currentMap.domList[_currentYIndex].length)) {
      let _findNextIndex = -1;
      currentMap.stepList.forEach((scopedVal, index) => {
        if ((_findNextIndex === -1) && (index > _currentYIndex) && (currentMap.domList[index].length > 0)) {
          _findNextIndex = index;
        }
      });
      if (_findNextIndex === -1) {
        Loger.info('触碰右壁');
        runCallbackFn({ currentMap, direct: 'right', isBoundary: true, domEle: _target[0] });
        return;
      }
      currentMap.lastY = currentMap.currentY;
      currentMap.lastX = currentMap.currentX;
      currentMap.currentY = currentMap.stepList[_findNextIndex];
      currentMap.currentX = 1; // 这个地方要确认下一个scoped是否走记忆落焦 还是都定位到第一个 暂定先落焦到第一个
      Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
      // 改变css焦点
      changeCurrentFocus({ currentMap, direct: 'right' });
      // 触发区块滚动
      this.currentScopeScroll({ currentMap, direct: 'right' });
      // 触发滚动
      this.currentMapScroll();
      runCallbackFn({ currentMap, direct: 'right', isBoundary: false, domEle: _target[0] });
      return;
    }
    if (currentMap.currentX >= currentMap.domList[_currentYIndex].length) {
      Loger.info('触碰右壁');
      runCallbackFn({ currentMap, direct: 'right', isBoundary: true, domEle: _target[0] });
      return;
    }
    currentMap.lastY = currentMap.currentY;
    currentMap.lastX = currentMap.currentX;
    currentMap.currentX += 1;
    Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
    // 改变css焦点
    changeCurrentFocus({ currentMap, direct: 'right' });
    // 触发区块滚动
    this.currentScopeScroll({ currentMap, direct: 'right' });
    // 触发滚动
    this.currentMapScroll();
    runCallbackFn({ currentMap, direct: 'right', isBoundary: false, domEle: _target[0] });
  };

  this.onFocusKeyEnter = () => {
    try {
      const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
      const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
      // 返回当前Focus的坐标的信息，以及传入的绑定参数
      if (_target[0]?.attributes?.clickfocus?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.clickfocus?.value]) === 'function') {
        currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.clickfocus?.value]({
          locationName: _target[0].attributes?.locationname?.value || '',
          currentY: currentMap.currentY,
          currentX: currentMap.currentX,
          lastY: currentMap.lastY,
          lastX: currentMap.lastX,
          dataSource: backToData(_target[0]?.attributes?.binddata?.value),
        });
      }
    } catch (e) {
      Loger.error('onFocusKeyEnter error');
    }
  };

  this.onFocusMouseClick = (domObj) => {
    const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
    const _target = domObj?.target;
    try {
      // 先改变焦点
      console.warn('domObj', domObj);
      if (currentMap.currentY !== parseFloat(_target.attributes?.y.value) || currentMap.currentX !== parseFloat(_target.attributes?.x.value)) {
        currentMap.lastY = currentMap.currentY;
        currentMap.lastX = currentMap.currentX;
        currentMap.currentY = parseFloat(_target.attributes?.y.value);
        currentMap.currentX = parseFloat(_target.attributes?.x.value);
        // 改变css焦点
        changeCurrentFocus({ currentMap, direct: 'click' });
        // 触发区块滚动
        this.currentScopeScroll({ currentMap, direct: 'click' });
        // 触发滚动
        this.currentMapScroll();
      }
      // 返回当前Focus的坐标的信息，以及传入的参数
      if (_target?.attributes?.clickfocus?.value && (typeof currentMap?.selfDefinedCallBackFn[_target?.attributes?.clickfocus?.value]) === 'function') {
        currentMap?.selfDefinedCallBackFn[_target?.attributes?.clickfocus?.value]({
          locationName: _target.attributes?.locationname?.value || '',
          currentY: parseFloat(_target.attributes?.y.value),
          currentX: parseFloat(_target.attributes?.x.value),
          lastY: currentMap.lastY,
          lastX: currentMap.lastX,
          dataSource: backToData(_target?.attributes?.binddata?.value),
        });
      }
    } catch (e) {
      Loger.error(`onFocusMouseClick error ${JSON.stringify(e)}`);
    }
  };

  this.onBackSpace = () => {
    const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
    // 手动控制
    const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
    if (_target[0]?.attributes?.gobackspace?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.gobackspace?.value]) === 'function') {
      try {
        // 返回当前Focus的坐标的信息，以及传入的参数
        currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.gobackspace?.value]({
          locationName: _target[0].attributes?.locationname?.value || '',
          currentY: currentMap.currentY,
          currentX: currentMap.currentX,
          lastY: currentMap.lastY,
          lastX: currentMap.lastX,
          dataSource: backToData(_target[0]?.attributes?.binddata?.value),
        });
      } catch (e) {
        Loger.error('gobackspace error');
      }
      return;
    }
    Loger.info('dont find gobackspace or gobackspace is not a function, use default');
    runCallbackFn({ currentMap, direct: 'backspace', isBoundary: false, domEle: _target[0] });
  };

  // 初始化按键
  let keyEventInstalled = false;
  this.keyEventInstall = () => {
    window.onKeyDown = () => {
      Loger.info('onKeyDown: call');
      this.onFocusDown();
    };
    window.onKeyUp = () => {
      Loger.info('onKeyUp: call');
      this.onFocusUp();
    };
    window.onKeyLeft = () => {
      Loger.info('onKeyLeft: call');
      this.onFocusLeft();
    };
    window.onKeyRight = () => {
      Loger.info('onKeyRight: call');
      this.onFocusRight();
    };
    window.onKeyEnter = () => {
      Loger.info('onKeyEnter: call');
      this.onFocusKeyEnter();
    };
    window.onDismissDialog = () => {
      Loger.info('onBackSpace: call');
      this.onBackSpace();
    };
    if (keyEventInstalled) return;
    keyEventInstalled = true;
    // 兼容键盘事件
    window.addEventListener('keydown', (e) => {
      if ((e.keyCode === KeyBoard_KeyCode.UP) || (e.keyCode === RemoteControl_KeyCode.UP)) window.onKeyUp();
      if ((e.keyCode === KeyBoard_KeyCode.DOWN) || (e.keyCode === RemoteControl_KeyCode.DOWN)) window.onKeyDown();
      if ((e.keyCode === KeyBoard_KeyCode.RIGHT) || (e.keyCode === RemoteControl_KeyCode.RIGHT)) window.onKeyRight();
      if ((e.keyCode === KeyBoard_KeyCode.LEFT) || (e.keyCode === RemoteControl_KeyCode.LEFT)) window.onKeyLeft();
      if ((e.keyCode === KeyBoard_KeyCode.ENTER) || (e.keyCode === RemoteControl_KeyCode.ENTER)) window.onKeyEnter();
      if ((e.keyCode === KeyBoard_KeyCode.BACKSPACE) || (e.keyCode === RemoteControl_KeyCode.BACKSPACE)) window.onDismissDialog();
      if ((e.keyCode === KeyBoard_KeyCode.END) || (e.keyCode === KeyBoard_KeyCode.ESC)) window.onDismissDialog();
    });
  };

  /*
    增加一个新的逻辑层级
    调用时机：初始化实例 / 增加新的实例层级
  */
  this.addNewLevelData = (params) => {
    controllerIds.push(params?.id);
    controllerMaps[params.id] = {};

    const creatIndex = controllerIds.indexOf(params?.id);
    console.warn(creatIndex);
    console.warn(controllerIds);
    // 是否需要滚动
    controllerMaps[params.id].needScroll = params?.needScroll || false;
    if (controllerMaps[params.id].needScroll && !controllerMaps[params.id].scrollData) {
      controllerMaps[params.id].scrollDirection = params.scrollDirection;
      controllerMaps[params.id].scrollData = {
        outerWidth: -1,
        outerHeight: -1,
        innerWidth: -1,
        innerHeight: -1,
      };
      // 设置外层容器的CSS属性
      const outerDom = document.getElementById(params.id);
      if (controllerMaps[params.id].scrollDirection === 'vertical') {
        outerDom.style.overflowY = 'scroll';
        outerDom.style.overflowX = 'hidden';
      } else if (controllerMaps[params.id].scrollDirection === 'horizontal') {
        outerDom.style.overflowY = 'hidden';
        outerDom.style.overflowX = 'scroll';
      } else {
        Loger.error('addNewLevelData: scrollDirection config error');
        return;
      }
      /*
        设置内层容器的CSS属性
        横向滚动时，map-incontroll-scroll必须是display:inline-block, width: auto
      */
      const innerDom = outerDom.querySelector(':scope > .map-incontroll-scroll');
      if (innerDom) {
        innerDom.style.display = 'inline-block';
        innerDom.style.width = 'auto';
      } else {
        Loger.error(`addNewLevelData: "className .map-incontroll-scroll" must at first level childNode for the parent id=${params.id}`);
        delete controllerMaps[params.id];
        controllerIds.splice(creatIndex, 1);
        throw new Error(`addNewLevelData: "className .map-incontroll-scroll" must at first level childNode for the parent id=${params.id}`);
      }
      /*
        设置滚动条属性
      */
      if (params.scrollBarConfig && params.scrollBarConfig.showScrollBar) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
          #${params.id}::-webkit-scrollbar {
            width: ${params.scrollBarConfig.trackWidth || '8px'};
            height: ${params.scrollBarConfig.trackWidth || '8px'};
          }
          #${params.id}::-webkit-scrollbar-track {
            background: ${params.scrollBarConfig.trackBackground || 'none'};
            border-radius: ${params.scrollBarConfig.trackBorderRadius || 0};
          }
          #${params.id}::-webkit-scrollbar-thumb {
            background: ${params.scrollBarConfig.thumbColor || 'rgba(255,255,255,0)'};
            border-radius: ${params.scrollBarConfig.thumbBorderRadius || '4px'};
            border-width: ${params.scrollBarConfig.thumbBorderWidth || 0};
            border-color: ${params.scrollBarConfig.thumbBorderColor || 'none'};
            border-style: 'solid';
          }
          #${params.id}::-webkit-scrollbar-thumb:hover {
            background: ${params.scrollBarConfig.thumbHoverColor || 'rgba(255,255,255,0)'};
          }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
      } else {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
          #${params.id}::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
          #${params.id}::-webkit-scrollbar-track {
            display: none;
            background: none;
          }
          #${params.id}::-webkit-scrollbar-thumb {
            display: none;
            background: none;
          }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
      }
    }

    const _scopedList = Array.prototype.slice.call(document.getElementById(controllerIds[creatIndex]).getElementsByClassName('scoped'));
    // scopedList需要从上到下排序来锚定Y值,但不能有重复scope值
    try {
      _scopedList.sort(scopedCompare());
    } catch (e) {
      delete controllerMaps[params.id];
      controllerIds.splice(creatIndex, 1);
      throw e;
    }
    controllerMaps[controllerIds[creatIndex]].domList = [];
    controllerMaps[controllerIds[creatIndex]].stepList = [];
    controllerMaps[controllerIds[creatIndex]].transitList = [];
    controllerMaps[controllerIds[creatIndex]].recordList = [];
    controllerMaps[controllerIds[creatIndex]].openBoundaryList = [];
    controllerMaps[controllerIds[creatIndex]].scrollzoneList = [];

    console.warn(_scopedList);
    _scopedList.forEach((ele) => {
      // 初始化或者添加新层级的时候，为了渲染性能，如果scoped里面的DOM为空，就不创建该位置以及标识记录数组，但是update方法会创建标识记录数组
      if (ele.querySelectorAll('.incontroll').length > 0) {
      // if (ele.childNodes.length > 0) {
        controllerMaps[controllerIds[creatIndex]].domList.push([]);
        console.warn(ele.attributes);
        controllerMaps[controllerIds[creatIndex]].stepList.push(parseFloat(ele.attributes["data-scoped"].value));
        // 可在同一个scope内部上下移动焦点
        if (ele.classList.value.indexOf('transit') !== -1) {
          controllerMaps[controllerIds[creatIndex]].transitList.push(parseFloat(ele.attributes["data-scoped"].value));
        }
        // 需要记录焦点，下次直接落焦到之前焦点上
        if (ele.classList.value.indexOf('remembered') !== -1) {
          controllerMaps[controllerIds[creatIndex]].recordList.push(parseFloat(ele.attributes["data-scoped"].value));
        }
        // 需要开放边界
        if (ele.classList.value.indexOf('openboundary') !== -1) {
          controllerMaps[controllerIds[creatIndex]].openBoundaryList.push(parseFloat(ele.attributes["data-scoped"].value));
        }
        // 可以滚动的区域
        if (ele.classList.value.indexOf('scrollzone') !== -1) {
          controllerMaps[controllerIds[creatIndex]].scrollzoneList.push(parseFloat(ele.attributes["data-scoped"].value));
        }
        // className = incontroll 不一定在childNodes第一层
        ele.querySelectorAll('.incontroll').forEach((ele2, index2) => {
        // ele.childNodes.forEach((ele2, index2) => {
          ele2.setAttribute('locationname', `ln_${(ele.attributes["data-scoped"].value).toString()}_${(index2 + 1).toString()}`);
          ele2.setAttribute('y', parseFloat(ele.attributes["data-scoped"].value));
          ele2.setAttribute('x', index2 + 1);
          // 给每个节点添加鼠标点击事件监听
          ele2.removeEventListener('click', this.onFocusMouseClick);
          ele2.addEventListener('click', this.onFocusMouseClick);
          controllerMaps[controllerIds[creatIndex]].domList[controllerMaps[controllerIds[creatIndex]].domList.length - 1].push(ele2);
        });
      }
    });
    Loger.info(`addNewLevelData stepList: ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].stepList)}`);
    Loger.info(`addNewLevelData transitList: ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].transitList)}`);
    Loger.info(`addNewLevelData recordList: ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].recordList)}`);
    Loger.info(`addNewLevelData openBoundaryList: ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].openBoundaryList)}`);
    Loger.info(`addNewLevelData scrollzoneList: ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].scrollzoneList)}`);
    // 根据传入的默认坐标,判断当前是否有这个DOM节点
    try {
      const _searchYIndex = controllerMaps[controllerIds[creatIndex]].stepList.indexOf((params.defaultPoint.y));
      const _searchXValue = controllerMaps[controllerIds[creatIndex]].domList[_searchYIndex][params.defaultPoint.x - 1].attributes.x.value;
      if (_searchYIndex !== -1 && parseFloat(_searchXValue) === params.defaultPoint.x) {
        controllerMaps[controllerIds[creatIndex]].lastY = -1;
        controllerMaps[controllerIds[creatIndex]].lastX = -1;
        controllerMaps[controllerIds[creatIndex]].currentY = params.defaultPoint.y;
        controllerMaps[controllerIds[creatIndex]].currentX = params.defaultPoint.x;
      }
    } catch (e) {
      // 当用户指定落焦点，但这个点不存在时，删除该层级全部数据
      Loger.error(`addNewLevelData default focus y: ${params.defaultPoint.y} x: ${params.defaultPoint.x} is not exist`);
      delete controllerMaps[params.id];
      controllerIds.splice(creatIndex, 1);
      Loger.error(`addNewLevelData controller fali to add new level case`);
      return;
    }
    // 创建默认回调函数
    if (params?.callBackFn) {
      controllerMaps[controllerIds[creatIndex]].callBackFn = Object.assign({}, params?.callBackFn);
    }
    // 创建用户自定义回调函数沙盒
    if (params?.selfDefinedCallBackFn) {
      controllerMaps[controllerIds[creatIndex]].selfDefinedCallBackFn = Object.assign({}, params?.selfDefinedCallBackFn);
    }

    Loger.info(`addNewLevelData controller add new level case success ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].stepList)} currentY ${controllerMaps[controllerIds[creatIndex]].currentY} currentX ${controllerMaps[controllerIds[creatIndex]].currentX}`);
  };

  /*
    初始化实例
  */
  this.initController = (params) => {
    Loger.info(`initController: params = ${JSON.stringify(params)}`);
    if (isInitFinish) {
      return;
    }
    if (!params.id || !params.className || !params.defaultPoint.x || !params.defaultPoint.y) {
      Loger.error('initController: missing necessary init params');
      return;
    }
    // 如果需要滚动 scrollDirection: horizontal / vertical
    if (params?.needScroll && !(params?.scrollDirection === 'horizontal' || params?.scrollDirection === 'vertical')) {
      Loger.error('addNewLevelData: value of scrollDirection must use horizontal/vertical');
      return;
    }
    // 添加回弹动画机制 + CSS
    if (params?.openAnimate || false) {
      Loger.info(`openAnimate`);
      const animateStyle = document.createElement('style');
      animateStyle.type = 'text/css';
      animateStyle.innerHTML = `
        @keyframes bounce-vertical{
          0%, 100%{
            transition-timing-function: cubic-bezier(0.215,.61,.355,1); /*贝塞尔曲线 ： X1 Y1 X2 Y2*/
            transform: translateY(0); /*设置只在Z轴上移动*/
          }
          15%, 40%, 75%{
            transition-timing-function: cubic-bezier(0.215,.61,.355,1); /*贝塞尔曲线 ： X1 Y1 X2 Y2*/
            transform: translateY(-3px);
          }
          30%, 60%, 90%{
            transition-timing-function: cubic-bezier(0.215,.61,.355,1); /*贝塞尔曲线 ： X1 Y1 X2 Y2*/
            transform: translateY(3px);
          }
        }
          
        @keyframes bounce-horizon{
          0%{
            transition-timing-function: cubic-bezier(0.215,.61,.355,1); /*贝塞尔曲线 ： X1 Y1 X2 Y2*/
            transform: translateX(0); /*设置只在Z轴上移动*/
          }
          15%, 40%, 75%{
            transition-timing-function: cubic-bezier(0.215,.61,.355,1); /*贝塞尔曲线 ： X1 Y1 X2 Y2*/
            transform: translateX(-3px);
          }
          30%, 60%, 90%{
            transition-timing-function: cubic-bezier(0.215,.61,.355,1); /*贝塞尔曲线 ： X1 Y1 X2 Y2*/
            transform: translateX(3px);
          }
        }
        
        .anti-shake { // 防抖补丁 解决内部抖动
          &::before {
            content: '.';
            position: absolute;
            color: transparent;
            font-size: 1rem;
            line-height: 1rem;
          }
        }
        
        .bounce-verticalcls{
          animation: bounce-vertical 700ms;
        }
        .bounce-horizoncls{
          animation: bounce-horizon 700ms;
        }
      `;
      document.getElementsByTagName('head')[0].appendChild(animateStyle);
    }
    try {
      this.addNewLevelData(params);
    } catch (e) {
      return;
    }
    // 默认的唤醒层级是0
    wakeUpIndex = 0;

    // 焦点改变
    changeCurrentFocus({ currentMap: controllerMaps[controllerIds[wakeUpIndex]] });
    // 初始化按键
    this.keyEventInstall();

    // 初始化完成
    isInitFinish = true;

    Loger.info(`initController init finish  ${JSON.stringify(controllerMaps[controllerIds[wakeUpIndex]])}`);
  };

  /*
    添加新的DOM层级，但是焦点移动需要手动触发，原因如下：
    1. 新的层级在页面创建时就实例化好了但是并不想立刻展示并且落焦，后续手动打开，比如侧浮层或者弹框
    2. 手动触发的好处是能让业务层开发者明确知道自己在干什么
  */
  this.addNewController = (params) => {
    if (!isInitFinish) {
      return;
    }
    if (!params.id || !params.className || !params.defaultPoint.x || !params.defaultPoint.y) {
      Loger.error(`init error: missing necessary add params`);
      return;
    }
    this.addNewLevelData(params);
  };

  /*
    更新某个实例层级下的数据
    id: 实例id
    needUpdateScoped: 要更新的scoped区块
  */
  this.update = ({ id, needUpdateScoped }) => {
    Loger.info(`updateData: needUpdateScoped：${needUpdateScoped}`);
    if (isInitFinish && controllerIds.indexOf(id) !== -1) {
      const _scopedList = Array.prototype.slice.call(document.getElementById(id).getElementsByClassName('scoped'));
      console.warn(_scopedList);
      // 判断是否是新的节点数据
      const updateIndex = controllerMaps[id].stepList.indexOf(needUpdateScoped);
      const _updateData = [];
      let _matchScopedValue = false;
      let _needRecord = false; // 需要记录焦点
      let _needTransit = false; // 需要内部移动焦点
      let _needOpenBoundary = false; // 需要开放边界
      let _needScrollzone = false; // 滚动区块

      // 更新needUpdateScoped下所有节点
      _scopedList.forEach((ele) => {
        if (ele.attributes["data-scoped"].value === needUpdateScoped.toString()) {
          console.warn(ele);
          _matchScopedValue = true;
          if (ele.classList.value.indexOf('remembered') !== -1) {
            _needRecord = true;
          }
          if (ele.classList.value.indexOf('transit') !== -1) {
            _needTransit = true;
          }
          if (ele.classList.value.indexOf('openboundary') !== -1) {
            _needOpenBoundary = true;
          }
          if (ele.classList.value.indexOf('scrollzone') !== -1) {
            _needScrollzone = true;
          }
          console.warn('11111', ele.querySelectorAll('.incontroll'));
          if (ele.querySelectorAll('.incontroll').length > 0) {
            // if (ele.childNodes.length > 0 && ele.attributes["data-scoped"].value === needUpdateScoped.toString()) {
            // className = incontroll 不一定在childNodes第一层
            ele.querySelectorAll('.incontroll').forEach((ele2, index2) => {
            // ele.childNodes.forEach((ele2, index2) => {
              console.warn('ele2', ele2);
              ele2.setAttribute('locationname', `ln_${needUpdateScoped.toString()}_${(index2 + 1).toString()}`);
              ele2.setAttribute('y', needUpdateScoped);
              ele2.setAttribute('x', index2 + 1);
              // 给每个节点添加鼠标点击事件监听
              ele2.removeEventListener('click', this.onFocusMouseClick);
              ele2.addEventListener('click', this.onFocusMouseClick);
              _updateData.push(ele2);
            });
          }
        }
      });

      // 未匹配到该节点
      if (_matchScopedValue === -1) {
        Loger.error(`update dont find this dom level point id ${id} needUpdateScoped ${needUpdateScoped}`);
        return;
      }

      // 新的节点数据还是替换之前的
      if (updateIndex === -1) {
        controllerMaps[id].stepList.push(needUpdateScoped);
        controllerMaps[id].stepList.sort(sortNumber());
        if (_needRecord) {
          controllerMaps[id].recordList.push(needUpdateScoped);
          controllerMaps[id].recordList.sort(sortNumber());
        }
        if (_needTransit) {
          controllerMaps[id].transitList.push(needUpdateScoped);
          controllerMaps[id].transitList.sort(sortNumber());
        }
        if (_needOpenBoundary) {
          controllerMaps[id].openBoundaryList.push(needUpdateScoped);
          controllerMaps[id].openBoundaryList.sort(sortNumber());
        }
        if (_needScrollzone) {
          controllerMaps[id].scrollzoneList.push(needUpdateScoped);
          controllerMaps[id].scrollzoneList.sort(sortNumber());
        }
        // 插入的新的位置
        if (needUpdateScoped === controllerMaps[id].stepList[0]) {
          controllerMaps[id].domList.unshift(_updateData);
        } else if (needUpdateScoped === controllerMaps[id].stepList[controllerMaps[id].stepList.length - 1]) {
          controllerMaps[id].domList.push(_updateData);
        } else {
          controllerMaps[id].domList.splice(controllerMaps[id].stepList.indexOf(needUpdateScoped), 0, _updateData);
        }
      } else {
        controllerMaps[id].domList[controllerMaps[id].stepList.indexOf(needUpdateScoped)] = _updateData;
        /*
          如果当前落焦点刚好位于这个wakeup update的scoped中
          这个地方要处理_updateData=[] 或 数据变化导致焦点丢失的问题
          矫正 该scoped的第一个 / 页面的第一个落焦位置
          case 1: 当前的层级，不是focus所在的scoped   不处理
          case 2: 当前的层级，是focus所在的scoped
                  - 清空了scope
                  - 未清空scope
                  - 触发滚动以及回调相关
          case 3: 不是当前的层级
                  - 清空了scope
                  - 未清空scope
                  - 不用触发滚动以及回调相关
        */
        if (controllerIds[wakeUpIndex] === id && controllerMaps[id].currentY !== needUpdateScoped) {
          return;
        }
        if (controllerMaps[id].domList[controllerMaps[id].stepList.indexOf(needUpdateScoped)].length === 0) {
          console.warn(needUpdateScoped, '清空了, 落焦去第一个点');
          let _systemFindtIndexY = -1;
          controllerMaps[id].domList.forEach((ele, index) => {
            if (ele.length > 0 && _systemFindtIndexY === -1) {
              _systemFindtIndexY = index;
            }
          });
          // 默认落焦到该层级的首个可落焦点上
          controllerMaps[id].lastY = controllerMaps[id].currentY;
          controllerMaps[id].lastX = controllerMaps[id].currentX;
          controllerMaps[id].currentY = controllerMaps[id].stepList[_systemFindtIndexY];
          controllerMaps[id].currentX = 1;
        } else {
          console.warn(needUpdateScoped, '没清空, 该scoped还有数据');
          controllerMaps[id].lastY = controllerMaps[id].currentY;
          controllerMaps[id].lastX = controllerMaps[id].currentX;
          controllerMaps[id].currentY = needUpdateScoped;
          controllerMaps[id].currentX = 1;
        }
        if (controllerIds[wakeUpIndex] === id) {
          // 改变css焦点
          changeCurrentFocus({ currentMap: controllerMaps[id], direct: 'system' });
          // 触发区块滚动
          this.currentScopeScroll({ currentMap: controllerMaps[id], direct: 'system' });
          // 触发滚动
          this.currentMapScroll();
          runCallbackFn({ currentMap: controllerMaps[id], direct: 'system', isBoundary: false });
        }
      }
    } else {
      Loger.warn(`updateData: don't init finished or ${id} is not exist`);
    }
  };

  /*
    唤醒某个实例层级，达到切换的效果，可以指定唤醒后层级的默认落焦
    id: 要唤醒的层级                         必传
    targetY/targetX: 唤醒后默认落焦          非必传
  */
  this.wakeUp = (obj) => {
    const { id, targetY, targetX } = obj;
    Loger.info(`wakeUp id: ${id} current wakeUpIndex: ${wakeUpIndex} next to wakeUpIndex: ${controllerIds.indexOf(id)}`);
    if (!id || !controllerMaps[id]) {
      Loger.error(`wakeUp id is not exist`);
      return;
    }
    /*
      先判断用户指定的点(targetY， targetX)是否存在，如果不存在就不能切换焦点，并提示点不存在
      _next.currentY  _next.currentX 表示当用户没有指定即将唤醒的层级落焦点时，就默认落焦到该层级之前的历史落焦点上
    */
    const _next = controllerMaps[controllerIds[controllerIds.indexOf(id)]];
    const _targetY = targetY || _next.currentY;
    const _targetX = targetX || _next.currentX;
    Loger.info(`wakeUp _next ${controllerIds[controllerIds.indexOf(id)]}, _targetY: ${_targetY} _targetX: ${_targetX}`);
    const _currentNewYIndex = _next.stepList.indexOf(_targetY);
    if (_currentNewYIndex >= 0 && _next.domList[_currentNewYIndex][_targetX - 1]) {
      // 先处理之前层级的逻辑失去焦点
      const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
      const _currentYIndex = currentMap.stepList.indexOf(currentMap.currentY);
      currentMap.domList[_currentYIndex][currentMap.currentX - 1].classList.remove('focus');

      // 切换逻辑层级
      wakeUpIndex = controllerIds.indexOf(id);
      const _next = controllerMaps[controllerIds[wakeUpIndex]];
      _next.domList[_currentNewYIndex][_targetX - 1].classList.add('focus');
      _next.lastY = _next.currentY;
      _next.lastX = _next.currentX;
      _next.currentY = _targetY;
      _next.currentX = _targetX;

      // DOM渲染完成之前，高度等参数无法计算，异步处理
      setTimeout(() => {
        // 触发区块滚动
        this.currentScopeScroll({ currentMap: _next, direct: 'system' });
        // 触发滚动
        this.currentMapScroll();
      }, 0);
      // 新的层级里落焦也会触发焦点变化的回调，但是这个回调是在新的层级里触发的
      const cbData = {
        locationName: _next?.domList[_next?.stepList.indexOf(_next.currentY)][_next.currentX - 1].attributes?.locationname?.value || '',
        currentY: _next.currentY,
        currentX: _next.currentX,
        lastY: _next.lastY,
        lastX: _next.lastX,
        dataSource: backToData(_next?.domList[_next?.stepList.indexOf(_next.currentY)][_next.currentX - 1].attributes?.binddata?.value),
      };
      _next?.callBackFn?.cbFocusChange && _next?.callBackFn?.cbFocusChange(cbData);
    } else {
      Loger.error(`wakeUp targetY: ${_targetY} targetX: ${_targetX} is not exist in dom id: ${id}`);
    }
  };

  // 直接跳转到某个指定的焦点, 只支持同层级
  this.goToFocus = (params) => {
    Loger.info(`gotoFocus params:, ${JSON.stringify(params)}`);
    if (!params?.targetY || !params?.targetX || typeof params.targetY !== 'number' || typeof params.targetX !== 'number') {
      Loger.error('params:targetY/targetX is necessary and dataType use Number');
      return;
    }
    // 判断跳转的点是否在当前的层级内，如果不在就要调用唤醒方法
    const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
    if (currentMap && currentMap?.stepList.indexOf(params.targetY) === -1) {
      Loger.error(`this point targetY is not exist in current level case`);
      return;
    }
    if (!currentMap?.domList[currentMap.stepList.indexOf(params.targetY)][params.targetX - 1]) {
      Loger.error(`this point targetX is not exist in current level case`);
      return;
    }
    currentMap.lastY = currentMap.currentY;
    currentMap.lastX = currentMap.currentX;
    currentMap.currentY = params.targetY;
    currentMap.currentX = params.targetX;
    // 改变css焦点
    changeCurrentFocus({ currentMap, direct: 'handler' });
    // 触发区块滚动
    this.currentScopeScroll({ currentMap, direct: 'handler' });
    // 触发滚动
    this.currentMapScroll();
    runCallbackFn({ currentMap, direct: 'handler', isBoundary: false });
  };

  // 设置scope.remember中默认选中的落焦
  this.setScopeSelectedItem = (obj) => {
    if (!obj.id || !obj.targetY || !obj.targetX || typeof (obj.targetY) !== 'number' || typeof (obj.targetX) !== 'number') {
      Loger.error(`setScopeSelectedItem: missing necessary parameter of id[String]/targetY[Number]/targetX[Number]`);
      return;
    }
    if (!controllerMaps[obj.id]) {
      Loger.error(`setScopeSelectedItem: controllerMap-${obj.id} is not exist`);
      return;
    }
    const _needChangedMap = controllerMaps[controllerIds[controllerIds.indexOf(obj.id)]];
    // 判断targetY是不是存在
    if (_needChangedMap && _needChangedMap?.recordList.indexOf(obj.targetY) === -1) {
      Loger.error(`setScopeSelectedItem: scoped-${obj.targetY} is not exist`);
      return;
    }
    const _needScopedIndex = _needChangedMap.stepList.indexOf(obj.targetY);
    // 判断targetX是不是存在
    if (parseFloat(_needChangedMap?.domList[_needScopedIndex][obj.targetX - 1]?.attributes?.x.value) === obj.targetX) {
      // remember标记下的才能设置selected
      if (_needChangedMap?.recordList.indexOf(obj.targetY) !== -1) {
        _needChangedMap.domList[_needScopedIndex].forEach((ele) => {
          ele.classList.remove('selected');
          if (parseFloat(ele.attributes.x.value) === obj.targetX) {
            ele.classList.add('selected');
          }
        });
      } else {
        Loger.error(`setScopeSelectedItem: scoped-${obj.targetY} is not set remembered`);
      }
    } else {
      Loger.error(`setScopeSelectedItem: scoped-${obj.targetY}-${obj.targetX} is not exist`);
    }
  };

  // 手动获取坐标信息
  this.getLocationInfo = () => {
    const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
    return {
      currentY: currentMap.currentY,
      currentX: currentMap.currentX,
      lastY: currentMap.lastY,
      lastX: currentMap.lastX,
    };
  };
}
