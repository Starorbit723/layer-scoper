import React from 'react';
import '@/assets/css/global.css';
import Counter from '@components/react/Counter.jsx';

export default function App() {
  return (
    React.createElement('div', null,
      React.createElement('h1', null, 'Hello from React 18!'),
      React.createElement(Counter)
    )
  );
}


