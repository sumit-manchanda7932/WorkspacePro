import React, { useState } from 'react'
import DocumentHeader from './DocumentHeader'
import DocumentInfo from './DocumentInfo'
import RichTextEditor from './RichTextEditor'
import { MessageCircle, X } from 'lucide-react'
import CommentBox from './CommentBox'
import { Button } from '@/components/ui/button'



function DocumentEditorSection({params}) {
  const [openComment, setOpenComment] = useState(false);
  return (
   
    <div>
        {/*Header*/}
        <DocumentHeader/>
       
    
       {/*DocumentInfo*/}
       <DocumentInfo params={params}/>

        {/*rich text Editor*/}
    <RichTextEditor params={params}/>

    <div className='fixed right-10 bottom-10 '>
        <Button onClick={() => setOpenComment(!openComment)}>
          {openComment ? <X /> : <MessageCircle />} </Button>
        {openComment && <CommentBox />}
      </div>

    </div>
  
  )
}

export default DocumentEditorSection