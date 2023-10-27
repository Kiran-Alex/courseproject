import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react";
import {RecoilRoot} from "recoil"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
  <ChakraProvider>
  <BrowserRouter>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </BrowserRouter>
  </ChakraProvider>
  </RecoilRoot>
)
