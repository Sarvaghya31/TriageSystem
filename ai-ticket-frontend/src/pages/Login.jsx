import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { connectSocket,getSocket } from '../utils/socket';
import {login} from '../store/authslice.js'
import toast from 'react-hot-toast'
import {useDispatch} from 'react-redux'

function Login() {
  const [form,setForm] = useState({email:"",password:"",domain:""})
    const [loading,setLoading] = useState(false);
    const [isChecked,setChecked]=useState(false)
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const handleChange=(e)=>{
      setForm({...form,[e.target.name] : e.target.value})
    }
    const handleLogin=async (e) =>{
      e.preventDefault()
      setLoading(true)
      try{
        let res={};
        if(isChecked)
         {res=await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/loginAdmin`,{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body: JSON.stringify(form),
          credentials:'include'
        })}
        else{
          res=await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`,{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body: JSON.stringify(form),
          credentials:'include'
        })
        }
        const data=await res.json()
        if(res.ok)
        {
          dispatch(login(data));
          connectSocket();
          navigate("/");
        }
        else{
          toast.error("Invalid credentials")
        }
      }
      catch(error){
        toast.error("Login - something went wrong")
      }
      finally{
        setLoading(false)
      }
    }


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handleLogin} className="card-body">
          <h2 className="card-title justify-center">Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="domain"
            placeholder={isChecked?'Name your Domain':'Domain Name'}
            className="input input-bordered"
            value={form.domain}
            onChange={handleChange}
            required
          />
          <label>
          <input
          id="check"
          type="checkbox"
          name="Signing in as admin"
          checked={isChecked}
          onChange={(e)=>setChecked(e.target.checked)}
          />
          Login in as Administrator
          </label>


          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login