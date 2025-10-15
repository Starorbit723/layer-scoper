<template>
  <div>
    <h2>Vue 2 组件：Counter</h2>
    <p>Count: <strong>{{ count }}</strong></p>
    <button @click="count--">-1</button>
    <button @click="count++">+1</button>
  </div>
  
</template>

<script>
export default {
  name: 'VueCounter',
  data() {
    return { count: 0 };
  }
};
</script>

<style scoped>
</style>


