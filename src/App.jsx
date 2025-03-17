import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChatInterface from './components/ChatInterface'
import Budget from './components/Budget'

function App() {
  const [activeComponent, setActiveComponent] = useState('budget'); // 'chat' or 'budget'

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-center">
          <button 
            onClick={() => setActiveComponent('chat')}
            className={`px-4 py-2 mx-2 rounded-lg ${
              activeComponent === 'chat' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Chat Assistant
          </button>
          <button 
            onClick={() => setActiveComponent('budget')}
            className={`px-4 py-2 mx-2 rounded-lg ${
              activeComponent === 'budget' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Budget Assistant
          </button>
        </div>
      </nav>
      
      <div className="container mx-auto py-6">
        {activeComponent === 'chat' ? <ChatInterface /> : <Budget />}
      </div>
    </div>
  )
}

export default App
