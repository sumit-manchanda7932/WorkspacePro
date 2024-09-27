import React, { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import Alert from 'editorjs-alert';
import List from "@editorjs/list";
import Checklist from '@editorjs/checklist'
import Table from '@editorjs/table'
import CodeTool from '@editorjs/code';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseconf';
import { useUser } from '@clerk/nextjs';
import Paragraph from '@editorjs/paragraph';


function RichDocumentEditor({ params }) {
  const ref = useRef();
  let editor;
  const editorRef = useRef();
  const { user } = useUser();
  let isFetched = false

  useEffect(() => {
    user && InitEditor();
  }, [user]);

  const SaveDocument = async () => {
    console.log("UPDATE")
    await ref.current.save().then(async (outputData) => {
      const docRef = doc(db, 'documentOutput', params?.documentid);

      await updateDoc(docRef, {
        output: outputData,
        editedBy: user?.primaryEmailAddress?.emailAddress
      })
    })
  }



  const GetDocumentOutput = () => {
    const unsubscribe = onSnapshot(doc(db, 'documentOutput', params?.documentid), (doc) => {
      const data = doc.data();

      if (data && data.output && (!isFetched || data.editedBy !== user?.primaryEmailAddress?.emailAddress)) {


        const outputData = data.output;


        if (outputData && Array.isArray(outputData.blocks)) {
          ref.current?.render(outputData);
          isFetched = true;
        }

      }
    });
  };


  const InitEditor = () => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: 'editorjs',
        onChange: () => {
          SaveDocument();
        },
        onReady: () => {
          GetDocumentOutput();
        },
        tools: {
          header: Header,
          delimiter: Delimiter,
          paragraph: Paragraph,
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+A',
            config: {
              alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
              defaultType: 'primary',
              messagePlaceholder: 'Enter something',
            },
          },
          table: Table,
          list: {
            class: List,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+L',
            config: {
              defaultStyle: 'unordered',
            },
          },
          checklist: {
            class: Checklist,
            shortcut: 'CMD+SHIFT+C',
            inlineToolbar: true,
          },
          code: {
            class: CodeTool,
            shortcut: 'CMD+SHIFT+P',
          },
        },
      });
      ref.current = editorRef.current;
    }
  };

  return (
    <div>
      <div id='editorjs' className='w-[70%]'></div>
      <div className='fixed bottom-10 md:ml-80 left-0 z-10'>

      </div>
    </div>
  );
}

export default RichDocumentEditor;

