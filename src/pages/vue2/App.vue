<template>
  <div class="page-content clearfix">
    <div class="demo-header">
      <img class="demo-header-logo" :src="logo" alt="logo" />
      <span class="demo-header-title">Vue2 - 示例页面</span>
      <a class="demo-header-back" href="../index.html">返回目录</a>
    </div>
    <!-- 页面主体内容区域 -->
    <div id="content" class="page-content-wrapper clearfix">
      <div class="map-incontroll-scroll">
        <!--同步的数据列表 1-->
        <div class="demo-list clearfix">
          <div class="demo-list-title">同步的数据列表 - 基础能力</div>
          <div class="demo-list-content clearfix scoped" data-scoped="1">
            <div
              v-for="item1 in demoDataList1" :key="item1.id"
              class="incontroll demo-list-item"
              :binddata="JSON.stringify(item1)"
              :clickfocus="'openDialog'"
              >
              <div class="demo-list-item-title">{{item1.title}}</div>
              <div class="demo-list-item-description">{{item1.description}}</div>
            </div>
          </div>
        </div>
        <!--同步的数据列表 2-->
        <div class="demo-list clearfix" v-if="demoDataList2.length > 0">
          <div class="demo-list-title">同步的数据列表 - className: openboundary (开放边界)，可移动到上一个或下一个scope</div>
          <div class="demo-list-content clearfix scoped openboundary" data-scoped="2">
            <div v-for="item2 in demoDataList2" :key="item2.id" class="incontroll demo-list-item" :binddata="JSON.stringify(item2)">
              <div class="demo-list-item-title">{{item2.title}}</div>
              <div class="demo-list-item-description">{{item2.description}}</div>
            </div>
          </div>
        </div>
        <!--同步的数据列表 3-->
        <div class="demo-list clearfix">
          <div class="demo-list-title">同步的数据列表 - className: remembered (记忆焦点)， 记忆上次该Scoped的落焦点</div>
          <div class="demo-list-content clearfix scoped remembered" data-scoped="3">
            <div v-for="item3 in demoDataList3" :key="item3.id" class="incontroll demo-list-item" :binddata="JSON.stringify(item3)">
              <div class="demo-list-item-title">{{item3.title}}</div>
              <div class="demo-list-item-description">{{item3.description}}</div>
            </div>
          </div>
        </div>
        <!--同步的数据列表 4-->
        <div class="demo-list clearfix">
          <div class="demo-list-title">同步的数据列表 - className: transit (内部穿行)， 可在同一个scope内部上下移动焦点</div>
          <div class="demo-list-content clearfix scoped transit" data-scoped="4">
            <div v-for="item4 in demoDataList4"
              :key="item4.id"
              class="incontroll demo-list-item"
              :binddata="JSON.stringify(item4)"
              :clickfocus="'openAsideContent'">
              <div class="demo-list-item-title">{{item4.title}}</div>
              <div class="demo-list-item-description">{{item4.description}}</div>
            </div>
          </div>
        </div>
        <!--滚动的数据列表 5-->
        <div class="demo-list clearfix">
          <div class="demo-list-title">滚动数据列表 - className: scrollzone (滚动区域)  滚动条样式不美观LayerScoper不做处理，由业务方自定义CSS来处理/美化/隐藏</div>
          <div class="demo-list-scrollcontent clearfix scoped scrollzone" data-scoped="5">
            <!-- scoped-incontroll-scroll 表示滚动的内层容器，需要放在 scrollzone 的子元素中 -->
            <div class="scoped-incontroll-scroll">
              <div v-for="item5 in demoDataList5" :key="item5.id" class="incontroll demo-list-scrollitem" :binddata="JSON.stringify(item5)">
                <div class="demo-list-scrollitem-title">{{item5.title}}</div>
                <div class="demo-list-scrollitem-description">{{item5.description}}</div>
              </div>
            </div>
          </div>
        </div>
        <!--异步的数据列表 6-->
        <div class="demo-list clearfix" v-if="demoDataList6.length > 0">
          <div class="demo-list-title">异步的数据列表</div>
          <div class="demo-list-content clearfix scoped" data-scoped="6">
            <div v-for="item6 in demoDataList5" :key="item6.id" class="incontroll demo-list-item" :binddata="JSON.stringify(item6)">
              <div class="demo-list-item-title">{{item6.title}}</div>
              <div class="demo-list-item-description">{{item6.description}}</div>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
    <!-- 弹框 dialog -->
    <div id="dialog-content" class="demo-dialog-wrapper" v-if="showDialog">
      <div class="demo-dialog-content">
        <div class="demo-dialog-title">弹框标题</div>
          <div class="demo-dialog-body">弹框是一个新的图层(Layer), 可以独立于主页面进行交互<br>焦点会从 id = "content" 中脱离<br>并进入弹框图层 id = "dialog-content" 中</div>
        <div class="demo-dialog-footer scoped" data-scoped="1">
          <div class="incontroll demo-dialog-footer-button" :clickfocus="'closeDialog'">关闭弹框</div>
          <div class="incontroll demo-dialog-footer-button" :clickfocus="'closeDialog'">我知道了</div>
        </div>
      </div>
    </div>
    <!-- 侧浮层 -->
    <AsideContent
      v-if="showAsideContent"
      :LayerScoperCase="LayerScoperCase"
      :closeAsideContentPropIn="closeAsideByMainContent"></AsideContent>
  </div>
</template>

<script>
import AsideContent from '@/components/vue2/AsideContent.vue';
import logo from '@/assets/images/logo-page.png';
// import LayerScoper from 'layer-scoper';
import { LayerScoper } from '../../../plugin/layerScoper';

