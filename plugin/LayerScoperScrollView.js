/**
 * LayerScoperScrollView
 *
 * 一个基于 LayerScoper 的滚动视图小插件，不修改 LayerScoper 核心代码，
 * 只通过 LayerScoper 的方向回调（cbFocusUp / cbFocusDown）来驱动自定义滚动条滑块 + 文本区域滚动。
 * 与 layerScoper.js 配套使用：由于交互方式特殊且使用场景占比较低，因此未放入主框架中。
 *
 * 典型 DOM 结构（类似 AsideScrollViewFloat）：
 *
 * // 这里的 id 建议与 LayerScoper 中该滚动区域所在的图层 id 保持一致，
 * // 便于一眼看出这是“某个图层里的滚动区域容器”，而不是一个单独页面节点。
 * <div id="layer-scrollview-id">
 *   <div class="layerscoper-scrollview-wrap">
 *     <div class="layerscoper-scrollview-content">
 *       <div class="layerscoper-scrollview-content-inner"> ... 很长很长的文本 ... </div>
 *     </div>
 *     <div class="layerscoper-scrollview-bar scoped" data-scoped="1">
 *       <div class="layerscoper-scrollview-thumb incontroll" clickfocus="..."></div>
 *     </div>
 *   </div>
 * </div>
 *
 * 其中，**以 `layerscoper-scrollview-` 开头的一组类名是这个滚动示例的固有结构**，推荐的 CSS / Less 嵌套规则示例：
 *
 * #layer-scrollview-id {
 *   .layerscoper-scrollview-wrap {
 *     // 整个 ScrollView 布局（左右结构）
 *   }
 *   .layerscoper-scrollview-content {
 *     // 左侧文本区域容器（设置 overflow 并隐藏滚动条，真正的滚动容器）
 *   }
 *   .layerscoper-scrollview-content-inner {
 *     // 内层：宽高 100% 或由内容撑开，作为溢出的部分
 *   }
 *   .layerscoper-scrollview-bar {
 *     // 右侧滚动条轨道（track）
 *   }
 *   .layerscoper-scrollview-thumb {
 *     // 滑块（thumb），唯一可聚焦元素
 *   }
 * }
 *
 *
 * 使用方式（示例）
 * ------------------------------------------------------------------
 * // 这里的 id 通常对应某个 LayerScoper 图层里的“滚动区域容器”节点，
 * // 该图层内可以还有其他 scope/元素，但 ScrollView 插件自身只有一个可聚焦滑块（自定义滚动条滑块）。
 * const scrollView = new LayerScoperScrollView({
 *   id: 'layer-scrollview-id',      // 必填：滚动区域容器的 id
 *   scrollDirection: 'vertical',    // 可选：滚动方向，'vertical' | 'horizontal'
 *   scrollBarConfig: {              // 可选：自定义滚动条样式（不传则使用默认值）
 *     trackWidth: '8px',
 *     trackBackground: 'rgba(255,255,255,0)',
 *     trackBorderRadius: '0',
 *     thumbColor: 'rgb(25, 170, 6)',
 *     thumbBorderRadius: '4px',
 *   },
 *   step: 80,                       // 可选：每次按键滚动的像素距离
 * });
 *
 * controllerCase.addNewLayer({
 *   id: 'aside-scrollview-float-content',
 *   className: 'incontroll',
 *   defaultPoint: { y: 1, x: 1 },
 *   // 该图层只有一个可聚焦元素（自定义滚动条滑块），
 *   // 焦点在该层内时，上下方向键直接交给 ScrollView 插件处理滚动即可
 *   callBackFn: {
 *     cbFocusUp: scrollView.onFocusUp,
 *     cbFocusDown: scrollView.onFocusDown,
 *     cbBackSpace: this.onCloseAsideScrollViewFloat,
 *   },
 *   // 若内容高度变化导致滚动条出现/消失，需要同步刷新 LayerScoper 的可聚焦列表
 *   // （例如：updateScrollView 后，再触发 controllerCase.update({ needUpdateScoped: 2 })）
 *   selfDefinedCallBackFn: {
 *     clickAsideItem: this.onCloseAsideScrollViewFloat,
 *   },
 * });
 *
 * 注意：
 * - 该插件不依赖 LayerScoper 内部实现，只依赖 DOM 结构 + LayerScoper 的方向回调，
 *   因此可以独立演进，不影响核心文件 layerScoper.js。
 * - 内容变化导致滚动条出现/消失时，需要先调用 updateScrollView，再触发
 *   controllerCase.update({ needUpdateScoped: 当前 scopeY }) 刷新可聚焦节点。
 * - 当前仅支持鼠标拖拽滑块（touch 版本未内置，可按需扩展）。
 * - 若容器存在 transform/scale，拖拽位移已按实际缩放比例换算。
 * - 本文件为 ESModule（含 export），需通过打包器或 type="module" 引入。
 */

