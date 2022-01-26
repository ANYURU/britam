import {useState} from 'react';
import {Form} from 'react-bootstrap';
import './messenger.css'
import {AiOutlineSend} from 'react-icons/ai'

function SendMessage({scroll}) {
    const [message, setMessage] = useState('')
    
    const sendMessage = async (event) => {
        event.preventDefault();

        scroll.current.scrollIntoView({bahavior: 'smooth'})
        return await "done"
    }

  return (
        <Form onSubmit={sendMessage} name="msg-form">
            <Form.Group controlId="message">
                <div style={{display:"flex", gap:"5px", alignItems:"center", justifyContent:"space-between"}}>
                    <div style={{borderRadius:"20px", border:"1px solid #e2e8eb", height:"30px", alignItems:"center", paddingLeft:"10px", display:"flex", width:"200px"}}>
                        <input type="text" value={message} placeholder="Start a new message" onChange={({target}) => setMessage(target.value)}style={{backgroundColor:"#f7f9f9", height:"20px", border:"none"}}/>
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
