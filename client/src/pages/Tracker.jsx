import React, { useEffect, useState } from 'react'
import API from '../api'

const STATUSES = ['Saved','Applied','Interview','Offer','Rejected','Ghosted']

function JobRow({ job, onUpdate, onDelete }){
  return (
    <tr>
      <td>{job.company}</td>
      <td>{job.role}</td>
      <td>{job.location || '-'}</td>
      <td><a href={job.link} target="_blank" rel="noreferrer">{job.link ? 'Link' : '-'}</a></td>
      <td>{job.source || '-'}</td>
      <td>
        <select value={job.status} onChange={e=>onUpdate(job, { status: e.target.value })}>
          {STATUSES.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
      <td>{job.contactName || '-'}</td>
      <td>{job.contactEmail || '-'}</td>
      <td style={{maxWidth:240, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} title={job.notes || ''}>
        {job.notes || '-'}
      </td>
      <td>
        <button onClick={()=>onDelete(job)}>Del</button>
      </td>
    </tr>
  )
}

export default function Tracker(){
  const [jobs, setJobs] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [form, setForm] = useState({ company:'', role:'', location:'', link:'', source:'LinkedIn', status:'Applied', contactName:'', contactEmail:'', notes:'' })
  const [stats, setStats] = useState([])

  async function load(){
    const params = {}
    if(q) params.q = q
    if(status) params.status = status
    if(source) params.source = source
    const { data } = await API.get('/jobs', { params })
    setJobs(data.jobs || [])
    const s = await API.get('/jobs/stats/summary')
    setStats(s.data.byStatus || [])
  }

  useEffect(()=>{ load() }, [])

  async function add(e){
    e.preventDefault()
    const { data } = await API.post('/jobs', form)
    setJobs([data.job, ...jobs])
    setForm({ company:'', role:'', location:'', link:'', source:'LinkedIn', status:'Applied', contactName:'', contactEmail:'', notes:'' })
  }

  async function update(job, patch){
    const { data } = await API.patch(`/jobs/${job._id}`, patch)
    setJobs(jobs.map(j=> j._id===job._id ? data.job : j))
    const s = await API.get('/jobs/stats/summary'); setStats(s.data.byStatus || [])
  }

  async function remove(job){
    await API.delete(`/jobs/${job._id}`)
    setJobs(jobs.filter(j=> j._id!==job._id))
    const s = await API.get('/jobs/stats/summary'); setStats(s.data.byStatus || [])
  }

  function logout(){
    localStorage.removeItem('token')
    location.href='/login'
  }

  return (
    <div style={{maxWidth:1100, margin:'30px auto', fontFamily:'system-ui'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Job Tracker</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <form onSubmit={add} style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, marginBottom:16}}>
        <input placeholder="Company*" value={form.company} onChange={e=>setForm({...form, company:e.target.value})} required/>
        <input placeholder="Role*" value={form.role} onChange={e=>setForm({...form, role:e.target.value})} required/>
        <input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})}/>
        <input placeholder="Job Link" value={form.link} onChange={e=>setForm({...form, link:e.target.value})}/>
        <input placeholder="Source (LinkedIn/Naukri/Referral)" value={form.source} onChange={e=>setForm({...form, source:e.target.value})}/>
        <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          {STATUSES.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
        <input placeholder="Contact Name" value={form.contactName} onChange={e=>setForm({...form, contactName:e.target.value})}/>
        <input placeholder="Contact Email" value={form.contactEmail} onChange={e=>setForm({...form, contactEmail:e.target.value})}/>
        <input placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
        <button type="submit" style={{gridColumn:'span 6'}}>Add Job</button>
      </form>

      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Search company/role/location" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
        <input placeholder="Source filter" value={source} onChange={e=>setSource(e.target.value)} />
        <button onClick={load}>Apply Filters</button>
      </div>

      <div style={{display:'flex', gap:12, margin:'10px 0', flexWrap:'wrap'}}>
        {STATUSES.map(s=> {
          const row = stats.find(x=>x._id===s)
          const count = row ? row.count : 0
          return <div key={s} style={{border:'1px solid #eee', padding:'8px 12px', borderRadius:8}}>{s}: <b>{count}</b></div>
        })}
      </div>

      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>
              <th>Company</th><th>Role</th><th>Location</th><th>Link</th><th>Source</th><th>Status</th><th>Contact</th><th>Email</th><th>Notes</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j=> <JobRow key={j._id} job={j} onUpdate={update} onDelete={remove} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
