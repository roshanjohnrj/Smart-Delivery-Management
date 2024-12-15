import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Layout from './Layout.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Partners from './components/Partners/Partners.jsx'
import Orders from './components/Orders/Orders.jsx'

//notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router=createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
      {
        path:"",
        element:<Dashboard/>
      },
      {
        path:"partners",
        element:<Partners/>
      },
      {
        path:"Orders",
        element:<Orders/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>,
)
