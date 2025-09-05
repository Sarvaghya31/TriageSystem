import React from 'react'
import LogOut from './LogOut'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
function Header() {
    const navigate=useNavigate();
    const status = useSelector((state)=>state.auth.status);
    console.log(typeof(status));
    const navItems=[
        {name:'Login',slug:'/login',active:!status},
        {name:'Signup',slug:'/signup',active:!status}
    ]
    
  return (
    <header className='py-3 shadow bg-blue-900 border-2 w-full sticky z-50 flex '>
        <div className='flex space-x-3 ml-auto pl-3'>
        {navItems.map((item)=>(
            item.active?(
                <ul key={item.name}>
                   <button onClick={()=>{
                    navigate(item.slug);
                   }} className='ml-auto px-2'>
                   {item.name}
                   </button>
                </ul>
            ):null
        ))}
        </div>
        {status && (<ul>
            <LogOut></LogOut>
        </ul>)}
    </header>
  )
}

export default Header