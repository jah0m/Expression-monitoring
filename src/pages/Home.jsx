import React from 'react'
import {Outlet} from 'react-router-dom'
import Buttons from '../components/Buttons'
import '../styles/Home.css'
export default function Home() {
  return (
    <div className='box'>
      <Outlet />
      <Buttons />
    </div>
  )
}
