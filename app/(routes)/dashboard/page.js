import { UserButton } from '@clerk/nextjs'
import Header from './_components/Header'
import React from 'react'
import WorkspaceList from './_components/WorkspaceList'

function DashBoard() {
  return (
    <div>
      <Header/>
      <WorkspaceList/>
    </div>
  )
}

export default DashBoard