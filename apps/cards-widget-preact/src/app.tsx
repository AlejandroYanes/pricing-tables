/* eslint-disable max-len */
import FrameContainer from './FrameContainer';
import { useState } from 'preact/compat';
import './Greetings';
import './app.css';

function App() {
  const [name, setName] = useState('Preact');
  return (
    <main className="app">
      <span>Testing Preact custom elements</span>
      <input value={name} onInput={(e: any) => setName(e.target.value)} style={{ margin: '16px 0' }} />
      {/* @ts-ignore */}
      <x-greeting name={name} />
    </main>
  )
}

export default App
