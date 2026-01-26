import { h } from 'preact';
import { useEffect } from 'preact/hooks';

export function AsideContent({ LayerScoperCase, closeAsideContentPropIn }) {
  const dataList7 = [
    { id: 1, title: 'Item-7-1', description: '点击关闭侧浮层'},
    { id: 2, title: 'Item-7-2', description: '点击关闭侧浮层'},
    { id: 3, title: 'Item-7-3', description: '点击关闭侧浮层'},
    { id: 4, title: 'Item-7-4', description: '点击关闭侧浮层'},
    { id: 5, title: 'Item-7-5', description: '点击关闭侧浮层'},
    { id: 6, title: 'Item-7-6', description: '点击关闭侧浮层'},
    { id: 7, title: 'Item-7-7', description: '点击关闭侧浮层'},
    { id: 8, title: 'Item-7-8', description: '点击关闭侧浮层'},
    { id: 9, title: 'Item-7-9', description: '点击关闭侧浮层'},
    { id: 10, title: 'Item-7-10', description: '点击关闭侧浮层'},
    { id: 11, title: 'Item-7-11', description: '点击关闭侧浮层'},
    { id: 12, title: 'Item-7-12', description: '点击关闭侧浮层'},
    { id: 13, title: 'Item-7-13', description: '点击关闭侧浮层'},
    { id: 14, title: 'Item-7-14', description: '点击关闭侧浮层'},
    { id: 15, title: 'Item-7-15', description: '点击关闭侧浮层'},
    { id: 16, title: 'Item-7-16', description: '点击关闭侧浮层'},
    { id: 17, title: 'Item-7-17', description: '点击关闭侧浮层'},
    { id: 18, title: 'Item-7-18', description: '点击关闭侧浮层'},
    { id: 19, title: 'Item-7-19', description: '点击关闭侧浮层'},
    { id: 20, title: 'Item-7-20', description: '点击关闭侧浮层'},
    { id: 21, title: 'Item-7-21', description: '点击关闭侧浮层'},
    { id: 22, title: 'Item-7-22', description: '点击关闭侧浮层'},
    { id: 23, title: 'Item-7-23', description: '点击关闭侧浮层'},
    { id: 24, title: 'Item-7-24', description: '点击关闭侧浮层'},
    { id: 25, title: 'Item-7-25', description: '点击关闭侧浮层'},
    { id: 26, title: 'Item-7-26', description: '点击关闭侧浮层'},
    { id: 27, title: 'Item-7-27', description: '点击关闭侧浮层'},     
  ];

  const onCloseAsideContent = () => {
    console.warn('closeAsideContent call from AsideContent component');
    if (closeAsideContentPropIn) {
      closeAsideContentPropIn();
    }
  };

  useEffect(() => {
    console.warn('AsideContent mounted', LayerScoperCase);
    /*
      添加一个弹框层级 - addNewLayer
      该方法只需要调用一次，但要是确保DOM已经渲染完成后再调用
      否则无法获取到正确的DOM元素
    */
    setTimeout(() => {
      LayerScoperCase.addNewLayer({
        id: 'aside-content',
        className: 'incontroll',
        defaultPoint: { y: 1, x: 1 },
        callBackFn: {
          cbBackSpace: onCloseAsideContent,
        },
        // 用户自定义的回调方法
        selfDefinedCallBackFn: {
          closeAsideContent: onCloseAsideContent,
        },
      });
      // 唤醒侧浮层层级
      LayerScoperCase.wakeUp({
        id: 'aside-content',
      });
    }, 0);
  }, []);

  return (
    <div id="aside-content" className="demo-aside-wrapper">
      <div className="demo-aside-content-title">侧浮层 - 组件形式</div>
      <div className="demo-aside-content-body scoped transit scrollzone" data-scoped="1">
        <div className="scoped-incontroll-scroll">
          {dataList7.map(item => (
            <div
              key={item.id}
              className="incontroll demo-aside-content-item"
              binddata={JSON.stringify(item)}
              clickfocus="closeAsideContent"
            >
              <div className="demo-aside-content-item-title">{item.title}</div>
              <div className="demo-aside-content-item-description">{item.description}</div>
            </div>
          ))}
          <div className="clearfix"></div>
        </div>
      </div>
    </div>
  );
}
