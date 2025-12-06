import { StrictMode } from 'react'; // 1. Using the import
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client'; // 2. Kept this one
// import { createRoot } from 'react-dom/client' // 3. Removed the unused import
import './index.css';
import StoreContextProvider from './context/StoreContextProvider.jsx';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      {/* 4. Added StrictMode for better development debugging */}
      <StrictMode> 
        <App />
      </StrictMode>
    </StoreContextProvider>
  </BrowserRouter>
);