/**
 * 位移焦点控制器
 */
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

/*
    页面启动缩放单位换算
    如果是 px 为单位的，则直接使用实际 px 数值
    如果是 rem 为单位的，则需要根据实际屏幕宽度计算倍率
    如果是 em 为单位的，则需要根据实际屏幕宽度计算倍率
    如果是 vw 为单位的，则需要根据实际屏幕宽度计算倍率
    如果是 vh 为单位的，则需要根据实际屏幕宽度计算倍率
    如果是 vm 为单位的，则需要根据实际屏幕宽度计算倍率
    如果是 vmin 为单位的，则需要根据实际屏幕宽度计算倍率
    如果是 vmax 为单位的，则需要根据实际屏幕宽度计算倍率
*/
let ScrrenMultipler = 1;

export function setScreenMultiplier(value) {
    ScrrenMultipler = value;
}


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


/**
 * 将 .incontroll 元素上 binddata 属性（JSON 字符串）解析为业务数据对象
 * 用于 addNewLevelData/update 时写入 dataList，以及回调中 dataSource 的兜底解析
 * @param {string} [str] - JSON 字符串，通常来自 element.attributes.binddata?.value
 * @returns {object|null} 解析后的对象；非对象、空或解析失败时返回 null
 */
export const backToData = (str) => {
    try {
        if (str) {
            const obj = JSON.parse(str);
            if (typeof obj === 'object') {
                return obj;
            }
            Loger.error('isJson: binddata is not JSON Object');
            return null;
        }
        Loger.info('isJson: binddata is undefined');
        return null;
    } catch (e) {
        Loger.error('isJson: error');
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
    const value1 = a.attributes['data-scoped'].value;
    const value2 = b.attributes['data-scoped'].value;
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
    const _yIdx = currentMap?.stepList.indexOf(currentMap.currentY);
    const _xIdx = currentMap.currentX - 1;
    const cbData = {
        locationName: currentMap?.domList[_yIdx]?.[_xIdx]?.attributes?.locationname?.value || '',
        currentY: currentMap.currentY,
        currentX: currentMap.currentX,
        lastY: currentMap.lastY,
        lastX: currentMap.lastX,
        isBoundary,
        dataSource: currentMap?.dataList?.[_yIdx]?.[_xIdx] ?? null,
    };

    // 默认方式移动焦点时，添加回弹动画，如果走了手动方式，需要开发者手动触发动画或者不触发动画
    if (isBoundary && domEle && (typeof domEle.isConnected === 'undefined' || domEle.isConnected)) {
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

/**
 * 校验 currentMap 的 currentY/currentX 是否在有效范围内，且对应 DOM 仍在文档中（避免异步重渲染后引用失效）
 * @param {object} currentMap - controllerMaps[id]
 * @returns {boolean}
 */
export const isFocusValid = (currentMap) => {
    if (!currentMap?.domList?.length || !currentMap?.stepList?.length) return false;
    const yIdx = currentMap.stepList.indexOf(currentMap.currentY);
    if (yIdx === -1) return false;
    const row = currentMap.domList[yIdx];
    if (!row || !row.length) return false;
    const xIdx = currentMap.currentX - 1;
    if (xIdx < 0 || xIdx >= row.length) return false;
    const node = row[xIdx];
    return node && typeof node.isConnected === 'boolean' ? node.isConnected : true;
};

/**
 * 当焦点无效时，矫正到第一个非空 scope 的第一个可聚焦项（用于 DOM 重渲染/异步列表后的恢复）
 * @param {object} currentMap - controllerMaps[id]
 * @returns {boolean} 是否成功矫正
 */
export const correctFocusToFirstValid = (currentMap) => {
    if (!currentMap?.domList?.length || !currentMap?.stepList?.length) return false;
    for (let i = 0; i < currentMap.domList.length; i += 1) {
        const row = currentMap.domList[i];
        if (!row?.length) {
            // skip empty scope
        } else {
            for (let j = 0; j < row.length; j += 1) {
                const node = row[j];
                if (node && (typeof node.isConnected === 'undefined' || node.isConnected)) {
                    currentMap.lastY = currentMap.currentY;
                    currentMap.lastX = currentMap.currentX;
                    currentMap.currentY = currentMap.stepList[i];
                    currentMap.currentX = j + 1;
                    Loger.info(`correctFocusToFirstValid: corrected to scope=${currentMap.currentY} x=${currentMap.currentX}`);
                    return true;
                }
            }
        }
    }
    return false;
};

/*
    改变当前焦点CSS, 并触发焦点改变的默认回调
    currentMap： 当前激活的实例
    direct: 方向  left-左  right-右 up-上 down-下  click-鼠标点击  handler-手动指定 system-系统矫正
    focusTargetNode: 可选，鼠标点击时传入被点击的 DOM 节点，避免 domList 未及时 update 时焦点落到错误节点
*/
export const changeCurrentFocus = ({ currentMap, direct, focusTargetNode }) => {
    if (!currentMap?.domList?.length || !currentMap?.stepList?.length) {
        Loger.warn('changeCurrentFocus: currentMap has no domList/stepList');
        return;
    }
    const _searchYIndex = currentMap.stepList.indexOf(currentMap.currentY);
    const _lastSearchYIndex = currentMap.stepList.indexOf(currentMap.lastY);
    const row = currentMap.domList[_searchYIndex];
    const currentDom = row?.[currentMap.currentX - 1];
    const currentValid = _searchYIndex !== -1 && row && currentMap.currentX >= 1 && currentMap.currentX <= row.length
        && currentDom && (typeof currentDom.isConnected === 'undefined' || currentDom.isConnected);
    if (!currentValid) {
        if (correctFocusToFirstValid(currentMap)) {
            changeCurrentFocus({ currentMap, direct: 'system' });
        }
        return;
    }
    const lastRow = currentMap.domList[_lastSearchYIndex];
    const lastDom = _lastSearchYIndex !== -1 && lastRow && currentMap.lastX >= 1 && currentMap.lastX <= lastRow.length
        ? lastRow[currentMap.lastX - 1] : null;
    const lastValid = lastDom && (typeof lastDom.isConnected === 'undefined' || lastDom.isConnected);
    const isNeedRemember = currentMap.recordList.indexOf(currentMap.currentY) !== -1;
    Loger.info(`changeCurrentFocus isNeedRemember:${isNeedRemember} direct:${direct}`);
    // 如果带有remember的scoped,需要记录选中态,选中态是跟随着focus一起动的
    if (isNeedRemember) {
        currentMap.domList[_searchYIndex].forEach((ele, idx) => {
            if (ele && (typeof ele.isConnected === 'undefined' || ele.isConnected)) {
                ele.classList.remove('selected');
                if (!focusTargetNode && idx === currentMap.currentX - 1) ele.classList.add('selected');
            }
        });
        if (focusTargetNode && (typeof focusTargetNode.isConnected === 'undefined' || focusTargetNode.isConnected)) {
            focusTargetNode.classList.add('selected');
        } else if (row?.[currentMap.currentX - 1]) {
            row[currentMap.currentX - 1].classList.add('selected');
        }
        if (currentMap?.callBackFn?.cbScopeSelectedChange && typeof currentMap.callBackFn.cbScopeSelectedChange === 'function') {
            const selectedEle = focusTargetNode || currentMap.domList[_searchYIndex]?.[currentMap.currentX - 1];
            const selectedData = currentMap.dataList?.[_searchYIndex]?.[currentMap.currentX - 1] ?? null;
            currentMap.callBackFn.cbScopeSelectedChange({
                id: currentMap.controllerId,
                targetY: currentMap.currentY,
                targetX: currentMap.currentX,
                locationName: selectedEle?.attributes?.locationname?.value || '',
                dataSource: selectedData,
            });
        }
    }
    // 当某个已经落焦点所在的Scope DOM被重新渲染了,系统会矫正再重新找一个落焦点
    if (direct === 'system' && _lastSearchYIndex !== -1 && currentMap.domList[_lastSearchYIndex]?.length > 0) {
        currentMap.domList[_lastSearchYIndex].forEach((ele) => {
            if (ele && (typeof ele.isConnected === 'undefined' || ele.isConnected)) ele.classList.remove('focus');
        });
    }
    if (lastValid && (currentMap.lastY !== -1 || currentMap.lastX !== -1) && direct !== 'system') {
        const lastRowRef = currentMap.domList[_lastSearchYIndex];
        const isLastNeedRemember = lastRowRef?.[0]?.parentNode?.classList?.value?.indexOf('remembered') !== -1;
        if (lastRowRef[currentMap.lastX - 1]) lastRowRef[currentMap.lastX - 1].classList.remove('focus');
        if (isLastNeedRemember && _searchYIndex === _lastSearchYIndex && lastRowRef[currentMap.lastX - 1]) {
            lastRowRef[currentMap.lastX - 1].classList.remove('selected');
        }
    }
    // 添加新的焦点（点击时优先用传入的 focusTargetNode，避免异步渲染后 domList 与真实 DOM 不一致）
    const focusNode = focusTargetNode || currentMap.domList[_searchYIndex][currentMap.currentX - 1];
    if (focusNode && (typeof focusNode.isConnected === 'undefined' || focusNode.isConnected)) {
        focusNode.classList.add('focus');
    }
    // 焦点有变化默认回调
    if (currentMap?.callBackFn?.cbFocusChange && (typeof currentMap?.callBackFn?.cbFocusChange === 'function')) {
        const yIndex = currentMap?.stepList.indexOf(currentMap.currentY);
        const xIndex = currentMap.currentX - 1;
        const currentDom = focusTargetNode || currentMap?.domList?.[yIndex]?.[xIndex];
        const currentData = currentMap?.dataList?.[yIndex]?.[xIndex] ?? null;
        const cbData = {
            locationName: currentDom?.attributes?.locationname?.value || '',
            currentY: currentMap.currentY,
            currentX: currentMap.currentX,
            lastY: currentMap.lastY,
            lastX: currentMap.lastX,
            dataSource: currentData,
        };
        currentMap?.callBackFn?.cbFocusChange(cbData);
    }
};

export function LayerScoper() {
    let isInitFinish = false;

    // 多实例 ids（当前 LayerScoper 实例内共享，多实例切换依赖 controllerIds + wakeUpIndex）
    const controllerIds = [];

    // 当前唤醒实例
    let wakeUpIndex = 0;

    // update 防抖：同一 (id, needUpdateScoped) 在短时间内多次调用只执行最后一次，避免 DOM 未稳定时重复刷新
    const updateDebounceTimers = {};
    const UPDATE_DEBOUNCE_MS = 32;

    // 多实例存储（同一 LayerScoper 实例内共享；多实例切换依赖 controllerIds + wakeUpIndex）
    const controllerMaps = {
        // content: {
        //   domList: [],                  // domList[scopeIndex][xIndex] = DOM 节点
        //   dataList: [],                 // dataList[scopeIndex][xIndex] = 业务数据（由 binddata 解析，避免频繁 JSON.parse）
        //   stepList: [],                 // 所有 scope 的 Y 值（data-scoped）
        //   transitList: [],
        //   recordList: [],               // 带 remembered 的 scope 列表
        //   openBoundaryList: [],
        //   scrollzoneList: [],           // 带 scrollzone 的 scope 列表
        //   lastY: -1,
        //   lastX: -1,
        //   currentY: -1,
        //   currentX: -1,
        //   controllerId: 'content',      // 当前 map 对应的 layer id
        //   callBackFn: {},               // cbFocusChange / cbScrollzoneScroll / cbScopeSelectedChange 等
        //   selfDefinedCallBackFn: {},    // clickfocus / gobackspace 等自定义回调
        //   needScroll: false,            // 是否启用整页 map 滚动
        //   scrollDirection: '',          // map 滚动方向 horizontal / vertical
        //   scrollData: {                 // map 滚动时用到的尺寸缓存
        //     outerWidth: -1,
        //     outerHeight: -1,
        //     innerWidth: -1,
        //     innerHeight: -1,
        //   },
        //   programAutoScrollAction: null,// 程序性滚动时标记当前 scopeY，scroll 监听里用来忽略这次回调
        // },
        // dialog-content: {
        //   domList: [],
        //   dataList: [],
        //   stepList: [],
        //   transitList: [],
        //   recordList: [],
        //   openBoundaryList: [],
        //   scrollzoneList: [],
        //   lastY: -1,
        //   lastX: -1,
        //   currentY: -1,
        //   currentX: -1,
        //   controllerId: 'dialog-content',
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
        //   programAutoScrollAction: null,
        // },
    };

    /*
    改变当前焦点触发区块滚动 scoped-incontroll-scroll
    */
    this.currentScopeScroll = ({ currentMap, direct }) => {
        Loger.info(`currentScopeScroll direct: ${direct}`);
        const _id = controllerIds[wakeUpIndex];
        const scrollzoneIndex = currentMap.scrollzoneList && currentMap.scrollzoneList.indexOf(currentMap.currentY);
        if (scrollzoneIndex === -1 || scrollzoneIndex == null) {
            Loger.info('currentScopeScroll currentY not in scrollzoneList');
            return;
        }
        const scrollzoneDoms = document.getElementById(_id).querySelectorAll('.scrollzone');
        const outerDom = scrollzoneDoms[scrollzoneIndex];
        const innerDom = outerDom?.querySelector(':scope > .scoped-incontroll-scroll');
        if (!outerDom || !innerDom) {
            Loger.info('currentScopeScroll don\'t need to scopezone scroll');
            return;
        }
        const _currentScoped = {
            outerWidth: outerDom.offsetWidth,
            outerHeight: outerDom.offsetHeight,
            innerWidth: innerDom.scrollWidth || innerDom.clientWidth,
            innerHeight: innerDom.scrollHeight || innerDom.clientHeight,
        };
        const _yIdx = currentMap.stepList.indexOf(currentMap.currentY);
        const _row = currentMap.domList[_yIdx];
        const focusDom = _row?.[currentMap.currentX - 1];
        if (!focusDom || (typeof focusDom.isConnected === 'boolean' && !focusDom.isConnected)) return;
        currentMap.programAutoScrollAction = currentMap.currentY;
        // focusDom几何中点相对于父级左边和顶部的距离，实际屏幕显示的真实距离值
        const relativeFather = {
            focusCenterToFatherTop: focusDom.getBoundingClientRect().top - outerDom.getBoundingClientRect().top + (0.5 * focusDom.getBoundingClientRect().height),
            focusCenterToFatherLeft: focusDom.getBoundingClientRect().left - outerDom.getBoundingClientRect().left + (0.5 * focusDom.getBoundingClientRect().width),
        };
        // 竖向滚动，判断内层高度要大于外层高度
        if (_currentScoped.innerHeight > _currentScoped.outerHeight) {
            /*
            cha：表示目前获焦元素与滚动区中心的偏移量
            正数：获焦元素位于滚动区中心下面，需要向上滚
            负数：获焦元素位于滚动区中心上面，需要向下滚
            */
            const cha = relativeFather.focusCenterToFatherTop - (_currentScoped.outerHeight * 0.5 * ScrrenMultipler);
            const scrollVal = ((outerDom.scrollTop * ScrrenMultipler) + cha) / ScrrenMultipler;
            outerDom.scrollTo(0, scrollVal);
        }
        // 横向滚动，判断内层宽度要大于外层宽度（用 scrollWidth 兼容 inline-block 内容宽度）
        if (_currentScoped.innerWidth > _currentScoped.outerWidth) {
            /*
            cha：表示目前获焦元素与滚动区中心的偏移量
            正数：获焦元素位于滚动区中心右面，需要向左滚
            负数：获焦元素位于滚动区中心左面，需要向右滚
            */
            const cha = relativeFather.focusCenterToFatherLeft - (_currentScoped.outerWidth * 0.5 * ScrrenMultipler);
            const scrollVal = ((outerDom.scrollLeft * ScrrenMultipler) + cha) / ScrrenMultipler;
            outerDom.scrollTo(Math.max(0, Math.min(scrollVal, outerDom.scrollWidth - outerDom.clientWidth)), 0);
        }
        setTimeout(() => {
            currentMap.programAutoScrollAction = null;
        }, 200);
    };

    /*
    为 scoped-incontroll-scroll 元素初始化拖拽滚动功能
    支持鼠标和触摸拖拽
    */
    this.initDragScroll = (containerId) => {
        if (!containerId) {
            Loger.warn('initDragScroll: containerId is required');
            return;
        }
        const container = document.getElementById(containerId);
        if (!container) {
            Loger.warn(`initDragScroll: container with id "${containerId}" not found`);
            return;
        }

        // 查找所有 scoped-incontroll-scroll 元素
        const scrollElements = container.querySelectorAll('.scoped-incontroll-scroll');

        scrollElements.forEach((innerElement) => {
            // 找到父级 scrollzone 容器
            const outerElement = innerElement.closest('.scrollzone');
            if (!outerElement) {
                return;
            }

            // 检查是否已经初始化过（通过 data 属性标记）
            if (outerElement.dataset.dragScrollInitialized === 'true') {
                return;
            }

            let isDragging = false;
            let hasMoved = false;
            let startX = 0;
            let startY = 0;
            let scrollLeft = 0;
            let scrollTop = 0;
            const DRAG_THRESHOLD = 5; // 拖拽阈值，超过这个距离才认为是拖拽

            // 鼠标事件处理
            const handleMouseDown = (e) => {
                const target = e.target;
                if (target.closest('button, a')) {
                    return;
                }
                isDragging = true;
                hasMoved = false;
                startX = e.pageX - outerElement.offsetLeft;
                startY = e.pageY - outerElement.offsetTop;
                scrollLeft = outerElement.scrollLeft;
                scrollTop = outerElement.scrollTop;
            };

            const handleMouseMove = (e) => {
                if (!isDragging) return;
                const x = e.pageX - outerElement.offsetLeft;
                const y = e.pageY - outerElement.offsetTop;
                const walkX = (x - startX);
                const walkY = (y - startY);
                const distance = Math.sqrt(walkX * walkX + walkY * walkY);
                if (distance > DRAG_THRESHOLD) {
                    if (!hasMoved) {
                        hasMoved = true;
                        outerElement.style.userSelect = 'none';
                    }
                    e.preventDefault();
                    outerElement.scrollLeft = scrollLeft - walkX;
                    outerElement.scrollTop = scrollTop - walkY;
                }
            };

            const handleMouseUp = (e) => {
                if (isDragging && hasMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                isDragging = false;
                hasMoved = false;
                outerElement.style.userSelect = '';
            };

            const handleMouseLeave = (e) => {
                if (isDragging && hasMoved) {
                    e.preventDefault();
                }
                isDragging = false;
                hasMoved = false;
                outerElement.style.userSelect = '';
            };

            // 触摸事件处理
            let touchHasMoved = false;
            const handleTouchStart = (e) => {
                if (e.touches.length !== 1) return;
                const target = e.target;
                if (target.closest('button, a')) {
                    return;
                }
                isDragging = true;
                touchHasMoved = false;
                startX = e.touches[0].pageX - outerElement.offsetLeft;
                startY = e.touches[0].pageY - outerElement.offsetTop;
                scrollLeft = outerElement.scrollLeft;
                scrollTop = outerElement.scrollTop;
            };

            const handleTouchMove = (e) => {
                if (!isDragging || e.touches.length !== 1) return;
                const x = e.touches[0].pageX - outerElement.offsetLeft;
                const y = e.touches[0].pageY - outerElement.offsetTop;
                const walkX = (x - startX);
                const walkY = (y - startY);
                const distance = Math.sqrt(walkX * walkX + walkY * walkY);
                if (distance > DRAG_THRESHOLD) {
                    touchHasMoved = true;
                    e.preventDefault();
                    outerElement.scrollLeft = scrollLeft - walkX;
                    outerElement.scrollTop = scrollTop - walkY;
                }
            };

            const handleTouchEnd = (e) => {
                if (isDragging && touchHasMoved) {
                    e.preventDefault();
                }
                isDragging = false;
                touchHasMoved = false;
            };

            outerElement.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            outerElement.addEventListener('mouseleave', handleMouseLeave);
            outerElement.addEventListener('touchstart', handleTouchStart, { passive: false });
            outerElement.addEventListener('touchmove', handleTouchMove, { passive: false });
            outerElement.addEventListener('touchend', handleTouchEnd);
            outerElement.addEventListener('touchcancel', handleTouchEnd);
            outerElement.dataset.dragScrollInitialized = 'true';
            Loger.info(`initDragScroll: drag scroll initialized for element in container "${containerId}"`);
        });
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
        const _yIdxScroll = currentMap.stepList.indexOf(currentMap.currentY);
        const _rowScroll = currentMap.domList[_yIdxScroll];
        const focusDom = _rowScroll?.[currentMap.currentX - 1];
        if (!focusDom || (typeof focusDom.isConnected === 'boolean' && !focusDom.isConnected)) return;
        const relativeFather = {
            focusCenterToFatherTop: focusDom.getBoundingClientRect().top - outerDom.getBoundingClientRect().top + (0.5 * focusDom.getBoundingClientRect().height),
            focusCenterToFatherLeft: focusDom.getBoundingClientRect().left - outerDom.getBoundingClientRect().left + (0.5 * focusDom.getBoundingClientRect().width),
        };
        if (currentMap.scrollDirection === 'vertical' && (currentMap.scrollData.innerHeight > currentMap.scrollData.outerHeight)) {
            const cha = relativeFather.focusCenterToFatherTop - (currentMap.scrollData.outerHeight * 0.5 * ScrrenMultipler);
            const scrollVal = ((outerDom.scrollTop * ScrrenMultipler) + cha) / ScrrenMultipler;
            setTimeout(() => {
                outerDom.scrollTo(0, scrollVal);
            }, 10);
            return;
        }
        if (currentMap.scrollDirection === 'horizontal' && (currentMap.scrollData.innerWidth > currentMap.scrollData.outerWidth)) {
            const cha = relativeFather.focusCenterToFatherLeft - (currentMap.scrollData.outerWidth * 0.5 * ScrrenMultipler);
            const scrollVal = ((outerDom.scrollLeft * ScrrenMultipler) + cha) / ScrrenMultipler;
            setTimeout(() => {
                outerDom.scrollTo(scrollVal, 0);
            }, 10);
        }
    };

    this.onFocusDown = () => {
        const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
        if (!currentMap) return;
        if (!isFocusValid(currentMap)) {
            if (correctFocusToFirstValid(currentMap)) {
                changeCurrentFocus({ currentMap, direct: 'system' });
                this.currentScopeScroll({ currentMap, direct: 'system' });
                this.currentMapScroll();
            }
            return;
        }
        const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
        if (_target[0]?.attributes?.godown?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.godown?.value]) === 'function') {
            try {
                currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.godown?.value]({
                    locationName: _target[0].attributes?.locationname?.value || '',
                    currentY: currentMap.currentY,
                    currentX: currentMap.currentX,
                    lastY: currentMap.lastY,
                    lastX: currentMap.lastX,
                    dataSource: currentMap?.dataList?.[currentMap.stepList.indexOf(currentMap.currentY)]?.[currentMap.currentX - 1] ?? null,
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
                if (!ele || (typeof ele.isConnected !== 'undefined' && !ele.isConnected)) return;
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
            if (nearlyNextLine !== 0 && nearlyNextLine !== Infinity) {
                currentMap.lastY = currentMap.currentY;
                currentMap.lastX = currentMap.currentX;
                currentMap.currentX = flag + 1;
                Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
                changeCurrentFocus({ currentMap, direct: 'down' });
                this.currentScopeScroll({ currentMap, direct: 'down' });
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
            if (!ele || (typeof ele.isConnected !== 'undefined' && !ele.isConnected)) return;
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
        if (remembered !== -1) {
            currentMap.currentY = currentMap.stepList[_findNextIndex];
            currentMap.currentX = remembered + 1;
        } else {
            currentMap.currentY = currentMap.stepList[_findNextIndex];
            currentMap.currentX = flag + 1;
        }
        Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
        changeCurrentFocus({ currentMap, direct: 'down' });
        this.currentScopeScroll({ currentMap, direct: 'down' });
        this.currentMapScroll();
        runCallbackFn({ currentMap, direct: 'down', isBoundary: false, domEle: _target[0] });
    };

    this.onFocusUp = () => {
        const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
        if (!currentMap) return;
        if (!isFocusValid(currentMap)) {
            if (correctFocusToFirstValid(currentMap)) {
                changeCurrentFocus({ currentMap, direct: 'system' });
                this.currentScopeScroll({ currentMap, direct: 'system' });
                this.currentMapScroll();
            }
            return;
        }
        const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
        if (_target[0]?.attributes?.goup?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goup?.value]) === 'function') {
            try {
                currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goup?.value]({
                    locationName: _target[0].attributes?.locationname?.value || '',
                    currentY: currentMap.currentY,
                    currentX: currentMap.currentX,
                    lastY: currentMap.lastY,
                    lastX: currentMap.lastX,
                    dataSource: currentMap?.dataList?.[currentMap.stepList.indexOf(currentMap.currentY)]?.[currentMap.currentX - 1] ?? null,
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
                if (!ele || (typeof ele.isConnected !== 'undefined' && !ele.isConnected)) return;
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
            if (nearlyUpLine !== 0 && nearlyUpLine !== Infinity) {
                currentMap.lastY = currentMap.currentY;
                currentMap.lastX = currentMap.currentX;
                currentMap.currentX = flag + 1;
                Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
                changeCurrentFocus({ currentMap, direct: 'up' });
                this.currentScopeScroll({ currentMap, direct: 'up' });
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
            if (!ele || (typeof ele.isConnected !== 'undefined' && !ele.isConnected)) return;
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
        if (remembered !== -1) {
            currentMap.currentY = currentMap.stepList[_findNextIndex];
            currentMap.currentX = remembered + 1;
        } else {
            currentMap.currentY = currentMap.stepList[_findNextIndex];
            currentMap.currentX = flag + 1;
        }
        Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
        changeCurrentFocus({ currentMap, direct: 'up' });
        this.currentScopeScroll({ currentMap, direct: 'up' });
        this.currentMapScroll();
        runCallbackFn({ currentMap, direct: 'up', isBoundary: false, domEle: _target[0] });
    };

    this.onFocusLeft = () => {
        const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
        if (!currentMap) return;
        if (!isFocusValid(currentMap)) {
            if (correctFocusToFirstValid(currentMap)) {
                changeCurrentFocus({ currentMap, direct: 'system' });
                this.currentScopeScroll({ currentMap, direct: 'system' });
                this.currentMapScroll();
            }
            return;
        }
        const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
        if (_target[0]?.attributes?.goleft?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goleft?.value]) === 'function') {
            try {
                currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goleft?.value]({
                    locationName: _target[0].attributes?.locationname?.value || '',
                    currentY: currentMap.currentY,
                    currentX: currentMap.currentX,
                    lastY: currentMap.lastY,
                    lastX: currentMap.lastX,
                    dataSource: currentMap?.dataList?.[currentMap.stepList.indexOf(currentMap.currentY)]?.[currentMap.currentX - 1] ?? null,
                });
            } catch (e) {
                Loger.error(`goleft error ${e}`);
            }
            return;
        }
        Loger.info('dont find goleft or goleft is not a function, use default');
        const _currentYIndex = currentMap.stepList.indexOf(currentMap.currentY);
        const isOpenBoundary = currentMap.openBoundaryList.indexOf(currentMap.currentY) !== -1;
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
            currentMap.currentX = currentMap.domList[_findNextIndex].length;
            Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
            changeCurrentFocus({ currentMap, direct: 'left' });
            this.currentScopeScroll({ currentMap, direct: 'left' });
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
        changeCurrentFocus({ currentMap, direct: 'left' });
        this.currentScopeScroll({ currentMap, direct: 'left' });
        this.currentMapScroll();
        runCallbackFn({ currentMap, direct: 'left', isBoundary: false, domEle: _target[0] });
    };

    this.onFocusRight = () => {
        const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
        if (!currentMap) return;
        if (!isFocusValid(currentMap)) {
            if (correctFocusToFirstValid(currentMap)) {
                changeCurrentFocus({ currentMap, direct: 'system' });
                this.currentScopeScroll({ currentMap, direct: 'system' });
                this.currentMapScroll();
            }
            return;
        }
        const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
        if (_target[0]?.attributes?.goright?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goright?.value]) === 'function') {
            try {
                currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.goright?.value]({
                    locationName: _target[0].attributes?.locationname?.value || '',
                    currentY: currentMap.currentY,
                    currentX: currentMap.currentX,
                    lastY: currentMap.lastY,
                    lastX: currentMap.lastX,
                    dataSource: currentMap?.dataList?.[currentMap.stepList.indexOf(currentMap.currentY)]?.[currentMap.currentX - 1] ?? null,
                });
            } catch (e) {
                Loger.error(`goright error ${e}`);
            }
            return;
        }
        Loger.info('dont find goright or goright is not a function, use default');
        const _currentYIndex = currentMap.stepList.indexOf(currentMap.currentY);
        const isOpenBoundary = currentMap.openBoundaryList.indexOf(currentMap.currentY) !== -1;
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
            currentMap.currentX = 1;
            Loger.info(`currentY ${currentMap.currentY} currentX ${currentMap.currentX}`);
            changeCurrentFocus({ currentMap, direct: 'right' });
            this.currentScopeScroll({ currentMap, direct: 'right' });
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
        changeCurrentFocus({ currentMap, direct: 'right' });
        this.currentScopeScroll({ currentMap, direct: 'right' });
        this.currentMapScroll();
        runCallbackFn({ currentMap, direct: 'right', isBoundary: false, domEle: _target[0] });
    };

    this.onFocusKeyEnter = () => {
        try {
            const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
            if (!currentMap) return;
            if (!isFocusValid(currentMap)) {
                if (correctFocusToFirstValid(currentMap)) {
                    changeCurrentFocus({ currentMap, direct: 'system' });
                    this.currentScopeScroll({ currentMap, direct: 'system' });
                    this.currentMapScroll();
                }
                return;
            }
            const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
            if (!_target[0]) return;
            if (_target[0]?.attributes?.clickfocus?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.clickfocus?.value]) === 'function') {
                currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.clickfocus?.value]({
                    locationName: _target[0].attributes?.locationname?.value || '',
                    currentY: currentMap.currentY,
                    currentX: currentMap.currentX,
                    lastY: currentMap.lastY,
                    lastX: currentMap.lastX,
                    dataSource: currentMap?.dataList?.[currentMap.stepList.indexOf(currentMap.currentY)]?.[currentMap.currentX - 1] ?? null,
                });
            }
        } catch (e) {
            Loger.error('onFocusKeyEnter error');
        }
    };

    this.onFocusMouseClick = (domObj) => {
        const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
        const eventCurrentTarget = domObj?.currentTarget;
        if (!eventCurrentTarget) {
            return;
        }
        const _target = eventCurrentTarget;
        try {
            if (currentMap.currentY !== parseFloat(_target.attributes?.y.value) || currentMap.currentX !== parseFloat(_target.attributes?.x.value)) {
                currentMap.lastY = currentMap.currentY;
                currentMap.lastX = currentMap.currentX;
                currentMap.currentY = parseFloat(_target.attributes?.y.value);
                currentMap.currentX = parseFloat(_target.attributes?.x.value);
                changeCurrentFocus({ currentMap, direct: 'click', focusTargetNode: _target });
                this.currentScopeScroll({ currentMap, direct: 'click' });
                this.currentMapScroll();
            }
            if (_target?.attributes?.clickfocus?.value && (typeof currentMap?.selfDefinedCallBackFn[_target?.attributes?.clickfocus?.value]) === 'function') {
                currentMap?.selfDefinedCallBackFn[_target?.attributes?.clickfocus?.value]({
                    locationName: _target.attributes?.locationname?.value || '',
                    currentY: parseFloat(_target.attributes?.y.value),
                    currentX: parseFloat(_target.attributes?.x.value),
                    lastY: currentMap.lastY,
                    lastX: currentMap.lastX,
                    dataSource: currentMap?.dataList?.[currentMap.stepList.indexOf(parseFloat(_target?.attributes?.y?.value))]?.[parseFloat(_target?.attributes?.x?.value) - 1] ?? null,
                });
            }
        } catch (e) {
            Loger.error(`onFocusMouseClick error ${JSON.stringify(e)}`);
        }
    };

    this.onBackSpace = () => {
        const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
        if (!currentMap) return;
        if (!isFocusValid(currentMap)) {
            if (correctFocusToFirstValid(currentMap)) {
                changeCurrentFocus({ currentMap, direct: 'system' });
                this.currentScopeScroll({ currentMap, direct: 'system' });
                this.currentMapScroll();
            }
            return;
        }
        const _target = document.getElementById(controllerIds[wakeUpIndex]).getElementsByClassName('focus');
        if (!_target[0]) return;
        if (_target[0]?.attributes?.gobackspace?.value && (typeof currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.gobackspace?.value]) === 'function') {
            try {
                currentMap?.selfDefinedCallBackFn[_target[0]?.attributes?.gobackspace?.value]({
                    locationName: _target[0].attributes?.locationname?.value || '',
                    currentY: currentMap.currentY,
                    currentX: currentMap.currentX,
                    lastY: currentMap.lastY,
                    lastX: currentMap.lastX,
                    dataSource: currentMap?.dataList?.[currentMap.stepList.indexOf(currentMap.currentY)]?.[currentMap.currentX - 1] ?? null,
                });
            } catch (e) {
                Loger.error('gobackspace error');
            }
            return;
        }
        Loger.info('dont find gobackspace or gobackspace is not a function, use default');
        runCallbackFn({ currentMap, direct: 'backspace', isBoundary: false, domEle: _target[0] });
    };

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
        window.addEventListener('keydown', (e) => {
            const code = e.keyCode;
            if (
                code === KeyBoard_KeyCode.UP
                || code === RemoteControl_KeyCode.UP
                || code === KeyBoard_KeyCode.DOWN
                || code === RemoteControl_KeyCode.DOWN
                || code === KeyBoard_KeyCode.LEFT
                || code === RemoteControl_KeyCode.LEFT
                || code === KeyBoard_KeyCode.RIGHT
                || code === RemoteControl_KeyCode.RIGHT
                || code === KeyBoard_KeyCode.ENTER
                || code === RemoteControl_KeyCode.ENTER
                || code === KeyBoard_KeyCode.BACKSPACE
                || code === RemoteControl_KeyCode.BACKSPACE
                || code === KeyBoard_KeyCode.END
                || code === KeyBoard_KeyCode.ESC
            ) {
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
            }
            if ((code === KeyBoard_KeyCode.UP) || (code === RemoteControl_KeyCode.UP)) window.onKeyUp();
            if ((code === KeyBoard_KeyCode.DOWN) || (code === RemoteControl_KeyCode.DOWN)) window.onKeyDown();
            if ((code === KeyBoard_KeyCode.RIGHT) || (code === RemoteControl_KeyCode.RIGHT)) window.onKeyRight();
            if ((code === KeyBoard_KeyCode.LEFT) || (code === RemoteControl_KeyCode.LEFT)) window.onKeyLeft();
            if ((code === KeyBoard_KeyCode.ENTER) || (code === RemoteControl_KeyCode.ENTER)) window.onKeyEnter();
            if ((code === KeyBoard_KeyCode.BACKSPACE) || (code === RemoteControl_KeyCode.BACKSPACE)) window.onDismissDialog();
            if ((code === KeyBoard_KeyCode.END) || (code === KeyBoard_KeyCode.ESC)) window.onDismissDialog();
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
        controllerMaps[params.id].needScroll = params?.needScroll || false;
        if (controllerMaps[params.id].needScroll && !controllerMaps[params.id].scrollData) {
            controllerMaps[params.id].scrollDirection = params.scrollDirection;
            controllerMaps[params.id].scrollData = {
                outerWidth: -1,
                outerHeight: -1,
                innerWidth: -1,
                innerHeight: -1,
            };
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
            const innerDom = outerDom.querySelector(':scope > .map-incontroll-scroll');
            if ((controllerMaps[params.id].scrollDirection === 'horizontal') && innerDom) {
                innerDom.style.display = 'inline-block';
                innerDom.style.width = 'auto';
            } else if ((controllerMaps[params.id].scrollDirection === 'vertical') && innerDom) {
                Loger.info('addNewLevelData: scrollDirection is vertical');
            } else {
                Loger.error(`addNewLevelData: "className .map-incontroll-scroll" must at first level childNode for the parent id=${params.id}`);
                delete controllerMaps[params.id];
                controllerIds.splice(creatIndex, 1);
                throw new Error(`addNewLevelData: "className .map-incontroll-scroll" must at first level childNode for the parent id=${params.id}`);
            }
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
        try {
            _scopedList.sort(scopedCompare());
        } catch (e) {
            delete controllerMaps[params.id];
            controllerIds.splice(creatIndex, 1);
            throw e;
        }
        controllerMaps[controllerIds[creatIndex]].domList = [];
        // 与 domList 结构一致，用于按 (scopeIndex, xIndex) 存放业务数据，避免频繁从 DOM 的 binddata 解析
        controllerMaps[controllerIds[creatIndex]].dataList = [];
        controllerMaps[controllerIds[creatIndex]].stepList = [];
        controllerMaps[controllerIds[creatIndex]].transitList = [];
        controllerMaps[controllerIds[creatIndex]].recordList = [];
        controllerMaps[controllerIds[creatIndex]].openBoundaryList = [];
        controllerMaps[controllerIds[creatIndex]].scrollzoneList = [];

        _scopedList.forEach((ele) => {
            if (ele.querySelectorAll('.incontroll').length > 0) {
                controllerMaps[controllerIds[creatIndex]].domList.push([]);
                controllerMaps[controllerIds[creatIndex]].dataList.push([]);
                controllerMaps[controllerIds[creatIndex]].stepList.push(parseFloat(ele.attributes['data-scoped'].value));
                if (ele.classList.value.indexOf('transit') !== -1) {
                    controllerMaps[controllerIds[creatIndex]].transitList.push(parseFloat(ele.attributes['data-scoped'].value));
                }
                if (ele.classList.value.indexOf('remembered') !== -1) {
                    controllerMaps[controllerIds[creatIndex]].recordList.push(parseFloat(ele.attributes['data-scoped'].value));
                }
                if (ele.classList.value.indexOf('openboundary') !== -1) {
                    controllerMaps[controllerIds[creatIndex]].openBoundaryList.push(parseFloat(ele.attributes['data-scoped'].value));
                }
                if (ele.classList.value.indexOf('scrollzone') !== -1) {
                    controllerMaps[controllerIds[creatIndex]].scrollzoneList.push(parseFloat(ele.attributes['data-scoped'].value));
                }
                ele.querySelectorAll('.incontroll').forEach((ele2, index2) => {
                    ele2.setAttribute('locationname', `ln_${(ele.attributes['data-scoped'].value).toString()}_${(index2 + 1).toString()}`);
                    ele2.setAttribute('y', parseFloat(ele.attributes['data-scoped'].value));
                    ele2.setAttribute('x', index2 + 1);
                    ele2.removeEventListener('click', this.onFocusMouseClick);
                    ele2.addEventListener('click', this.onFocusMouseClick);
                    const lastIndex = controllerMaps[controllerIds[creatIndex]].domList.length - 1;
                    controllerMaps[controllerIds[creatIndex]].domList[lastIndex].push(ele2);
                    // 初始化 dataList：只解析一次 binddata，后续从 dataList 读取，避免频繁 JSON.parse
                    controllerMaps[controllerIds[creatIndex]].dataList[lastIndex].push(
                        backToData(ele2.attributes?.binddata?.value),
                    );
                    // 业务数据已写入 dataList，可从真实 DOM 上移除 binddata 减少渲染负担
                    ele2.removeAttribute('binddata');
                });
            }
        });
        Loger.info(`addNewLevelData stepList: ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].stepList)}`);
        Loger.info(`addNewLevelData transitList: ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].transitList)}`);
        Loger.info(`addNewLevelData recordList: ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].recordList)}`);
        Loger.info(`addNewLevelData openBoundaryList: ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].openBoundaryList)}`);
        Loger.info(`addNewLevelData scrollzoneList: ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].scrollzoneList)}`);
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
            Loger.error(`addNewLevelData default focus y: ${params.defaultPoint.y} x: ${params.defaultPoint.x} is not exist`);
            delete controllerMaps[params.id];
            controllerIds.splice(creatIndex, 1);
            Loger.error('addNewLevelData controller fali to add new level case');
            return;
        }
        controllerMaps[controllerIds[creatIndex]].controllerId = params.id;
        if (params?.callBackFn) {
            controllerMaps[controllerIds[creatIndex]].callBackFn = Object.assign({}, params?.callBackFn);
        }
        if (params?.selfDefinedCallBackFn) {
            controllerMaps[controllerIds[creatIndex]].selfDefinedCallBackFn = Object.assign({}, params?.selfDefinedCallBackFn);
        }
        // 为每个 scrollzone 绑定 scroll 监听，触发时回调 cbScrollzoneScroll（程序性滚动如 scopeSelectedItemScrollToMiddle 触发的 scroll 不回调，避免连锁触发 rollingScopeSelectedItemClosestToCenter）
        const container = document.getElementById(params.id);
        if (container && controllerMaps[controllerIds[creatIndex]].callBackFn?.cbScrollzoneScroll) {
            const mapRef = controllerMaps[controllerIds[creatIndex]];
            container.querySelectorAll('.scrollzone').forEach((zone) => {
                if (zone.dataset.scrollzoneScrollBound === 'true') return;
                const targetY = parseFloat(zone.getAttribute('data-scoped'));
                zone.addEventListener('scroll', () => {
                    if (mapRef.programAutoScrollAction === targetY) {
                        mapRef.programAutoScrollAction = null;
                        return;
                    }
                    mapRef.callBackFn.cbScrollzoneScroll({
                        id: params.id,
                        targetY: Number.isFinite(targetY) ? targetY : undefined,
                        scrollTop: zone.scrollTop,
                        scrollLeft: zone.scrollLeft,
                    });
                });
                zone.dataset.scrollzoneScrollBound = 'true';
            });
        }
        Loger.info(`addNewLevelData controller add new level case success ${JSON.stringify(controllerMaps[controllerIds[creatIndex]].stepList)} currentY ${controllerMaps[controllerIds[creatIndex]].currentY} currentX ${controllerMaps[controllerIds[creatIndex]].currentX}`);
    };

    /*
    初始化实例
    */
    this.initController = (params) => {
        Loger.warn('layer-scoper @1.0.4');
        const safeParams = {
            id: params.id,
            className: params.className,
            defaultPoint: params.defaultPoint,
            needScroll: params.needScroll,
            scrollDirection: params.scrollDirection,
            cssUsedScrrenMultipler: params.cssUsedScrrenMultipler,
            screenMultiplerValue: params.screenMultiplerValue,
            scrollBarConfig: params.scrollBarConfig,
            openAnimate: params.openAnimate,
        };
        Loger.info(`initController: params = ${JSON.stringify(safeParams)}`);
        if (isInitFinish) {
            return;
        }
        if (!params.id || !params.className || !params.defaultPoint.x || !params.defaultPoint.y) {
            Loger.error('initController: missing necessary init params');
            return;
        }
        if (params?.cssUsedScrrenMultipler && params?.screenMultiplerValue) {
            if (typeof params?.screenMultiplerValue !== 'number' || !Number.isFinite(params?.screenMultiplerValue) || params?.screenMultiplerValue <= 0) {
                Loger.error('if cssUsedScrrenMultipler = true , setScreenMultiplier expects a number/float value > 0');
                return;
            }
            setScreenMultiplier(params?.screenMultiplerValue);
        }
        if (params?.needScroll && !(params?.scrollDirection === 'horizontal' || params?.scrollDirection === 'vertical')) {
            Loger.error('addNewLevelData: value of scrollDirection must use horizontal/vertical');
            return;
        }
        if (params?.openAnimate || false) {
            Loger.info('openAnimate');
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
        wakeUpIndex = 0;
        changeCurrentFocus({ currentMap: controllerMaps[controllerIds[wakeUpIndex]] });
        this.keyEventInstall();
        this.initDragScroll(params.id);
        isInitFinish = true;
        const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
        const safeMap = {
            stepList: currentMap.stepList,
            transitList: currentMap.transitList,
            recordList: currentMap.recordList,
            openBoundaryList: currentMap.openBoundaryList,
            scrollzoneList: currentMap.scrollzoneList,
            lastY: currentMap.lastY,
            lastX: currentMap.lastX,
            currentY: currentMap.currentY,
            currentX: currentMap.currentX,
            needScroll: currentMap.needScroll,
            scrollDirection: currentMap.scrollDirection,
        };
        Loger.info(`initController init finish  ${JSON.stringify(safeMap)}`);
    };

    /*
    添加新的DOM层级，但是焦点移动需要手动触发，原因如下：
    1. 新的层级在页面创建时就实例化好了但是并不想立刻展示并且落焦，后续手动打开，比如侧浮层或者弹框
    2. 手动触发的好处是能让业务层开发者明确知道自己在干什么
    */
    this.addNewLayer = (params) => {
        if (!isInitFinish) {
            return;
        }
        if (!params.id || !params.className || !params.defaultPoint.x || !params.defaultPoint.y) {
            Loger.error('init error: missing necessary add params');
            return;
        }
        this.addNewLevelData(params);
        this.initDragScroll(params.id);
    };

    /*
    更新某个实例层级下的数据（带防抖，同一 scope 短时间多次调用只执行最后一次）
    调用时机：必须在 DOM 已更新后调用——例如 setState/异步列表加载完成后、或 React 的 useEffect 依赖列表变化后。
    若在数据已变更但 DOM 尚未渲染完成时调用，会采集到旧 DOM，导致 domList/dataList 与界面不一致。
    列表异步渲染后务必先调用 update 再落焦（goToFocus/wakeUp），否则可能报错或焦点落到错误节点。
    id: 实例id
    needUpdateScoped: 要更新的 scoped 区块
    */
    const doUpdatePayload = (id, needUpdateScoped) => {
        Loger.info(`updateData: needUpdateScoped：${needUpdateScoped}`);
        if (!isInitFinish || controllerIds.indexOf(id) === -1) {
            Loger.warn(`updateData: don't init finished or ${id} is not exist`);
            return;
        }
        const container = document.getElementById(id);
        if (!container) {
            Loger.warn(`updateData: container id=${id} not found`);
            return;
        }
        const _scopedList = Array.prototype.slice.call(container.getElementsByClassName('scoped'));
        const updateIndex = controllerMaps[id].stepList.indexOf(needUpdateScoped);
        const _updateDomList = [];
        const _updateDataList = [];
        let _matchScopedValue = false;
        let _needRecord = false;
        let _needTransit = false;
        let _needOpenBoundary = false;
        let _needScrollzone = false;

        _scopedList.forEach((ele) => {
            if (ele.attributes['data-scoped'].value === needUpdateScoped.toString()) {
                _matchScopedValue = true;
                if (ele.classList.value.indexOf('remembered') !== -1) _needRecord = true;
                if (ele.classList.value.indexOf('transit') !== -1) _needTransit = true;
                if (ele.classList.value.indexOf('openboundary') !== -1) _needOpenBoundary = true;
                if (ele.classList.value.indexOf('scrollzone') !== -1) _needScrollzone = true;
                if (ele.querySelectorAll('.incontroll').length > 0) {
                    ele.querySelectorAll('.incontroll').forEach((ele2, index2) => {
                        ele2.setAttribute('locationname', `ln_${needUpdateScoped.toString()}_${(index2 + 1).toString()}`);
                        ele2.setAttribute('y', needUpdateScoped);
                        ele2.setAttribute('x', index2 + 1);
                        ele2.removeEventListener('click', this.onFocusMouseClick);
                        ele2.addEventListener('click', this.onFocusMouseClick);
                        _updateDomList.push(ele2);
                        _updateDataList.push(backToData(ele2.attributes?.binddata?.value));
                        ele2.removeAttribute('binddata');
                    });
                }
            }
        });

        if (_matchScopedValue === false) {
            Loger.error(`update dont find this dom level point id ${id} needUpdateScoped ${needUpdateScoped}`);
            return;
        }

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
            if (needUpdateScoped === controllerMaps[id].stepList[0]) {
                controllerMaps[id].domList.unshift(_updateDomList);
                controllerMaps[id].dataList.unshift(_updateDataList);
            } else if (needUpdateScoped === controllerMaps[id].stepList[controllerMaps[id].stepList.length - 1]) {
                controllerMaps[id].domList.push(_updateDomList);
                controllerMaps[id].dataList.push(_updateDataList);
            } else {
                const insertIndex = controllerMaps[id].stepList.indexOf(needUpdateScoped);
                controllerMaps[id].domList.splice(insertIndex, 0, _updateDomList);
                controllerMaps[id].dataList.splice(insertIndex, 0, _updateDataList);
            }
        } else {
            const scopedIndex = controllerMaps[id].stepList.indexOf(needUpdateScoped);
            controllerMaps[id].domList[scopedIndex] = _updateDomList;
            controllerMaps[id].dataList[scopedIndex] = _updateDataList;
            if (controllerIds[wakeUpIndex] === id && controllerMaps[id].currentY !== needUpdateScoped) {
                this.initDragScroll(id);
                return;
            }
            if (controllerMaps[id].domList[controllerMaps[id].stepList.indexOf(needUpdateScoped)].length === 0) {
                let _systemFindtIndexY = -1;
                controllerMaps[id].domList.forEach((ele, index) => {
                    if (ele.length > 0 && _systemFindtIndexY === -1) _systemFindtIndexY = index;
                });
                controllerMaps[id].lastY = controllerMaps[id].currentY;
                controllerMaps[id].lastX = controllerMaps[id].currentX;
                controllerMaps[id].currentY = controllerMaps[id].stepList[_systemFindtIndexY];
                controllerMaps[id].currentX = 1;
            } else {
                controllerMaps[id].lastY = controllerMaps[id].currentY;
                controllerMaps[id].lastX = controllerMaps[id].currentX;
                controllerMaps[id].currentY = needUpdateScoped;
                controllerMaps[id].currentX = 1;
            }
            if (controllerIds[wakeUpIndex] === id) {
                changeCurrentFocus({ currentMap: controllerMaps[id], direct: 'system' });
                this.currentScopeScroll({ currentMap: controllerMaps[id], direct: 'system' });
                this.currentMapScroll();
                runCallbackFn({ currentMap: controllerMaps[id], direct: 'system', isBoundary: false });
            }
        }
        this.initDragScroll(id);
    };

    this.update = ({ id, needUpdateScoped }) => {
        if (!id || needUpdateScoped == null) {
            Loger.warn('update: id and needUpdateScoped are required');
            return;
        }
        const key = `${id}_${needUpdateScoped}`;
        if (updateDebounceTimers[key]) {
            clearTimeout(updateDebounceTimers[key]);
        }
        updateDebounceTimers[key] = setTimeout(() => {
            delete updateDebounceTimers[key];
            doUpdatePayload(id, needUpdateScoped);
        }, UPDATE_DEBOUNCE_MS);
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
            Loger.error('wakeUp id is not exist');
            return;
        }
        const _next = controllerMaps[controllerIds[controllerIds.indexOf(id)]];
        const _targetY = targetY || _next.currentY;
        const _targetX = targetX || _next.currentX;
        Loger.info(`wakeUp _next ${controllerIds[controllerIds.indexOf(id)]}, _targetY: ${_targetY} _targetX: ${_targetX}`);
        const _currentNewYIndex = _next.stepList.indexOf(_targetY);
        const targetRow = _next.domList[_currentNewYIndex];
        const targetFocusNode = targetRow?.[_targetX - 1];
        const targetValid = _currentNewYIndex >= 0 && targetFocusNode
            && (typeof targetFocusNode.isConnected === 'undefined' || targetFocusNode.isConnected);
        if (targetValid) {
            const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
            const _currentYIndex = currentMap.stepList.indexOf(currentMap.currentY);
            const currentRow = currentMap.domList[_currentYIndex];
            if (currentRow && currentRow[currentMap.currentX - 1]) {
                currentRow[currentMap.currentX - 1].classList.remove('focus');
            }
            wakeUpIndex = controllerIds.indexOf(id);
            const nextMap = controllerMaps[controllerIds[wakeUpIndex]];
            nextMap.domList[_currentNewYIndex][_targetX - 1].classList.add('focus');
            nextMap.lastY = nextMap.currentY;
            nextMap.lastX = nextMap.currentX;
            nextMap.currentY = _targetY;
            nextMap.currentX = _targetX;
            setTimeout(() => {
                this.currentScopeScroll({ currentMap: nextMap, direct: 'system' });
                this.currentMapScroll();
            }, 0);
            const cbData = {
                locationName: nextMap?.domList[nextMap?.stepList.indexOf(nextMap.currentY)][nextMap.currentX - 1].attributes?.locationname?.value || '',
                currentY: nextMap.currentY,
                currentX: nextMap.currentX,
                lastY: nextMap.lastY,
                lastX: nextMap.lastX,
                dataSource: nextMap?.dataList?.[nextMap?.stepList.indexOf(nextMap.currentY)]?.[nextMap.currentX - 1] ?? null,
            };
            nextMap?.callBackFn?.cbFocusChange && nextMap?.callBackFn?.cbFocusChange(cbData);
        } else {
            Loger.error(`wakeUp targetY: ${_targetY} targetX: ${_targetX} is not exist or node not in document in id: ${id}, ensure update() was called after DOM ready`);
        }
    };

    /*
    将焦点移动到指定 (targetY, targetX)。列表异步渲染后务必先调用 update() 再调用 goToFocus，否则 domList 可能与 DOM 不一致导致落焦失败或落到错误节点。
    */
    this.goToFocus = (params) => {
        Loger.info(`gotoFocus params:, ${JSON.stringify(params)}`);
        if (!params?.targetY || !params?.targetX || typeof params.targetY !== 'number' || typeof params.targetX !== 'number') {
            Loger.error('params:targetY/targetX is necessary and dataType use Number');
            return;
        }
        const currentMap = controllerMaps[controllerIds[wakeUpIndex]];
        if (!currentMap) {
            Loger.error('goToFocus: no current controller');
            return;
        }
        const yIdx = currentMap.stepList.indexOf(params.targetY);
        if (yIdx === -1) {
            Loger.error('this point targetY is not exist in current level case');
            return;
        }
        const row = currentMap.domList[yIdx];
        const targetNode = row?.[params.targetX - 1];
        if (!targetNode) {
            Loger.error('this point targetX is not exist in current level case');
            return;
        }
        if (typeof targetNode.isConnected === 'boolean' && !targetNode.isConnected) {
            Loger.warn('goToFocus: target node is not in document, call update() after DOM is ready');
            return;
        }
        currentMap.lastY = currentMap.currentY;
        currentMap.lastX = currentMap.currentX;
        currentMap.currentY = params.targetY;
        currentMap.currentX = params.targetX;
        changeCurrentFocus({ currentMap, direct: 'handler' });
        this.currentScopeScroll({ currentMap, direct: 'handler' });
        this.currentMapScroll();
        runCallbackFn({ currentMap, direct: 'handler', isBoundary: false });
    };

    this.setScopeSelectedItem = (obj) => {
        if (!obj.id || !obj.targetY || !obj.targetX || typeof (obj.targetY) !== 'number' || typeof (obj.targetX) !== 'number') {
            Loger.error('setScopeSelectedItem: missing necessary parameter of id[String]/targetY[Number]/targetX[Number]');
            return;
        }
        if (!controllerMaps[obj.id]) {
            Loger.error(`setScopeSelectedItem: controllerMap-${obj.id} is not exist`);
            return;
        }
        const _needChangedMap = controllerMaps[controllerIds[controllerIds.indexOf(obj.id)]];
        if (_needChangedMap && _needChangedMap?.recordList.indexOf(obj.targetY) === -1) {
            Loger.error(`setScopeSelectedItem: scoped-${obj.targetY} is not exist`);
            return;
        }
        const _needScopedIndex = _needChangedMap.stepList.indexOf(obj.targetY);
        const _row = _needChangedMap.domList?.[_needScopedIndex];
        const _targetNode = _row?.[obj.targetX - 1];
        const _targetValid = _needScopedIndex !== -1 && _row && _targetNode
            && (typeof _targetNode.isConnected === 'undefined' || _targetNode.isConnected)
            && parseFloat(_targetNode.attributes?.x?.value) === obj.targetX;
        if (_targetValid) {
            if (_needChangedMap?.recordList.indexOf(obj.targetY) !== -1) {
                _needChangedMap.domList[_needScopedIndex].forEach((ele) => {
                    if (!ele || (typeof ele.isConnected !== 'undefined' && !ele.isConnected)) return;
                    ele.classList.remove('selected');
                    if (parseFloat(ele.attributes?.x?.value) === obj.targetX) {
                        ele.classList.add('selected');
                    }
                });
                const selectedEle = _needChangedMap.domList[_needScopedIndex][obj.targetX - 1];
                const selectedData = _needChangedMap.dataList?.[_needScopedIndex]?.[obj.targetX - 1] ?? null;
                if (_needChangedMap?.callBackFn?.cbScopeSelectedChange && typeof _needChangedMap.callBackFn.cbScopeSelectedChange === 'function') {
                    _needChangedMap.callBackFn.cbScopeSelectedChange({
                        id: obj.id,
                        targetY: obj.targetY,
                        targetX: obj.targetX,
                        locationName: selectedEle?.attributes?.locationname?.value || '',
                        dataSource: selectedData,
                    });
                }
            } else {
                Loger.error(`setScopeSelectedItem: scoped-${obj.targetY} is not set remembered`);
            }
        } else if (!_row || _needScopedIndex === -1) {
            Loger.error(`setScopeSelectedItem: scoped-${obj.targetY}-${obj.targetX} row or index not exist`);
        } else {
            Loger.error(`setScopeSelectedItem: scoped-${obj.targetY}-${obj.targetX} is not exist or node not in document`);
        }
    };

    /**
     * 滚动停止后：找距离滚动区可视中心最近的 .incontroll，设为 selected 选中态（仅对 remembered 的 scope 生效）
     * 内置 150ms 防抖，连续滚动时只在停止后执行一次；同时将 focus 同步到同一项
     * @param {Object} obj - { id: string, targetY: number }
     */
    this.rollingScopeSelectedItemClosestToCenter = (() => {
        const self = this;
        const DEBOUNCE_MS = 150;
        let timer = null;
        let lastArgs = null;
        const run = (obj) => {
            if (!obj.id || !obj.targetY || typeof (obj.targetY) !== 'number') {
                Loger.error('rollingScopeSelectedItemClosestToCenter: missing necessary parameter of id[String]/targetY[Number]');
                return;
            }
            if (!controllerMaps[obj.id]) {
                Loger.error(`rollingScopeSelectedItemClosestToCenter: controllerMap-${obj.id} is not exist`);
                return;
            }
            const currentMap = controllerMaps[controllerIds[controllerIds.indexOf(obj.id)]];
            const scrollzoneIndex = currentMap.scrollzoneList && currentMap.scrollzoneList.indexOf(obj.targetY);
            if (scrollzoneIndex === -1 || scrollzoneIndex == null) {
                Loger.info('rollingScopeSelectedItemClosestToCenter: targetY not in scrollzoneList');
                return;
            }
            const scrollzoneDoms = document.getElementById(obj.id).querySelectorAll('.scrollzone');
            const outerDom = scrollzoneDoms[scrollzoneIndex];
            const innerDom = outerDom?.querySelector(':scope > .scoped-incontroll-scroll');
            if (!outerDom || !innerDom) {
                Loger.info('rollingScopeSelectedItemClosestToCenter: no scrollzone or inner scroll');
                return;
            }
            const items = innerDom.querySelectorAll('.incontroll');
            if (!items.length) return;
            const zoneRect = outerDom.getBoundingClientRect();
            const centerX = zoneRect.left + zoneRect.width / 2;
            const centerY = zoneRect.top + zoneRect.height / 2;
            let closest = null;
            for (let i = 0; i < items.length; i += 1) {
                const rect = items[i].getBoundingClientRect();
                if (centerX >= rect.left && centerX <= rect.right && centerY >= rect.top && centerY <= rect.bottom) {
                    closest = items[i];
                    break;
                }
            }
            if (!closest) {
                let minDist = Infinity;
                for (let i = 0; i < items.length; i += 1) {
                    const rect = items[i].getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dist = (centerX - cx) * (centerX - cx) + (centerY - cy) * (centerY - cy);
                    if (dist < minDist) {
                        minDist = dist;
                        closest = items[i];
                    }
                }
            }
            if (!closest) return;
            const targetX = parseFloat(closest.getAttribute('x'));
            if (!Number.isFinite(targetX)) return;
            self.setScopeSelectedItem({ id: obj.id, targetY: obj.targetY, targetX });
            if (controllerIds[wakeUpIndex] === obj.id) {
                self.goToFocus({ targetY: obj.targetY, targetX, skipScopeScroll: true });
            }
        };
        return function rollingScopeSelectedItemClosestToCenterDebounced(obj) {
            lastArgs = obj;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                run(lastArgs);
                timer = null;
            }, DEBOUNCE_MS);
        };
    })();

    /**
     * 将指定 scope 下 “选中项” 滚动到可视区域中间（不改变焦点，因为焦点可能在别的 scope 下）
     * 根据 DOM 中 .incontroll.selected 实时查找选中项，无需传 targetX
     * @param {Object} obj - { id: string, targetY: number }
     */
    this.scopeSelectedItemScrollToMiddle = (obj) => {
        Loger.info(`scopeSelectedItemScrollToMiddle obj: ${JSON.stringify(obj)}`);
        if (!obj.id || !obj.targetY || typeof (obj.targetY) !== 'number') {
            Loger.error('scopeSelectedItemScrollToMiddle: missing necessary parameter of id[String]/targetY[Number]');
            return;
        }
        if (!controllerMaps[obj.id]) {
            Loger.error(`scopeSelectedItemScrollToMiddle: controllerMap-${obj.id} is not exist`);
            return;
        }
        const currentMap = controllerMaps[controllerIds[controllerIds.indexOf(obj.id)]];
        const scrollzoneIndex = currentMap.scrollzoneList && currentMap.scrollzoneList.indexOf(obj.targetY);
        if (scrollzoneIndex === -1 || scrollzoneIndex == null) {
            Loger.info('scopeSelectedItemScrollToMiddle: targetY not in scrollzoneList');
            return;
        }
        const scrollzoneDoms = document.getElementById(obj.id).querySelectorAll('.scrollzone');
        const outerDom = scrollzoneDoms[scrollzoneIndex];
        const innerDom = outerDom?.querySelector(':scope > .scoped-incontroll-scroll');
        if (!outerDom || !innerDom) {
            Loger.info('scopeSelectedItemScrollToMiddle: no scrollzone or inner scroll');
            return;
        }
        // 根据 DOM 中 incontroll + selected 实时查找选中项，不依赖 targetX 入参
        const selectedDom = innerDom.querySelector('.incontroll.selected');
        if (!selectedDom) {
            Loger.info('scopeSelectedItemScrollToMiddle: selected item dom not exist (no .incontroll.selected in this scope)');
            return;
        }
        const _currentScoped = {
            outerWidth: outerDom.offsetWidth,
            outerHeight: outerDom.offsetHeight,
            innerWidth: innerDom.scrollWidth || innerDom.clientWidth,
            innerHeight: innerDom.scrollHeight || innerDom.clientHeight,
        };
        const relativeFather = {
            focusCenterToFatherTop: selectedDom.getBoundingClientRect().top - outerDom.getBoundingClientRect().top + (0.5 * selectedDom.getBoundingClientRect().height),
            focusCenterToFatherLeft: selectedDom.getBoundingClientRect().left - outerDom.getBoundingClientRect().left + (0.5 * selectedDom.getBoundingClientRect().width),
        };
        currentMap.programAutoScrollAction = obj.targetY;
        if (_currentScoped.innerHeight > _currentScoped.outerHeight) {
            const cha = relativeFather.focusCenterToFatherTop - (_currentScoped.outerHeight * 0.5 * ScrrenMultipler);
            const scrollVal = ((outerDom.scrollTop * ScrrenMultipler) + cha) / ScrrenMultipler;
            outerDom.scrollTo(0, scrollVal);
        }
        if (_currentScoped.innerWidth > _currentScoped.outerWidth) {
            const cha = relativeFather.focusCenterToFatherLeft - (_currentScoped.outerWidth * 0.5 * ScrrenMultipler);
            const scrollVal = ((outerDom.scrollLeft * ScrrenMultipler) + cha) / ScrrenMultipler;
            outerDom.scrollTo(Math.max(0, Math.min(scrollVal, outerDom.scrollWidth - outerDom.clientWidth)), 0);
        }
        setTimeout(() => {
            currentMap.programAutoScrollAction = null;
        }, 200);
    };

    /**
     * 获取当前激活图层中，指定 scope（targetY）下的“选中态”（selected）信息
     * 注意：只根据 domList 中带有 selected class 的元素来判断
     * @param {Object} obj - { id: string, targetY: number }
     * @returns {Object|null} { id, targetY, targetX, locationName, dataSource } 或 null
     */
    this.getScopeSelectedInfo = (obj) => {
        if (!obj.id || !obj.targetY || typeof (obj.targetY) !== 'number') {
            Loger.error('getScopeSelectedInfo: missing necessary parameter of id[String]/targetY[Number]');
            return null;
        }
        if (!controllerMaps[obj.id]) {
            Loger.error(`getScopeSelectedInfo: controllerMap-${obj.id} is not exist`);
            return null;
        }
        const currentMap = controllerMaps[controllerIds[controllerIds.indexOf(obj.id)]];
        const scopedIndex = currentMap.stepList.indexOf(obj.targetY);
        if (scopedIndex === -1) {
            Loger.info(`getScopeSelectedInfo: targetY ${obj.targetY} not in stepList`);
            return null;
        }
        const row = currentMap.domList[scopedIndex] || [];
        let selectedDom = null;
        let targetX = -1;
        row.forEach((ele, idx) => {
            if (ele.classList?.contains('selected')) {
                selectedDom = ele;
                targetX = idx + 1;
            }
        });
        if (!selectedDom || targetX === -1) {
            Loger.info(`getScopeSelectedInfo: no selected item in scope ${obj.targetY}`);
            return null;
        }
        const locationName = selectedDom.attributes?.locationname?.value || '';
        const dataSource = currentMap.dataList?.[scopedIndex]?.[targetX - 1] ?? null;
        return {
            id: obj.id,
            targetY: obj.targetY,
            targetX,
            locationName,
            dataSource,
        };
    };

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
