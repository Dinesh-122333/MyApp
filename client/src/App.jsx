import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Render from './Components/Render'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Render/>
    </>
  )
}

export default App
