"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Loader2Icon, SmilePlus } from 'lucide-react'
import CoverPicker from '@/app/_components/CoverPicker';
import EmojiPickerC from '@/app/_components/EmojiPickerC';
import { useAuth, useUser } from '@clerk/nextjs';
import { db } from '@/config/firebaseconf';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import uuid4 from 'uuid4';

function CreateWorkspace() {
    const [coverImage, setCoverImage]=useState('/cover.png')
    const [workspaceName, setWorkspaceName]=useState();
    const [emoji,setEmoji]=useState();
    const {user}=useUser();
    const {orgId}=useAuth();
    const [loading, setLoading]=useState(false);
    const router = useRouter();

   const onCreateWorspace=async()=>
   {
    setLoading(true);
    const workspaceId=Date.now();
    const result=await setDoc(doc(db,'workspace',workspaceId.toString()),
  {
     workspaceName:workspaceName,
     emoji:emoji,
     coverImage:coverImage,
     createdBy:user?.primaryEmailAddress?.emailAddress,
     id:workspaceId,
     orgId:orgId?orgId:user?.primaryEmailAddress?.emailAddress
  });

  const docId=uuid4();


  await setDoc(doc(db,'workspaceDocuments',docId.toString()),
{
   workspaceId:workspaceId,
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
     router.replace('/workspace/'+ workspaceId+'/'+docId)
   
   }

  return (
    <div className='p-10 md:px-36 lg:px-64 xl:px-96 py-28'>

        <div className='shadow-2xl rounded-xl'>
            <CoverPicker setNewCover={(v)=>setCoverImage(v)}>
            <div className='relative group cursor-pointer'>
                <h2 className='absolute hidden p-4 w-full h-full items-center group-hover:flex justify-center'>Change Cover</h2>
                <div className='group-hover:opacity-40'>

             
                <Image  src={coverImage} width={400} height={400}
                className='w-full h-[180px] object-cover rounded-t-xl'>

                </Image>
                </div>
            </div>
         </CoverPicker>
           <div className='p-12'>
            <h2 className='font-medium text-xl'>Create a new Workspace</h2>
            <h2 className='text-sm mt-2'>
                This is a Shared Space where you can collaborate with your team .
                You can always rename it later.
            </h2>

            <div className='mt-8 flex gap-2 item-center'>
                <EmojiPickerC setEmojiIcon={(v)=>setEmoji(v)}>
                <Button variant='outline'>
                 {emoji?emoji: <SmilePlus/>}
                </Button>
                </EmojiPickerC>
                <Input placeholder="workspace name"
                onChange={(e)=>setWorkspaceName(e.target.value)}/>
            </div>
             <div className='mt-7 flex justify-end gap-6'>
                <Button disabled={!workspaceName?.length || loading}
                onClick={onCreateWorspace}>Create {loading &&<Loader2Icon className='animate-spin  ml-2'/>}</Button>
                <Button variant='outline' >Cancel</Button>
             </div>
           </div>

        </div>
    </div>
  )
}

export default CreateWorkspace