"use client"
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@clerk/nextjs'
import { AlignLeft, LayoutGrid } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';
import WorkspaceItemsList from './WorkspaceItemsList';
import { db } from '@/config/firebaseconf';
import { collection, getDocs, query, where } from 'firebase/firestore';
function WorkspaceList() {
    const {user}=useUser();
    const [workspaceList,setWorkspaceList]=useState([]);

    const {orgId}=useAuth();
    
   

    useEffect(()=>{
        user&&getWorkspaceList()
    },[orgId,user])
    const getWorkspaceList=async()=>{
        
        const q=query(collection(db,'workspace'),where('orgId','==',orgId?orgId:user?.primaryEmailAddress?.emailAddress))
        const querySnapshot=await getDocs(q);
        setWorkspaceList([]);
        querySnapshot.forEach((doc)=>{
            console.log(doc.data())
            setWorkspaceList(prev=>[...prev,doc.data()])
        })
    }


      return (
    <div
    className='my-10 py-10 md:px-24 lg:px-36 xl:px-52'>
        <div className='flex justify-between'>
            <h2 className='font-bold text-2xl'>Hello, {user?.fullName}</h2>
            <Link href={'/createworkspace'}>  <Button>+</Button></Link>
          </div>
        <div className='mt-10 flex justify-between'>
            <div>
                <h2 className='font-medium text-primary'>Workspaces</h2>
            </div>
            <div className='flex gap-2'>
                <LayoutGrid/>
                <AlignLeft/>
            </div>
        </div>
       {
        workspaceList?.length==0?
        <div className='flex flex-col justify-center items-center my-10'>
        <Image src={'/workspace.png'} width={200} height={200} alt="workspace"></Image>
        <h2>
            Create a new workspace
        </h2>
       <Link href={'/createworkspace'}> <Button  className='my-3'>+ New Worspace</Button></Link>
       
        </div>
        :
        <div>
           <WorkspaceItemsList workspaceList={workspaceList}/>
            </div>
       }
       
    </div>
  )
}

export default WorkspaceList