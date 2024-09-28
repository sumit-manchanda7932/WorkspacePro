"use client"
import Logo from '@/app/_components/Logo'
import { db } from '@/config/firebaseconf';
import { OrganizationSwitcher, useAuth, UserButton, useUser } from '@clerk/nextjs'
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react'

function Header() {
    const {orgId}=useAuth();
    console.log(orgId);
    const { user } = useUser();

  useEffect(()=>{
    user&&saveUserData();
  },[user])

  /**
   * Used to save user data
   */
  const saveUserData = async () => {
     const docId = user?.primaryEmailAddress?.emailAddress
    try {
      await setDoc(doc(db, 'LoopUsers', docId), {
        name: user?.fullName,
        avatar: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress
      })
    }
    catch (e) {

    }
  }
  return (
    <div className='flex justify-between items-center p-3 shadow-sm'>
        <Logo/>
        <OrganizationSwitcher  afterCreateOrganizationUrl={'/dashboard'}
        afterLeaveOrganizationUrl='/dashboard'/>
        <UserButton/>
    </div>
  )
}

export default Header