import { useState, useEffect } from 'react';
import '@/assets/css/global.less';
import { AsideContent } from '@/components/react/AsideContent.jsx';
import { LayerScoper } from '../../../plugin/layerScoper.js';
import logo from '@/assets/images/logo-page.png';

// 创建 LayerScoper 实例（在模块级别，避免重复创建）
const LayerScoperCase = new LayerScoper();

export default function App() {
  // 数据列表
  const [demoDataList1] = useState([
    { id: 1, title: 'Item-1-1', description: '点击打开弹框-Dialog'},
    { id: 2, title: 'Item-1-2', description: '点击打开弹框-Dialog'},
    { id: 3, title: 'Item-1-3', description: '点击打开弹框-Dialog'},
    { id: 4, title: 'Item-1-4', description: '点击打开弹框-Dialog'},
  ]);

  const [demoDataList2] = useState([
    { id: 1, title: 'Item-2-1', description: '按左键可至上一个scope'},
    { id: 2, title: 'Item-2-2', description: ''},
    { id: 3, title: 'Item-2-3', description: ''},
    { id: 4, title: 'Item-2-4', description: '按右键可至下一个scope'},
  ]);

  const [demoDataList3] = useState([
    { id: 1, title: 'Item-3-1', description: ''},
    { id: 2, title: 'Item-3-2', description: ''},
    { id: 3, title: 'Item-3-3', description: ''},
    { id: 4, title: 'Item-3-4', description: ''},
  ]);

  const [demoDataList4] = useState([
    { id: 1, title: 'Item-4-1', description: '点击打开侧浮层组件'},
    { id: 2, title: 'Item-4-2', description: '点击打开侧浮层组件'},
    { id: 3, title: 'Item-4-3', description: '点击打开侧浮层组件'},
    { id: 4, title: 'Item-4-4', description: '点击打开侧浮层组件'},
    { id: 5, title: 'Item-4-5', description: '点击打开侧浮层组件'},
    { id: 6, title: 'Item-4-6', description: '点击打开侧浮层组件'},
    { id: 7, title: 'Item-4-7', description: '点击打开侧浮层组件'},
    { id: 8, title: 'Item-4-8', description: '点击打开侧浮层组件'},
    { id: 9, title: 'Item-4-9', description: '点击打开侧浮层组件'},
    { id: 10, title: 'Item-4-10', description: '点击打开侧浮层组件'},
  ]);

  const [demoDataList5] = useState([
    { id: 1, title: 'Item-5-1', description: ''},
    { id: 2, title: 'Item-5-2', description: ''},
    { id: 3, title: 'Item-5-3', description: ''},
    { id: 4, title: 'Item-5-4', description: ''},
    { id: 5, title: 'Item-5-5', description: ''},
    { id: 6, title: 'Item-5-6', description: ''},
    { id: 7, title: 'Item-5-7', description: ''},
    { id: 8, title: 'Item-5-8', description: ''},
    { id: 9, title: 'Item-5-9', description: ''},
    { id: 10, title: 'Item-5-10', description: ''}
  ]);

  const [demoDataList6, setDemoDataList6] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showAsideContent, setShowAsideContent] = useState(false);

  // 回调方法
  const onFocusUp = (data) => {
    console.warn('onFocusUp', data);
  };

  const onFocusDown = (data) => {
    console.warn('onFocusDown', data);
  };

  const onFocusLeft = (data) => {
    console.warn('onFocusLeft', data);
  };

  const onFocusRight = (data) => {
    console.warn('onFocusRight', data);
  };

  const onBackSpaceClick = (data) => {
    console.warn('onBackSpaceClick', data);
  };

  const onFocusChange = (data) => {
    console.warn('onFocusChange', data);
  };

  // 打开弹框的回调方法
  const openDialog = (data) => {
    console.warn('openDialog', data);
    setShowDialog(true);
    // 使用 setTimeout 模拟 $nextTick
    setTimeout(() => {
      LayerScoperCase.addNewLayer({
        id: 'dialog-content',
        className: 'incontroll',
        defaultPoint: { y: 1, x: 2 },
        selfDefinedCallBackFn: {
          closeDialog: onCloseDialog,
        },
      });
      // 唤醒弹框层级
      LayerScoperCase.wakeUp({
        id: 'dialog-content',
      });
    }, 0);
  };

  // 关闭弹框的回调方法
  const onCloseDialog = (data) => {
    console.warn('onCloseDialog', data);
    setShowDialog(false);
    // 唤醒主页面层级
    LayerScoperCase.wakeUp({
      id: 'content',
    });
  };

  // 打开侧浮层的回调方法
  const openAsideContent = () => {
    console.warn('openAsideContent');
    setShowAsideContent(true);
  };

  // 关闭侧浮层的回调方法
  const closeAsideByMainContent = () => {
    console.warn('closeAsideByMainContent call');
    setShowAsideContent(false);
    // 唤醒主页面层级
    LayerScoperCase.wakeUp({
      id: 'content',
    });
  };

  // 初始化 LayerScoper
  useEffect(() => {
    // 初始化LayerScoper
    LayerScoperCase.initController({
      id: 'content',
      className: 'incontroll',
      defaultPoint: { x: 1, y: 1 },
      needScroll: true,
      scrollDirection: 'vertical', // horizontal vertical
      scrollBarConfig: {
        showScrollBar: true,
        trackWidth: '8px',
        trackBackground: 'rgba(255,255,255,0)',
        trackBorderRadius: '0',
        thumbColor: 'rgba(3, 189, 173, 0.4)',
        thumbBorderWidth: '2px',
        thumbBorderColor: 'rgba(3, 189, 173, 1)',
        thumbBorderRadius: '4px',
        thumbHoverColor: 'rgba(3, 189, 173, 1)',
      },
      // LayerScoper默认的回调方法
      callBackFn: {
        cbFocusUp: onFocusUp,
        cbFocusDown: onFocusDown,
        cbFocusLeft: onFocusLeft,
        cbFocusRight: onFocusRight,
        cbBackSpace: onBackSpaceClick,
        cbFocusChange: onFocusChange,
      },
      // 用户自定义的回调方法
      selfDefinedCallBackFn: {
        openDialog: openDialog,
        openAsideContent: openAsideContent,
      },
    });

    // 模拟异步数据
    const timer = setTimeout(() => {
      setDemoDataList6([
        { id: 1, title: 'Item-6-1', description: ''},
        { id: 2, title: 'Item-6-2', description: ''},
        { id: 3, title: 'Item-6-3', description: ''},
        { id: 4, title: 'Item-6-4', description: ''},
        { id: 5, title: 'Item-6-5', description: ''},
        { id: 6, title: 'Item-6-6', description: ''},
      ]);
      // 等 DOM 更新后再调用 update
      setTimeout(() => {
        LayerScoperCase.update({
          id: 'content',
          needUpdateScoped: 6,
        });
      }, 0);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 当 demoDataList6 更新时，调用 update
  useEffect(() => {
    if (demoDataList6.length > 0) {
      setTimeout(() => {
        LayerScoperCase.update({
          id: 'content',
          needUpdateScoped: 6,
        });
      }, 0);
    }
  }, [demoDataList6]);

  return (
    <div className="page-content clearfix">
      {/* 头部 */}
      <div className="demo-header">
        <img className="demo-header-logo" src={logo} alt="logo" />
        <span className="demo-header-title">React - 示例页面</span>
        <a className="demo-header-back" href="../index.html">返回目录</a>
      </div>
      {/* 页面主体内容区域 */}
      <div id="content" className="page-content-wrapper clearfix">
        <div className="map-incontroll-scroll">
          {/* 同步的数据列表 1 */}
          <div className="demo-list clearfix">
            <div className="demo-list-title">同步的数据列表 - 基础能力</div>
            <div className="demo-list-content clearfix scoped" data-scoped="1">
              {demoDataList1.map(item => (
                <div
                  key={item.id}
                  className="incontroll demo-list-item"
                  binddata={JSON.stringify(item)}
                  clickfocus="openDialog"
                >
                  <div className="demo-list-item-title">{item.title}</div>
                  <div className="demo-list-item-description">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
          {/* 同步的数据列表 2 */}
          {demoDataList2.length > 0 && (
            <div className="demo-list clearfix">
              <div className="demo-list-title">同步的数据列表 - className: openboundary (开放边界)，可移动到上一个或下一个scope</div>
              <div className="demo-list-content clearfix scoped openboundary" data-scoped="2">
                {demoDataList2.map(item => (
                  <div
                    key={item.id}
                    className="incontroll demo-list-item"
                    binddata={JSON.stringify(item)}
                  >
                    <div className="demo-list-item-title">{item.title}</div>
                    <div className="demo-list-item-description">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 同步的数据列表 3 */}
          <div className="demo-list clearfix">
            <div className="demo-list-title">同步的数据列表 - className: remembered (记忆焦点)， 记忆上次该Scoped的落焦点</div>
            <div className="demo-list-content clearfix scoped remembered" data-scoped="3">
              {demoDataList3.map(item => (
                <div
                  key={item.id}
                  className="incontroll demo-list-item"
                  binddata={JSON.stringify(item)}
                >
                  <div className="demo-list-item-title">{item.title}</div>
                  <div className="demo-list-item-description">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
          {/* 同步的数据列表 4 */}
          <div className="demo-list clearfix">
            <div className="demo-list-title">同步的数据列表 - className: transit (内部穿行)， 可在同一个scope内部上下移动焦点</div>
            <div className="demo-list-content clearfix scoped transit" data-scoped="4">
              {demoDataList4.map(item => (
                <div
                  key={item.id}
                  className="incontroll demo-list-item"
                  binddata={JSON.stringify(item)}
                  clickfocus="openAsideContent"
                >
                  <div className="demo-list-item-title">{item.title}</div>
                  <div className="demo-list-item-description">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
          {/* 滚动的数据列表 5 */}
          <div className="demo-list clearfix">
            <div className="demo-list-title">滚动数据列表 - className: scrollzone (滚动区域)  滚动条样式不美观LayerScoper不做处理，由业务方自定义CSS来处理/美化/隐藏</div>
            <div className="demo-list-scrollcontent clearfix scoped remembered scrollzone" data-scoped="5">
              {/* scoped-incontroll-scroll 表示滚动的内层容器，需要放在 scrollzone 的子元素中 */}
              <div className="scoped-incontroll-scroll">
                {demoDataList5.map(item => (
                  <div
                    key={item.id}
                    className="incontroll demo-list-scrollitem"
                    binddata={JSON.stringify(item)}
                  >
                    <div className="demo-list-scrollitem-title">{item.title}</div>
                    <div className="demo-list-scrollitem-description">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 异步的数据列表 6 */}
          {demoDataList6.length > 0 && (
            <div className="demo-list clearfix">
              <div className="demo-list-title">异步的数据列表</div>
              <div className="demo-list-content clearfix scoped" data-scoped="6">
                {demoDataList6.map(item => (
                  <div
                    key={item.id}
                    className="incontroll demo-list-item"
                    binddata={JSON.stringify(item)}
                  >
                    <div className="demo-list-item-title">{item.title}</div>
                    <div className="demo-list-item-description">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="clearfix"></div>
        </div>
      </div>
      {/* 弹框 dialog */}
      {showDialog && (
        <div id="dialog-content" className="demo-dialog-wrapper">
          <div className="demo-dialog-content">
            <div className="demo-dialog-title">弹框标题</div>
            <div className="demo-dialog-body">
              弹框是一个新的图层(Layer), 可以独立于主页面进行交互<br />
              焦点会从 id = "content" 中脱离<br />
              并进入弹框图层 id = "dialog-content" 中
            </div>
            <div className="demo-dialog-footer scoped" data-scoped="1">
              <div className="incontroll demo-dialog-footer-button" clickfocus="closeDialog">关闭弹框</div>
              <div className="incontroll demo-dialog-footer-button" clickfocus="closeDialog">我知道了</div>
            </div>
          </div>
        </div>
      )}
      {/* 侧浮层 */}
      {showAsideContent && (
        <AsideContent
          LayerScoperCase={LayerScoperCase}
          closeAsideContentPropIn={closeAsideByMainContent}
        />
      )}
    </div>
  );
}
