<template>
  <div id="content" class="content-wrapper">
    <div class="demo-header">
      <img class="demo-header-logo" :src="logo" alt="logo" />
      <span class="demo-header-title">Vue2 - 示例页面</span>
      <a class="demo-header-back" href="../index.html">返回目录</a>
    </div>
    <!--同步的数据列表 1-->
    <div class="demo-list clearfix demo-list1">
      <div class="demo-list-title">同步的数据列表 1</div>
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
    <!--异步的数据列表 2-->
    <div class="demo-list clearfix demo-list2" v-if="demoDataList2.length > 0">
      <div class="demo-list-title">异步的数据列表 2</div>
      <div class="demo-list-content clearfix scoped openboundary" data-scoped="2">
        <div v-for="item2 in demoDataList2" :key="item2.id" class="incontroll demo-list-item">
          <div class="demo-list-item-title">{{item2.title}}</div>
          <div class="demo-list-item-description">{{item2.description}}</div>
        </div>
      </div>
    </div>
    <!--同步的数据列表 3-->
    <div class="demo-list clearfix demo-list3">
      <div class="demo-list-title">同步的数据列表 3</div>
      <div class="demo-list-content clearfix scoped remembered" data-scoped="3">
        <div v-for="item3 in demoDataList3" :key="item3.id" class="incontroll demo-list-item">
          <div class="demo-list-item-title">{{item3.title}}</div>
          <div class="demo-list-item-description">{{item3.description}}</div>
        </div>
      </div>
    </div>
    <!--同步的数据列表 4-->
    <div class="demo-list clearfix demo-list4">
      <div class="demo-list-title">同步的数据列表 4</div>
      <div class="demo-list-content clearfix scoped" data-scoped="4">
        <div v-for="item4 in demoDataList4" :key="item4.id" class="incontroll demo-list-item">
          <div class="demo-list-item-title">{{item4.title}}</div>
          <div class="demo-list-item-description">{{item4.description}}</div>
        </div>
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
        { id: 1, title: '示例1-1', description: ''},
        { id: 2, title: '示例1-2', description: ''},
        { id: 3, title: '示例1-3', description: ''},
        { id: 4, title: '示例1-4', description: ''},
      ],
      demoDataList2: [
        { id: 1, title: '示例2-1', description: ''},
        { id: 2, title: '示例2-2', description: ''},
        { id: 3, title: '示例2-3', description: ''},
        { id: 4, title: '示例2-4', description: ''},
      ],
      demoDataList3: [
        { id: 1, title: '示例3-1', description: ''},
        { id: 2, title: '示例3-2', description: ''},
        { id: 3, title: '示例3-3', description: ''},
        { id: 4, title: '示例3-4', description: ''},
      ],
      demoDataList4: [
        { id: 1, title: '示例4-1', description: ''},
        { id: 2, title: '示例4-2', description: ''},
        { id: 3, title: '示例4-3', description: ''},
        { id: 4, title: '示例4-4', description: ''},
        { id: 5, title: '示例4-5', description: ''},
        { id: 6, title: '示例4-6', description: ''},
      ]
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
    });
    // 模拟异步数据
    setTimeout(() => {
      this.demoDataList4 = [
        { id: 1, title: '示例4-1', description: '可获焦元素'},
        { id: 2, title: '示例4-2', description: '可获焦元素'},
        { id: 3, title: '示例4-3', description: '可获焦元素'},
        { id: 4, title: '示例4-4', description: '可获焦元素'},
        { id: 5, title: '示例4-5', description: '可获焦元素'},
        { id: 6, title: '示例4-6', description: '可获焦元素'},
      ];
      /*
        这里要注意：当数据异步更新后，需要等DOM渲染完成后再调用update方法
        否则无法获取到正确的DOM元素
      */ 
      this.$nextTick(() => {
        LayerScoperCase.update({
          id: 'content',
          needUpdateScoped: 4,
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

}

</style>


