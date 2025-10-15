import { h } from 'preact';
import '@/assets/css/global.css';
import { Counter } from '@components/preact/Counter.js';

export default function App() {
  return (
    h('div', null,
      h('h1', null, 'Hello from Preact!'),
      h(Counter)
    )
  );
}


