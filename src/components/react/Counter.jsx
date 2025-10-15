import React from 'react';

export default function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    React.createElement('div', null,
      React.createElement('h2', null, 'React 组件：Counter'),
      React.createElement('p', null, 'Count: ', React.createElement('strong', null, count)),
      React.createElement('button', { onClick: () => setCount(count - 1) }, '-1'),
      React.createElement('button', { onClick: () => setCount(count + 1) }, '+1')
    )
  );
}