// 独立日志封装，避免依赖 layerScoper.js
function LogPrint() {
    this.info = (text) => {
        console.log(`[layerscoper-info@LayerScoperScrollView]: ${text}`);
    };
    this.warn = (text) => {
        console.warn(`[layerscoper-warn@LayerScoperScrollView]: ${text}`);
    };
    this.error = (text) => {
        console.error(`[layerscoper-error@LayerScoperScrollView]: ${text}`);
    };
}

const Loger = new LogPrint();

export function LayerScoperScrollView(options) {
    const {
        id,
        scrollDirection: scrollDirectionInput = 'vertical', // 'vertical' | 'horizontal'
        // 自定义滚动条样式：不填则使用与 App.jsx 中 scrollBarConfig 一致的默认值
        scrollBarConfig = {},
        step = 80, // 每次按键滚动的像素距离（px）
    } = options || {};

    // 缓存关键配置到实例闭包变量中
    const idRef = id;
    const scrollDirection = scrollDirectionInput;

    if (!idRef) {
        Loger.warn('[LayerScoperScrollView] "id" is required');
    }
    // DOM 引用：通过 id 向下查找固定结构，而不是让业务层手写 querySelector
    let textEl = null;
    let thumbEl = null;
    let barEl = null;
    // 当前实例是否需要滚动（内容是否溢出），在 calculateThumbWidthOrHeight 中更新
    let needScroll = false;

    // 固定结构：wrap -> content（带 overflow 的滚动容器）-> content-inner（溢出内容）
    textEl = document.querySelector(`#${idRef} .layerscoper-scrollview-wrap .layerscoper-scrollview-content`);
    // 固定结构：wrap -> bar -> thumb
    thumbEl = document.querySelector(`#${idRef} .layerscoper-scrollview-wrap .layerscoper-scrollview-bar .layerscoper-scrollview-thumb`);
    barEl = thumbEl ? thumbEl.parentNode : null;

    if (!textEl || !thumbEl || !barEl) {
        Loger.error(`[LayerScoperScrollView] 未找到完整的滚动结构，请检查是否按文档约定使用 layerscoper-scrollview-* 的 DOM 结构。id: ${idRef}`);
        return;
    }
    // 默认滚动条样式
    const defaultScrollBarConfig = {
        trackWidth: '8px',
        trackBackground: 'rgba(255,255,255,0)',
        trackBorderRadius: '0',
        thumbColor: 'rgb(25, 170, 6)',
        thumbBorderRadius: '4px',
    };
    const mergedScrollBarConfig = Object.assign({}, defaultScrollBarConfig, scrollBarConfig || {});
    Loger.info(`[LayerScoperScrollView] ScrollBarConfig: ${JSON.stringify(mergedScrollBarConfig)}`);

    // 根据可视区域 / 总内容比例，动态计算 thumb 高度或宽度，
    // 同时在“内容未溢出”时隐藏滚动条与滑块，并取消焦点能力。
    // 注意：如果从“不需要滚动”变为“需要滚动”，业务层要调用 updateScrollView，
    // 同时触发 LayerScoper.update({ needUpdateScoped: 2 }) 以刷新可聚焦节点。
    this.calculateThumbWidthOrHeight = () => {
        if (!textEl || !barEl || !thumbEl) return;

        if (scrollDirection === 'vertical') {
            const contentTotal = textEl.scrollHeight;
            const contentView = textEl.clientHeight;
            if (contentTotal <= 0 || contentView <= 0) return;

            needScroll = contentTotal > contentView;
            if (!needScroll) {
                // 内容未超出容器：不需要滚动条，也不需要可聚焦滑块
                barEl.style.display = 'none';
                thumbEl.style.display = 'none';
                if (thumbEl.classList.contains('incontroll')) {
                    thumbEl.classList.remove('incontroll');
                }
                Loger.info('calculateThumbWidthOrHeight: content not overflow, hide scrollbar and thumb');
                return;
            }
            // 有可滚动内容：展示滚动条与滑块，并确保具备焦点能力
            barEl.style.display = '';
            thumbEl.style.display = '';
            if (!thumbEl.classList.contains('incontroll')) {
                thumbEl.classList.add('incontroll');
            }

            const trackSize = barEl.clientHeight;
            if (trackSize <= 0) return;
            const ratio = Math.max(0, Math.min(1, contentView / contentTotal));
            const minThumbSize = Math.min(trackSize, 24); // 最小高度，避免太小看不见
            const thumbSize = Math.max(minThumbSize, trackSize * ratio);
            thumbEl.style.width = '100%';
            thumbEl.style.height = `${thumbSize}px`;
        } else {
            const contentTotal = textEl.scrollWidth;
            const contentView = textEl.clientWidth;
            if (contentTotal <= 0 || contentView <= 0) return;

            needScroll = contentTotal > contentView;
            if (!needScroll) {
                barEl.style.display = 'none';
                thumbEl.style.display = 'none';
                if (thumbEl.classList.contains('incontroll')) {
                    thumbEl.classList.remove('incontroll');
                }
                Loger.info('calculateThumbWidthOrHeight: content not overflow, hide scrollbar and thumb');
                return;
            }
            Loger.info('calculateThumbWidthOrHeight: content overflow, show scrollbar and thumb');
            barEl.style.display = '';
            thumbEl.style.display = '';
            if (!thumbEl.classList.contains('incontroll')) {
                thumbEl.classList.add('incontroll');
            }

            const trackSize = barEl.clientWidth;
            if (trackSize <= 0) return;
            const ratio = Math.max(0, Math.min(1, contentView / contentTotal));
            const minThumbSize = Math.min(trackSize, 24);
            const thumbSize = Math.max(minThumbSize, trackSize * ratio);
            thumbEl.style.width = `${thumbSize}px`;
            thumbEl.style.height = '100%';
        }
    };

    // 滚动条轨道样式和滑块样式
    if (scrollDirection === 'vertical') {
        barEl.style.width = mergedScrollBarConfig.trackWidth || defaultScrollBarConfig.trackWidth;
        barEl.style.height = '100%';
    } else {
        barEl.style.width = '100%';
        barEl.style.height = mergedScrollBarConfig.trackWidth || defaultScrollBarConfig.trackWidth;
    }
    barEl.style.background = mergedScrollBarConfig.trackBackground || defaultScrollBarConfig.trackBackground;
    barEl.style.borderRadius = mergedScrollBarConfig.trackBorderRadius || defaultScrollBarConfig.trackBorderRadius;

    thumbEl.style.background = mergedScrollBarConfig.thumbColor || defaultScrollBarConfig.thumbColor;
    if (mergedScrollBarConfig.thumbBorderRadius) thumbEl.style.borderRadius = mergedScrollBarConfig.thumbBorderRadius;

    // 使用 top/left 控制滑块位置，避免与动画的 transform 冲突
    thumbEl.style.position = 'absolute';
    if (scrollDirection === 'vertical') {
        thumbEl.style.left = '0';
        thumbEl.style.top = '0';
    } else {
        thumbEl.style.top = '0';
        thumbEl.style.left = '0';
    }

    // 初始化时根据内容比例设置一次 thumb 尺寸
    this.calculateThumbWidthOrHeight();

    // 计算滑块滚动位置（不再使用 transform，改用 top/left）
    this.calculateThumbPosition = () => {
        if (scrollDirection === 'vertical') {
            const maxScroll = textEl.scrollHeight - textEl.clientHeight;
            if (maxScroll <= 0) return;
            const ratio = Math.max(0, Math.min(1, maxScroll === 0 ? 0 : textEl.scrollTop / maxScroll));
            const travel = barEl.clientHeight - thumbEl.clientHeight;
            if (travel <= 0) {
                thumbEl.style.top = '0px';
                return;
            }
            const offset = travel * ratio;
            thumbEl.style.top = `${offset}px`;
        } else {
            const maxScroll = textEl.scrollWidth - textEl.clientWidth;
            if (maxScroll <= 0) return;
            const ratio = Math.max(0, Math.min(1, maxScroll === 0 ? 0 : textEl.scrollLeft / maxScroll));
            const travel = barEl.clientWidth - thumbEl.clientWidth;
            if (travel <= 0) {
                thumbEl.style.left = '0px';
                return;
            }
            const offset = travel * ratio;
            thumbEl.style.left = `${offset}px`;
        }
    };

    // 内容区滚动时同步更新滑块位置（鼠标滚轮/触控板/拖动滚动条等都会触发）
    let syncRafId = null;
    const syncThumbWithContent = () => {
        if (!needScroll) return;
        // cancelAnimationFrame：取消上一帧未执行的回调，避免重复计算
        if (syncRafId) cancelAnimationFrame(syncRafId);
        // requestAnimationFrame：把视觉更新放到下一帧，滚动更顺滑
        syncRafId = requestAnimationFrame(() => {
            syncRafId = null;
            this.calculateThumbPosition();
        });
    };
    textEl.addEventListener('scroll', syncThumbWithContent, { passive: true });

    // 允许拖拽 thumb 控制内容区滚动
    let isDragging = false;
    let dragStart = 0;
    let dragStartThumb = 0;

    const onDragMove = (evt) => {
        if (!isDragging) return;
        const trackSize = scrollDirection === 'vertical' ? barEl.clientHeight : barEl.clientWidth;
        const thumbSize = scrollDirection === 'vertical' ? thumbEl.clientHeight : thumbEl.clientWidth;
        const travel = trackSize - thumbSize;
        if (travel <= 0) return;
        const delta = (scrollDirection === 'vertical' ? evt.clientY : evt.clientX) - dragStart;
        // 若容器存在 transform/缩放，屏幕像素与布局像素不一致，需要做比例换算
        const barRect = barEl.getBoundingClientRect();
        let scale = 1;
        if (trackSize > 0) {
            scale = scrollDirection === 'vertical'
                ? barRect.height / trackSize
                : barRect.width / trackSize;
        }
        const deltaLayout = scale ? delta / scale : delta;
        const nextThumb = Math.max(0, Math.min(dragStartThumb + deltaLayout, travel));
        const ratio = nextThumb / travel;
        if (scrollDirection === 'vertical') {
            thumbEl.style.top = `${nextThumb}px`;
            textEl.scrollTop = ratio * (textEl.scrollHeight - textEl.clientHeight);
        } else {
            thumbEl.style.left = `${nextThumb}px`;
            textEl.scrollLeft = ratio * (textEl.scrollWidth - textEl.clientWidth);
        }
    };

    const onDragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
    };

    const onDragStart = (evt) => {
        if (!needScroll) return;
        isDragging = true;
        if (scrollDirection === 'vertical') {
            dragStart = evt.clientY;
            dragStartThumb = thumbEl.offsetTop || 0;
        } else {
            dragStart = evt.clientX;
            dragStartThumb = thumbEl.offsetLeft || 0;
        }
        // 防止选中文本
        if (evt.preventDefault) evt.preventDefault();
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
    };

    thumbEl.addEventListener('mousedown', onDragStart);

    const scrollBy = (delta) => {
        if (!textEl || !thumbEl || !barEl) return;

        if (scrollDirection === 'vertical') {
            const maxScroll = textEl.scrollHeight - textEl.clientHeight;
            if (maxScroll <= 0) return;
            const next = Math.max(0, Math.min(textEl.scrollTop + delta, maxScroll));
            textEl.scrollTop = next;
        } else {
            const maxScroll = textEl.scrollWidth - textEl.clientWidth;
            if (maxScroll <= 0) return;
            const next = Math.max(0, Math.min(textEl.scrollLeft + delta, maxScroll));
            textEl.scrollLeft = next;
        }

        // 内容滚动后只更新滑块位置（thumb 尺寸仅在初始化时算一次，内容变化时由业务调用 calculateThumbWidthOrHeight）
        this.calculateThumbPosition();
    };

    // 能否继续向上 / 向下滚动，用于 LayerScoper 决定是否“归还”焦点到其他 scope
    this.canScrollUp = () => {
        if (!textEl || scrollDirection !== 'vertical') return false;
        return textEl.scrollTop > 0;
    };

    this.canScrollDown = () => {
        if (!textEl || scrollDirection !== 'vertical') return false;
        const maxScroll = textEl.scrollHeight - textEl.clientHeight;
        if (maxScroll <= 0) return false;
        return textEl.scrollTop < maxScroll;
    };

    // 能否继续向左 / 向右滚动（仅在 horizontal 模式下有意义）
    this.canScrollLeft = () => {
        if (!textEl || scrollDirection !== 'horizontal') return false;
        return textEl.scrollLeft > 0;
    };

    this.canScrollRight = () => {
        if (!textEl || scrollDirection !== 'horizontal') return false;
        const maxScroll = textEl.scrollWidth - textEl.clientWidth;
        if (maxScroll <= 0) return false;
        return textEl.scrollLeft < maxScroll;
    };

    this.onFocusUp = () => {
        Loger.info('onFocusUp call from LayerScoperScrollView');
        if (scrollDirection === 'vertical' && this.canScrollUp()) {
            scrollBy(-step);
            // 返回 true 告诉 LayerScoper：本次按键已被插件消费（仍停留在当前 scope）
            return true;
        }
        // 已经在顶部或不是纵向滚动，交还给 LayerScoper 按默认规则切换 scope
        return false;
    };

    this.onFocusDown = () => {
        Loger.info('onFocusDown call from LayerScoperScrollView');
        if (scrollDirection === 'vertical' && this.canScrollDown()) {
            scrollBy(step);
            // 返回 true 告诉 LayerScoper：本次按键已被插件消费（仍停留在当前 scope）
            return true;
        }
        // 已经在底部或不是纵向滚动，交还给 LayerScoper 按默认规则切换 scope
        return false;
    };

    this.onFocusLeft = () => {
        Loger.info('onFocusLeft call from LayerScoperScrollView');
        if (scrollDirection === 'horizontal' && this.canScrollLeft()) {
            scrollBy(-step);
            // 返回 true：说明本次按键已被 ScrollView 消费
            return true;
        }
        // 已经在最左侧或不是横向滚动，交还给 LayerScoper
        return false;
    };

    this.onFocusRight = () => {
        Loger.info('onFocusRight call from LayerScoperScrollView');
        if (scrollDirection === 'horizontal' && this.canScrollRight()) {
            scrollBy(step);
            // 返回 true：说明本次按键已被 ScrollView 消费
            return true;
        }
        // 已经在最右侧或不是横向滚动，交还给 LayerScoper
        return false;
    };

    /**
     * 对外暴露的刷新接口：
     * 当滚动区域内部新增/删除异步内容导致高度或宽度变化时，
     * 业务层可调用 verticalScrollViewCase.updateScrollView() / horizontalScrollViewCase.updateScrollView()
     * 重新计算滚动条 thumb 的尺寸与当前位置。
     */
    this.updateScrollView = () => {
        Loger.info('updateScrollView call from LayerScoperScrollView');
        this.calculateThumbWidthOrHeight();
        this.calculateThumbPosition();
    };
}
