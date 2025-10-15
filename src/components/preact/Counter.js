import { h } from 'preact';
import { useState } from 'preact/hooks';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    h('div', null,
      h('h2', null, 'Preact 组件：Counter'),
      h('p', null, 'Count: ', h('strong', null, count)),
      h('button', { onClick: () => setCount(count - 1) }, '-1'),
      h('button', { onClick: () => setCount(count + 1) }, '+1')
    )
  );
}


