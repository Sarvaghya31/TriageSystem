import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import CheckAuth from './components/CheckAuth.jsx'
import Tickets from './pages/Tickets.jsx'
import Signup from './pages/Signup.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'
import Chat from './pages/Chat.jsx'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store from './store/store.js'


const router=createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
     {
      index:true,
      element:
        <CheckAuth protectedRoute={true}>
         <Tickets/>
        </CheckAuth>
      
     },
     {
      path:"tickets/:id",
      element:
        <CheckAuth protectedRoute={true}>
         <Chat/>
        </CheckAuth>
      
     },
     {
      path:"login",
      element:
        <CheckAuth protectedRoute={false}>
          <Login/>
        </CheckAuth>
      
     },
     {
      path:"signup",
      element:
        <CheckAuth protectedRoute={false}>
          <Signup/>
        </CheckAuth>
      
     },
     {
      path:"admin",
      element:
        <CheckAuth protectedRoute={true}>
        <Admin/>
        </CheckAuth>
      
     }     
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
  </StrictMode>
)
