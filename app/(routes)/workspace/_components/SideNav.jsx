"use client"
import React, { useEffect, useState } from 'react'
import Logo from '@/app/_components/Logo'
import { Bell, Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { db } from '@/config/firebaseconf'
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import DocumentList from './DocumentList'
import uuid4 from 'uuid4'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"



function SideNav({params}) {
    const {user}=useUser();
   const [documentList, setDocumentList]=useState([]);
   const [loading, setLoading]=useState(false);
  const router=useRouter();

   useEffect(()=>{
      params&&getDocumentList();
   },[params])

const getDocumentList=()=>{
    const q=query(collection(db,'workspaceDocuments'),
where('workspaceId','==',Number(params?.workspaceid)));
    
const unsubscribe=onSnapshot(q,(querySnapshot)=>{
    setDocumentList([]);

  querySnapshot.forEach((doc)=>{
    setDocumentList(documentList=>[...documentList, doc.data()])
  }
)
})
   }

    const createNewDocument=async()=>
    {
          if(documentList.length>=5)
          {
            toast("Upgrade to add new file", {
                description: "You reach max file, Please upgrad for unlimited file creation",
                action: {
                  label: "Upgrade",
                  onClick: () => console.log("Upgrade"),
                },
              })
            return;
          }

        setLoading(true);
        const docId=uuid4();


        await setDoc(doc(db,'workspaceDocuments',docId.toString()),
      {
         workspaceId:Number(params?.workspaceid),
         createdBy:user?.primaryEmailAddress?.emailAddress,
         coverImage:null,
         emoji:null,
         id:docId,
         documentName:'Untitled Document',
         documentOutput:[]
      });
      

      
await setDoc(doc(db,'documentOutput',docId.toString()),{
    docId:docId,
    output:[]
  });
    
           setLoading(false);
           router.replace('/workspace/'+ params?.workspaceid+'/'+docId)
    }

  return (
    <div className='h-screen fixed md:w-72 fixed md:block fixed bg-blue-50 p-5 shadow-md'>
        <div className='flex justify-between items-center'>
            <Logo/>
            <Bell className='h-5 w-5 text-gray-500'/>
        </div>
        <hr className='my-5'></hr>
        <div>
            <div className='flex justify-between text-center'>
                <h2 className='font-medium'>Workspace Name</h2>
                <Button size='sm' onClick={createNewDocument}>{loading?<Loader2Icon className='h-4 w-4 animate-spin'/>:'+'}</Button>
            </div>
        </div>
        <DocumentList documentList={documentList} params={params}/>

        <div className='absolute bottom-10 w-[85%]'>
        <Progress value={(documentList?.length/5)*100} />
        <h2 className='text-sm font-light my-2'><strong>{documentList?.length}</strong> Out of <strong>5</strong> files used</h2>
        <h2 className='text-sm font-light '>Upgrade your plan for unlimted access</h2>
       
        </div>

    </div>
  )
}

export default SideNav