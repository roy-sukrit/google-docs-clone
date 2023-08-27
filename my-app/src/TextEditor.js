import React, { useCallback, useEffect, useRef, useState } from 'react'
import Quill from 'quill';
import "quill/dist/quill.snow.css"
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

const SAVE_INTERVAL_MS = 2000;

const TextEditor = () => {
    const { id: documentId } = useParams();

    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();

    //socket connection
    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);

        return () => {
            s.disconnect()
        }

    }, [])

    //Timer to save document
    useEffect(() => {
        if (socket == null || quill == null) return;

        const interval =setInterval(() => {
            socket.emit('save-document',quill.getContents())
        }, SAVE_INTERVAL_MS);

        return () =>{
            clearInterval(interval)
        }

    }, [socket, quill])



    //Text change delta event QUILL
    useEffect(() => {
        if (socket == null || quill == null) return;
        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return;
            //Only the changes are sent
            socket.emit("send-changes", delta);
        }

        quill.on('text-change', handler);

        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill])


    //Update the changes made in quill

    useEffect(() => {

        if (socket == null || quill == null) return;

        const handler = (delta) => {
            quill.updateContents(delta);
            console.log("updated");
        }

        socket.on('receive-changes', handler);

        return () => {
            quill.off('receive-changes', handler)
        }
    }, [socket, quill])


    //To insert in rooms
    useEffect(() => {

        console.log("document ID=>", documentId);

        if (socket == null || quill == null) return;

        //Get the document ID and contents
        socket.once('load-document', document => {
            quill.setContents(document);
            quill.enable();
            //To disale text editor
        })

        //Get the document ID and contents
        socket.emit('get-document', documentId)


    }, [socket, quill, documentId])


    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;
        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } })

        //Loading stop type
        q.disable();
        q.setText("Loading Document ...")

        setQuill(q)
        return () => {
            wrapperRef.innerHTML = "";
        }
    }, [])
    return <div className='container' ref={wrapperRef}></div>
}

export default TextEditor
