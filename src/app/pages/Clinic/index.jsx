import React from 'react'
import { useNavigate } from 'react-router'

export default function Clinic() {
    const navigate = useNavigate()
  return (
    <div>
      <h1>Clinic</h1>
      <button onClick={()=>navigate("/doctors")}>Click</button>
    </div>
  )
}
