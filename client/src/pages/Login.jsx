import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setErr('')
    try{
      const { data } = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      nav('/')
    } catch(e){
      setErr(e?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div style={{maxWidth:420, margin:'60px auto', fontFamily:'system-ui'}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div><label>Email</label><br/><input value={email} onChange={e=>setEmail(e.target.value)} required/></div>
        <div><label>Password</label><br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
        {err && <p style={{color:'crimson'}}>{err}</p>}
        <button type="submit">Login</button>
      </form>
      <p>New here? <Link to="/register">Create account</Link></p>
    </div>
  )
}
