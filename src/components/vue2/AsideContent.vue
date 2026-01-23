<template>
  <div id="aside-content" class="demo-aside-wrapper">
    <div class="demo-aside-content-title">侧浮层 - 组件形式</div>
    <div class="demo-aside-content-body scoped transit scrollzone" data-scoped="1">
      <div class="scoped-incontroll-scroll">
        <div v-for="item in dataList7" :key="item.id" class="incontroll demo-aside-content-item" :binddata="JSON.stringify(item)" :clickfocus="'closeAsideContent'">
          <div class="demo-aside-content-item-title">{{item.title}}</div>
          <div class="demo-aside-content-item-description">{{item.description}}</div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AsideContent',
  props: {
    LayerScoperCase: {
      type: Object,
      default: () => {},
    },
    closeAsideContentPropIn: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      dataList7: [
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
      ],
    };
  },
  mounted() {
    console.warn('AsideContent mounted', this.LayerScoperCase);
    /*
      添加一个弹框层级 - addNewLayer
      该方法只需要调用一次，但要是确保DOM已经渲染完成后再调用
      否则无法获取到正确的DOM元素
    */
    this.$nextTick(() => {
      this.LayerScoperCase.addNewLayer({
        id: 'aside-content',
        className: 'incontroll',
        defaultPoint: { y: 1, x: 1 },
        callBackFn:{
          cbBackSpace: this.onCloseAsideContent,
        },
        // 用户自定义的回调方法
        selfDefinedCallBackFn: {
          closeAsideContent: this.onCloseAsideContent,
        },
      });
      // 唤醒侧浮层层级
      this.LayerScoperCase.wakeUp({
        id: 'aside-content',
      });
    });
  },
  methods: {
    onCloseAsideContent() {
      console.warn('closeAsideContent call from AsideContent component');
      this.closeAsideContentPropIn();
    },
  },
};
</script>

<style lang="less" scoped>
</style>


