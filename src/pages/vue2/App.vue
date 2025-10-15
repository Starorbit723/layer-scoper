<template>
  <div id="content" class="content-wrapper">
    <a href="../index.html">返回目录</a>
  </div>
</template>

<script>
import VueCounter from '@/components/vue2/Counter.vue';
import LayerScoper from 'layer-scoper';

const LayerScoperCase = new LayerScoper();

export default {
  name: "APP",
  components: { VueCounter },
  data() {
    return {
    };
  },
  computed: {
  },
  created() {
  },
  mounted() {
    LayerScoperCase.initController({
      id: 'content',
      className: 'content-wrapper',
      defaultPoint: { x: 1, y: 1 },
    });
  },
  methods: {
  
  },
};
</script>

<style lang="less" scoped>
.content {
  
}

</style>


