<template>
  <div class="app">
    <h1>{{ title }}</h1>

    <section class="panel">
      <h2>计数器</h2>
      <p>
        Count: <strong>{{ count }}</strong>
      </p>
      <button @click="dec">-1</button>
      <button @click="inc">+1</button>
    </section>

    <section class="panel">
      <h2>输入</h2>
      <input v-model="keyword" placeholder="输入关键字" />
      <p>大写：{{ upperKeyword }}</p>
    </section>

    <section class="panel">
      <h2>待办</h2>
      <div class="todo-add">
        <input
          v-model="todoInput"
          placeholder="添加待办"
          @keyup.enter="addTodo"
        />
        <button @click="addTodo">添加</button>
      </div>
      <ul>
        <li v-for="(t, i) in todos" :key="t.id">
          <label>
            <input type="checkbox" v-model="t.done" />
            <span :class="{ done: t.done }">{{ t.text }}</span>
          </label>
          <button class="link" @click="removeTodo(i)">删除</button>
        </li>
      </ul>
      <p>完成 {{ doneCount }} / 共 {{ todos.length }}</p>
    </section>

    <section class="panel">
      <h2>本地组件</h2>
      <VueCounter />
    </section>
  </div>
</template>

<script>
import VueCounter from '@/components/vue2/Counter.vue';
export default {
  name: "APP",
  components: { VueCounter },
  data() {
    return {
      title: "Vue 2 Demo",
      count: 0,
      keyword: "",
      todoInput: "",
      todos: [],
    };
  },
  computed: {
    upperKeyword() {
      return this.keyword.toUpperCase();
    },
    doneCount() {
      return this.todos.filter((t) => t.done).length;
    },
  },
  created() {
    this.todos = [
      { id: 1, text: "阅读文档", done: true },
      { id: 2, text: "编写页面", done: false },
    ];
  },
  methods: {
    // 演示如何在 SFC 中使用本地组件
    useLocalComponent() {
      // 这里无需实际逻辑，仅示例引用
      return VueCounter;
    },
    inc() {
      this.count++;
    },
    dec() {
      this.count--;
    },
    addTodo() {
      const text = this.todoInput.trim();
      if (!text) return;
      this.todos.push({ id: Date.now(), text, done: false });
      this.todoInput = "";
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.app {
  padding: 16px;
}
h1 {
  margin: 0 0 16px;
  font-size: 22px;
}
.panel {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
}
.panel h2 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #374151;
}
input {
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
button {
  margin-left: 8px;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  cursor: pointer;
}
button.link {
  border: none;
  background: transparent;
  color: #2563eb;
  padding: 0 6px;
}
ul {
  list-style: none;
  padding-left: 0;
}
li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}
.done {
  text-decoration: line-through;
  color: #9ca3af;
}
</style>


