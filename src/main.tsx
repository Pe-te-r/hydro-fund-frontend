import { Provider } from 'react-redux';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import App from './App.tsx'
import { store } from './store.ts';
import { AuthProvider } from './context/AuthContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>

    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
    </AuthProvider>
  </StrictMode>,
)


