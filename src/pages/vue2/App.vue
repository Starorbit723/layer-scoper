<template>
  <div class="page-content clearfix">
    <div class="demo-header">
      <img class="demo-header-logo" :src="logo" alt="logo" />
      <span class="demo-header-title">Vue2 - 示例页面</span>
      <a class="demo-header-back" href="../index.html">返回目录</a>
    </div>
    <div id="content" class="content-wrapper clearfix">
      <div class="map-incontroll-scroll">
        <!--同步的数据列表 1-->
        <div class="demo-list clearfix">
          <div class="demo-list-title">同步的数据列表 - 基础能力</div>
          <div class="demo-list-content clearfix scoped" data-scoped="1">
            <div
              v-for="item1 in demoDataList1" :key="item1.id"
              class="incontroll demo-list-item"
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
            <div v-for="item2 in demoDataList2" :key="item2.id" class="incontroll demo-list-item">
              <div class="demo-list-item-title">{{item2.title}}</div>
              <div class="demo-list-item-description">{{item2.description}}</div>
            </div>
          </div>
        </div>
        <!--同步的数据列表 3-->
        <div class="demo-list clearfix">
          <div class="demo-list-title">同步的数据列表 - className: remembered (记忆焦点)， 记忆上次该Scoped的落焦点</div>
          <div class="demo-list-content clearfix scoped remembered" data-scoped="3">
            <div v-for="item3 in demoDataList3" :key="item3.id" class="incontroll demo-list-item">
              <div class="demo-list-item-title">{{item3.title}}</div>
              <div class="demo-list-item-description">{{item3.description}}</div>
            </div>
          </div>
        </div>
        <!--同步的数据列表 4-->
        <div class="demo-list clearfix">
          <div class="demo-list-title">同步的数据列表 - className: transit (内部穿行)， 可在同一个scope内部上下移动焦点</div>
          <div class="demo-list-content clearfix scoped transit" data-scoped="4">
            <div v-for="item4 in demoDataList4" :key="item4.id" class="incontroll demo-list-item">
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
              <div v-for="item5 in demoDataList5" :key="item5.id" class="incontroll demo-list-scrollitem">
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
            <div v-for="item6 in demoDataList5" :key="item6.id" class="incontroll demo-list-item">
              <div class="demo-list-item-title">{{item6.title}}</div>
              <div class="demo-list-item-description">{{item6.description}}</div>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
    
  </div>
</template>

<script>
// import VueCounter from '@/components/vue2/Counter.vue';
import logo from '@/assets/images/logo-page.png';
// import LayerScoper from 'layer-scoper';
import { LayerScoper } from '../../../plugin/layerScoper';

const LayerScoperCase = new LayerScoper();

export default {
  name: "APP",
  // components: { VueCounter },
  data() {
    return {
      logo,
      demoDataList1: [
        { id: 1, title: 'Item-1-1', description: ''},
        { id: 2, title: 'Item-1-2', description: ''},
        { id: 3, title: 'Item-1-3', description: ''},
        { id: 4, title: 'Item-1-4', description: ''},
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
        { id: 1, title: 'Item-4-1', description: ''},
        { id: 2, title: 'Item-4-2', description: ''},
        { id: 3, title: 'Item-4-3', description: ''},
        { id: 4, title: 'Item-4-4', description: ''},
        { id: 5, title: 'Item-4-5', description: ''},
        { id: 6, title: 'Item-4-6', description: ''},
        { id: 7, title: 'Item-4-7', description: ''},
        { id: 8, title: 'Item-4-8', description: ''},
        { id: 9, title: 'Item-4-9', description: ''},
        { id: 10, title: 'Item-4-10', description: ''},
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
    };
  },
  computed: {
  },
  created() {
    
  },
  mounted() {
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
        thumbColor: 'rgb(25, 170, 6)',
        thumbBorderWidth: '2px',
        thumbBorderColor: 'rgb(25, 170, 6)',
        thumbBorderRadius: '4px',
        thumbHoverColor: 'rgb(25, 170, 6)',
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
    
  },
  methods: {
  
  },
};
</script>

<style lang="less" scoped>
.content-wrapper {
  width: 100%;
  height: 800px;
  .map-incontroll-scroll{

  }
}

</style>


