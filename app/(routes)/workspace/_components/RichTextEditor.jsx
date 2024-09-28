import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import Alert from 'editorjs-alert';
import List from "@editorjs/list";
import Checklist from '@editorjs/checklist';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseconf';
import { useUser } from '@clerk/nextjs';
import Paragraph from '@editorjs/paragraph';
import GenerateAITemplate from './GenerateAITemplate';

function RichDocumentEditor({ params }) {
  const ref = useRef();
  const editorRef = useRef(); // Reference to the editor instance
  const { user } = useUser();
  let isFetched = false;

  useEffect(() => {
    if (user) {
      InitEditor(); // Initialize EditorJS when the user is available
    }
  }, [user]);

  // Function to save the document content to Firestore
  const SaveDocument = async () => {
    console.log('UPDATE');
    await ref.current.save().then(async (outputData) => {
      const docRef = doc(db, 'documentOutput', params?.documentid);
      await updateDoc(docRef, {
        output: outputData,
        editedBy: user?.primaryEmailAddress?.emailAddress,
      });
    });
  };

  // Function to get the document output from Firestore and render it in the editor
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

  // Initialize the EditorJS instance
  const InitEditor = () => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: 'editorjs',
        onChange: () => {
          SaveDocument(); // Save document when there's a change
        },
        onReady: () => {
          GetDocumentOutput(); // Load the document output when the editor is ready
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

  // Function to handle the AI-generated output and render it into EditorJS
  const handleGenerateAIOutput = (output) => {
    if (editorRef.current) {
      editorRef.current.render(output).catch((error) => {
        console.error('Error rendering AI-generated content: ', error);
      });
    }
  };

  return (
    <div className=''>
      <div id='editorjs' className='w-[70%]'></div>
      <div className='fixed bottom-10 md:ml-80 left-0 z-10'>
        {/* Pass the handleGenerateAIOutput function to GenerateAITemplate */}
        <GenerateAITemplate setGenerateAIOutput={handleGenerateAIOutput} />
      </div>
    </div>
  );
}

export default RichDocumentEditor;
