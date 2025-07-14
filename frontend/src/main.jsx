import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'antd/dist/reset.css';

import { ConfigProvider } from 'antd';
import itIT from 'antd/locale/it_IT';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider locale={itIT}>
    <App />
    </ConfigProvider>
  </StrictMode>,
)