const LayerScoperCase = new LayerScoper();

export default {
  name: "APP",
  components: { AsideContent },
  data() {
    return {
      LayerScoperCase,
      logo,
      demoDataList1: [
        { id: 1, title: 'Item-1-1', description: '点击打开弹框-Dialog'},
        { id: 2, title: 'Item-1-2', description: '点击打开弹框-Dialog'},
        { id: 3, title: 'Item-1-3', description: '点击打开弹框-Dialog'},
        { id: 4, title: 'Item-1-4', description: '点击打开弹框-Dialog'},
      ],
      demoDataList2: [
        { id: 1, title: 'Item-2-1', description: '按左键可至上一个scope'},
        { id: 2, title: 'Item-2-2', description: ''},
        { id: 3, title: 'Item-2-3', description: ''},
        { id: 4, title: 'Item-2-4', description: '按右键可至下一个scope'},
      ],
      demoDataList3: [
        { id: 1, title: 'Item-3-1', description: ''},
        { id: 2, title: 'Item-3-2', description: ''},
        { id: 3, title: 'Item-3-3', description: ''},
        { id: 4, title: 'Item-3-4', description: ''},
      ],
      demoDataList4: [
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
      ],
      demoDataList5: [
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
      ],
      demoDataList6: [],
      showDialog: false, // 是否显示弹框
      showAsideContent: false, // 是否显示侧浮层
    };
  },
  computed: {
  },
  created() {
    
  },
  mounted() {
    // let screenMultiplerValue = 1;
    // if (window.innerWidth === 1280) {
    //   screenMultiplerValue = 0.666667;
    // } else {
    //   screenMultiplerValue = window.innerWidth / 1920;
    // }
    // 初始化LayerScoper
    LayerScoperCase.initController({
      id: 'content',
      className: 'incontroll',
      defaultPoint: { x: 1, y: 1 },
      needScroll: true,
      scrollDirection: 'vertical', // horizontal vertical
      // cssUsedScrrenMultipler: true,
      // screenMultiplerValue: screenMultiplerValue,
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
        cbFocusUp: this.onFocusUp,
        cbFocusDown: this.onFocusDown,
        cbFocusLeft: this.onFocusLeft,
        cbFocusRight: this.onFocusRight,
        cbBackSpace: this.onBackSpaceClick,
        cbFocusChange: this.onFocusChange,
      },
      // 用户自定义的回调方法
      selfDefinedCallBackFn: {
        openDialog: this.openDialog,
        openAsideContent: this.openAsideContent,
      },
    });
    // 模拟异步数据
    setTimeout(() => {
      this.demoDataList6 = [
        { id: 1, title: 'Item-6-1', description: ''},
        { id: 2, title: 'Item-6-2', description: ''},
        { id: 3, title: 'Item-6-3', description: ''},
        { id: 4, title: 'Item-6-4', description: ''},
        { id: 5, title: 'Item-6-5', description: ''},
        { id: 6, title: 'Item-6-6', description: ''},
      ];
      /*
        这里要注意：当数据异步更新后，需要等DOM渲染完成后再调用update方法
        否则无法获取到正确的DOM元素
      */ 
      this.$nextTick(() => {
        LayerScoperCase.update({
          id: 'content',
          needUpdateScoped: 6,
        });
      });
    }, 1000);
    // 初始化弹框
  },
  methods: {
    onFocusUp(data) {
      console.warn('onFocusUp', data);
    },
    onFocusDown(data) {
      console.warn('onFocusDown', data);
    },
    onFocusLeft(data) {
      console.warn('onFocusLeft', data);
    },
    onFocusRight(data) {
      console.warn('onFocusRight', data);
    },
    onBackSpaceClick(data) {
      console.warn('onBackSpaceClick', data);
    },
    onFocusChange(data) {
      console.warn('onFocusChange', data);
    },
    // 打开弹框的回调方法
    openDialog(data) {
      console.warn('openDialog', data);
      // 显示弹框
      this.showDialog = true;
      /*
        添加一个弹框层级 - addNewLayer
        该方法只需要调用一次，但要是确保DOM已经渲染完成后再调用
        否则无法获取到正确的DOM元素
      */
      this.$nextTick(() => {
        LayerScoperCase.addNewLayer({
          id: 'dialog-content',
          className: 'incontroll',
          defaultPoint: { y: 1, x: 2 },
          selfDefinedCallBackFn: {
            closeDialog: this.onCloseDialog,
          },
        });
        // 唤醒弹框层级
        LayerScoperCase.wakeUp({
          id: 'dialog-content',
        });
      });
    },
    // 关闭弹框的回调方法
    onCloseDialog(data) {
      console.warn('onCloseDialog', data);
      // 关闭弹框
      this.showDialog = false;
      // 唤醒主页面层级
      LayerScoperCase.wakeUp({
        id: 'content',
      });
    },
    // 打开侧浮层的回调方法
    openAsideContent() {
      console.warn('openAsideContent');
      // 显示侧浮层
      this.showAsideContent = true;
    },
    // 关闭侧浮层的回调方法
    closeAsideByMainContent() {
      console.warn('closeAsideByMainContent call');
      // 关闭侧浮层
      this.showAsideContent = false;
      // 唤醒主页面层级
      LayerScoperCase.wakeUp({
        id: 'content',
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page-content-wrapper {
  width: 100%;
  height: calc(100vh - 50px);
  .map-incontroll-scroll{

  }
}

</style>


