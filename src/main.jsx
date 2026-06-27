import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { db, initDatabase } from './db/database.js'
import { applyThemeToDocument } from './context/ThemeContext.jsx'

initDatabase()
applyThemeToDocument(db.setting('theme'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
