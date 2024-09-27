"use client"
import React, { useEffect, useState } from 'react'
import CoverPicker from '@/app/_components/CoverPicker'
import Image from 'next/image'
import EmojiPickerC from '@/app/_components/EmojiPickerC';
import { SmilePlus } from 'lucide-react';
import { doc,getDoc, updateDoc} from 'firebase/firestore';
import { db } from '@/config/firebaseconf';
import { toast } from 'sonner';

function DocumentInfo({params}) {
    const [coverImage, setCoverImage]=useState('/cover.png');
    const [emoji, setEmoji] =useState();
    const [documentInfo, setDocumentInfo]=useState();
     useEffect(()=>
    {
        params && GetDocumentInfo();
    },[params])
    const GetDocumentInfo=async()=>{
        const docRef=doc(db,'workspaceDocuments',params?.documentid);
        const docSnap= await getDoc(docRef);

        if(docSnap.exists())
        {
            console.log(docSnap.data());
            setDocumentInfo(docSnap.data());
            setEmoji(docSnap.data()?.emoji);
            docSnap?.coverImage&&setCoverImage(docSnap.data()?.coverImage);
        }
    }


   const UpdateDocumentInfo=async(key,value)=>{
    const docRef=doc(db,'workspaceDocuments',params?.documentid);
    await updateDoc(docRef,{
        [key]:value
    })
    toast("document Updated");
   }



  return (
    <div>
         {/*Cover*/}
    <CoverPicker setNewCover={(cover)=>{
        setCoverImage(cover);
        UpdateDocumentInfo('coverImage',cover);
    }} >
    <div className='relative group cursor-pointer'>
                <h2 className='absolute hidden p-4 w-full h-full items-center group-hover:flex justify-center'>Change Cover</h2>
                <div className='group-hover:opacity-40'>

             
                <Image  src={coverImage} width={400} height={400}
                className='w-full h-[200px] object-cover rounded-t-xl'>

                </Image>
                </div>
            </div>
    </CoverPicker>

        {/*Emoji Picker*/}
        <div className='absolute ml-10 mt-[-40px] cursor-pointer'>

       
       <EmojiPickerC setEmojiIcon={(emoji)=>{
        setEmoji(emoji);
        UpdateDocumentInfo('emoji',emoji)
        }}>
       <div className='bg-[#ffffffb0] p-4 rounded-md'>
                 {emoji?<span className='text-5xl'>{emoji}</span>: <SmilePlus className='h-10 w-10 text-gray-500'/>}
                </div>
       </EmojiPickerC>
       </div>
        {/*File Name*/}

        <div className='mt-10 p-10'>
            <input type="text"  placeholder='Untitled Document'
            defaultValue={documentInfo?.documentName} className='font-bolt text-4xl outline-none'
            onBlur={(event)=>UpdateDocumentInfo('documentName',event.target.value)}/>
        </div>
    </div>
  )
}

export default DocumentInfo