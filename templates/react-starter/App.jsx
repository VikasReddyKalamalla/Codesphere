import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center', background: '#0f172a', color: '#f8fafc', height: '100vh' }}>
      <h1 style={{ color: '#38bdf8' }}>⚡ React Starter Workspace</h1>
      <p style={{ color: '#94a3b8' }}>Live preview running seamlessly inside CodeSphere!</p>
      <div style={{ margin: '2rem 0' }}>
        <button 
          onClick={() => setCount(count + 1)}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
}
