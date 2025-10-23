import { StrictMode } from 'react'
import {BrowserRouter} from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import './index.css'
import StoreContextProvider from './context/StoreContextProvider.jsx'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StoreContextProvider>
<App/>
  </StoreContextProvider>
  </BrowserRouter>
)
