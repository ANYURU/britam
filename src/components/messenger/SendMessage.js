import {useState, useEffect } from 'react';
import {Form} from 'react-bootstrap';

import {AiOutlineSend} from 'react-icons/ai'

import { functions ,authentication, db} from '../../helpers/firebase';
import { 
    collection, addDoc, onSnapshot, orderBy, serverTimestamp
} from 'firebase/firestore'
import './messenger.css'


function SendMessage({scroll, receiver, messages}) {

    useEffect(
        () => {
            const { uid, photoURL } = authentication.currentUser
        }
    )
    const [message, setMessage] = useState('')

    const messagesCollectionRef = collection(db, "messages")
    const sendMessage = async (event) => {
        event.preventDefault();
        console.log(receiver)

        const { uid, photoURL } = authentication.currentUser

        console.log(message)
        await addDoc(messagesCollectionRef, {
            sendersUID: uid,
            photoURL: photoURL,
            createdAt: serverTimestamp(),
            message: message,
            receiversUID: receiver,
        })

        console.log(
            {
                name: receiver.name,
                sendersUid: uid,
                photoURL: photoURL,
                message: message,
                receiversUID: receiver,
            }
        )

        scroll.current.scrollIntoView({bahavior: 'smooth'})
        setMessage('')
    }

  return (
        <Form onSubmit={sendMessage} name="msgForm" id="msgForm">
            <Form.Group controlId="message">
                <div style={{display:"flex", gap:"5px", alignItems:"center", justifyContent:"space-between"}}>
                    <div style={{borderRadius:"20px", border:"1px solid #e2e8eb", height:"30px", alignItems:"center", paddingLeft:"10px", display:"flex", width:"200px"}}>
                        <input type="text" value={message} placeholder="Start a new message" onChange={({target}) => {
                            setMessage(target.value)
                            console.log(receiver)
                            // console.log(messages)
                        } }  style={{backgroundColor:"#f7f9f9", height:"20px", border:"none"}}/>
                    </div>
                    <button type="submit" style={{height:"30px", width:"30px", borderRadius:"50%", border:"none"}}>
                        <i style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", backgroundColor:"#f7f9f9"}}><AiOutlineSend style={{color:"#1d9bf0"}}/></i>
                    </button>
                </div>
            </Form.Group>
        </Form>
  );
}

export default SendMessage;
