import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setErr('')
    try{
      await API.post('/auth/register', { name, email, password })
      const { data } = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      nav('/')
    } catch(e){
      setErr(e?.response?.data?.error || 'Register failed')
    }
  }

  return (
    <div style={{maxWidth:420, margin:'60px auto', fontFamily:'system-ui'}}>
      <h2>Create account</h2>
      <form onSubmit={submit}>
        <div><label>Name</label><br/><input value={name} onChange={e=>setName(e.target.value)} required/></div>
        <div><label>Email</label><br/><input value={email} onChange={e=>setEmail(e.target.value)} required/></div>
        <div><label>Password</label><br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
        {err && <p style={{color:'crimson'}}>{err}</p>}
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}
