import { useEffect, useState, useRef } from 'react';
import { functions ,authentication, db} from '../../helpers/firebase';
import { httpsCallable} from 'firebase/functions';
import { serverTimestamp } from 'firebase/firestore';

// import SendMessage from './SendMessage';

import {IoArrowBackOutline} from 'react-icons/io5'
import {FaAngleDoubleDown, FaAngleDoubleUp} from 'react-icons/fa'
import {BiEnvelope} from 'react-icons/bi'
import {IoCloseSharp} from 'react-icons/io5'
import {BiSearchAlt2} from 'react-icons/bi'
import {AiOutlineSend} from 'react-icons/ai';

import './messenger.css'

import useAuth from '../../contexts/Auth'
import { 
    addDoc,
    collection, getDocs, onSnapshot,
} from 'firebase/firestore'

import { Form } from 'react-bootstrap'



function Chat() {

    const [ acceptedChats, setAcceptedChats ] = useState([])
    const [ search, setSearch ] = useState(false)
    const [ allMessages, setAllMessages] = useState([])
    const [ messages, setMessages ] = useState([])
    const [ sender, setSender ] = useState('Default Supervisor')
    const [ selectChat, setSelectChat ] = useState(true)
    const [ previousChats, setPreviousChats ] = useState([{name:"Anyuru David Derrick", uid:"0920290", photoURL:"blablabla"}, {name:"Charles Kasasira Derrick", uid:"223848", photoURL:"tintintin"}  ])
    const [ expanded, setExpanded ] = useState(false)
    const [ message, setMessage ] = useState('')
    

    const [ receiversUID, setReceiversUID ] = useState('')

    const scroll = useRef()
    const { authClaims } = useAuth()

    useEffect(async ()=> {
        onSnapshot(collection(db, "messages"), (snapshot)=>{
            console.log(receiversUID)
            setAllMessages(snapshot.docs.map(doc =>  doc.data()))
        })
        process()

    }, [])

    

   const sendMessage = async (event) => {
       event.preventDefault()
       await addDoc(collection(db, 'messages'), {
        sendersUID: authentication.currentUser.uid,
        photoURL: authentication.currentUser.photoURL,
        createdAt: serverTimestamp(),
        message: message,
        receiversUID: receiversUID,
       }) 

       

   } 

    const process = () => {            
        const listUsers = httpsCallable(functions,'listUsers')
        listUsers().then(({ data }) => {
            if(authClaims?.supervisor) {
              const myAgents = data.filter(user => user.role.agent === true && user?.meta.added_by_uid === authentication.currentUser.uid)
              const incharge = data.filter(user => user.uid === data.filter(user => user.uid === authentication.currentUser.uid)[0].meta.added_by_uid)
              
              setAcceptedChats([...myAgents, ...incharge])
            //   console.log([...myAgents, ...incharge])
              return myAgents
    
            } else if (authClaims?.admin) {
              const incharge = data.filter(user => user.uid === data.filter(user => user.uid ===  authentication.currentUser.uid)[0].meta.added_by_uid)
              const supervisors = data.filter( user => user?.role?.supervisor === true && user?.meta?.added_by_uid === authentication.currentUser.uid)
              const myAgents = data.filter(user => user?.role?.agent === true && user?.meta?.added_by_uid === authentication.currentUser.uid)
            //   console.log([...supervisors, ...myAgents, ...incharge])

              setAcceptedChats([...supervisors, ...myAgents, ...incharge])
              return [...supervisors, ...myAgents, ...incharge]

            } else if (authClaims?.superAdmin) {
                const supervisorsAdmins = data.filter( user => user?.role?.admin === true && user?.meta?.added_by_uid === authentication.currentUser.uid)
                const myAgents = data.filter( user => user?.role?.agent === true && user?.meta?.added_by_uid === authentication.currentUser.uid)
                // console.log([...supervisorsAdmins, ...myAgents])

                setAcceptedChats([...myAgents, ...supervisorsAdmins])
                return [...myAgents, ...supervisorsAdmins]
            }
        }).then(async (capables) => {
            console.log(capables)
            

        
        }).catch((error) => {
            console.log(error)
        })
      }

      const getMessages = async (messagesRef) => {
        //   const data = await getDocs(messagesRef)
          const messagesData = onSnapshot(messagesRef, (snapshot) => {
              return snapshot.docs.map((doc) => doc.data())
          })
        //   const messagesData = data.docs.map((doc) => doc.data())
          return await messagesData
      }

      
      


    return (     
        <div id="chatbox" style={{display:"flex", flexDirection:"column", backgroundColor:"white", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", width:"350px"}} className="shadow-sm collapse-chatbox" >
            {
                selectChat === false 
                ? 
                <div style={{display:"flex", backgroundColor:"white", position:"relative", height:"80px", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", paddingTop:"10px", paddingLeft:"20px", justifyContent:"space-between", opacity:"0.8"}} >
                    <div style={{display:"flex", gap:"5px"}}>
                        <button onClick={() => {
                            setSelectChat(true)
                            document.getElementById("msg-form").classList.add('hide-msg-form')
                            document.getElementById("msg-form").classList.remove('show-msg-form')
                            
                        }} style={{height:"30px", width:"30px", borderRadius:"50%", border:"none"}}>
                            <i style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", backgroundColor:"#f7f9f9"}}><IoArrowBackOutline /></i>
                        </button>
                        <div style={{paddingTop:"5px"}}>
                            {sender}  
                        </div>
                    </div>
                    <button style={{height:"30px", width:"30px", borderRadius:"50%", border:"none", marginRight:"20px"}} onClick={()=>{
                        if(expanded === false) {
                            document.getElementById("chatbox").classList.remove("collapse-chatbox")
                            document.getElementById("msg-form").classList.remove("hide-msg-form")
                            document.getElementById("msg-form").classList.add("show-msg-form")
                            setExpanded(!expanded)
                        } else {
                            document.getElementById("chatbox").classList.add("collapse-chatbox")
                            document.getElementById("msg-form").classList.add("collapse-form")
                            setExpanded(!expanded)
                        }
                    }}>
                        <i style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", backgroundColor:"#f7f9f9"}}>{expanded === true ? <FaAngleDoubleDown /> : <FaAngleDoubleUp />}</i>
                    </button>
                </div>
                :
                <div style={{display:"flex", backgroundColor:"white", position:"relative", height:"80px", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", paddingTop:"10px", paddingLeft:"20px", justifyContent:"space-between", opacity:"0.8"}}>
                    <div style={{paddingTop:"5px"}}>
                        Messages 
                    </div>
                    <div style={{display:"flex", gap:"5px"}}>
                        {
                            search === true && 
                            <div style={{display:"flex", width:"160px", justifyContent:"space-between"}}>
                                <div style={{height:"30px", width:"30px"}}>
                                    <i style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", backgroundColor:"#f7f9f9", color:"#4aaef2"}}><BiSearchAlt2 /></i>     
                                </div>
                                <div>
                                    <input style={{borderBottom:"1px solid #1d9bf0", width:"120px", paddingLeft:"10px"}}id="search-users" className="search-chats"/>
                                </div>
                            </div>
                        }
                        <button onClick={() => {
                            setSearch(!search)
                        }} style={{height:"30px", width:"30px", borderRadius:"50%", border:"none"}}>
                            <i style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", backgroundColor:"#f7f9f9"}}>{search === true ? <IoCloseSharp /> : <BiEnvelope />}</i>
                        </button>
                        <button style={{height:"30px", width:"30px", borderRadius:"50%", border:"none", marginRight:"20px"}} onClick={()=>{
                            if(expanded === false) {
                                document.getElementById("chatbox").classList.remove("collapse-chatbox")
                                document.getElementById("msg-form").classList.add("hide-msg-form")
                                document.getElementById("msg-form").classList.remove("show-msg-form")
                                setExpanded(!expanded)
                            } else {
                                document.getElementById("chatbox").classList.add("collapse-chatbox")
                                document.getElementById("msg-form").classList.add("collapse-form")
                                setExpanded(!expanded)
                            }
                        }}>
                            <i style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", backgroundColor:"#f7f9f9"}}>{expanded === true ? <FaAngleDoubleDown /> : <FaAngleDoubleUp />}</i>
                        </button>
                    </div>
                </div>
                
            }
                
            <div style={{height:"400px", width:"300px", backgroundColor:"white", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", paddingLeft:"20px", overflow:"scroll", scrollBehavior:"smooth"}}>
                {
                    selectChat === true ? 
                    <>
                        {
                            search === false ?
                            <>
                                <div>Previous Chats</div>
                                {
                                    previousChats.map(({
                                        name,
                                        photoURL,
                                        uid
                                    }, index) => {
                                        return (
                                            <div style={{display:"flex", gap:"5px", alignItems:"center", cursor:"pointer"}} onClick={async () => {
                                                setSelectChat(!selectChat)
                                                document.getElementById("msg-form").classList.remove('hide-msg-form')
                                                setReceiversUID(uid)
                                            }}>
                                                <div>
                                                    <div style={{width:"40px",  height:"40px", borderRadius:"50%", backgroundColor:"gray", opacity:"0.2", display:"flex", justifyContent:"center", alignItems:"center"}}><div>{`${name.split(" ")[0][0].toUpperCase()}${name.split(" ")[1][0].toUpperCase()}`}</div></div>
                                                </div>
                                                <div key={index} style={{marginTop: "25px", display:"flex", alignItems:"center", height:"100%"}}>
                                                    <p>{name}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                } 
                            </>
                            :
                            <>
                                <div>Start a new Chat</div>
                                {
                                    acceptedChats.map(({
                                        name,
                                        photoURL,
                                        uid
                                    }, index) => {
                                        console.log(acceptedChats)
                                        return (
                                            <div style={{display:"flex", gap:"5px", alignItems:"center", cursor:"pointer"}} onClick={async () => {
                                                document.getElementById("msg-form").classList.remove('hide-msg-form')
                                                setReceiversUID(uid)
                                                setMessages( allMessages.filter(message => message?.receiversUID === uid).filter(message => message?.sendersUID === authentication.currentUser.uid))
                                                // console.log(messages)
                                                setSelectChat(!selectChat)
                            
                                            }}>
                                                <div>
                                                    <div style={{width:"40px",  height:"40px", borderRadius:"50%", backgroundColor:"gray", opacity:"0.2", display:"flex", justifyContent:"center", alignItems:"center"}}><div>{`${name.split(" ")[0][0].toUpperCase()}${name.split(" ")[1][0].toUpperCase()}`}</div></div>
                                                </div>
                                                <div key={index} style={{marginTop: "25px", display:"flex", alignItems:"center", height:"100%"}}>
                                                    <p>{name}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                    
                                } 
                            </>
                        }

                    </>

                    :

                    <>
                    {console.log(messages)}
                    {

                        messages?.length > 0 && messages.map(({ message, createdAt, sendersUid}, index) => {
                            if(sendersUid === authentication.currentUser.uid) {
                                console.log(messages)
                                return (
                                    <div key={index} style={{marginTop:"20px"}}>
                                        <div style={{display:"flex", gap:"5px"}}>
                                            <div style={{display:"flex", alignItems:"end"}}>
                                                <div style={{width:"40px",  height:"40px", borderRadius:"50%", backgroundColor:"gray", opacity:"0.2", display:"flex", justifyContent:"center", alignItems:"center"}}><div>PK</div></div>
                                            </div>
                                            <div className="msg-container" style={{backgroundColor:"rgb(239, 243, 244)", width:"60%", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", borderBottomRightRadius:"15px 15px", color:"#0f1419"}}>
                                                <div style={{padding:"10px"}}>
                                                    {message}
                                                </div>
                                            </div>    
                                        </div>
                                        <span style={{display:"flex", width:"60%", paddingLeft:"50px"}}>
                                            {"13 jan"}
                                        </span>
                                    </div>
                                );
                            } 
                            
                            return (
                                <div key={index} style={{marginTop:"20px" }}>
                                    <div className="msg-container" style={{display:"flex", justifyContent:"flex-end", paddingRight:"20px"}}>
                                        <span className={{width:"60%"}}> 
                                            <div style={{padding:"10px", width:"180px", backgroundColor:"#1d9bf0", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", borderBottomLeftRadius:"15px 15px", color:"#fff"}}>
                                                {message}
                                            </div>
                                            <div style={{display:"flex", justifyContent:"flex-end"}}>
                                                {"Feb 17"}
                                            </div>
                                        </span>
                                    </div>    
                                </div>
                            );
                        })
                    }
                    </>
                }
                    
            </div>
                <div id="msg-form" style={{width:"100%", backgroundColor:"white", borderTop:"solid 1px #eff3f4", height:"50px"}}>
                    <Form onSubmit={sendMessage} name="msgForm" id="msgForm">
                        <Form.Group controlId="message">
                            <div style={{display:"flex", gap:"5px", alignItems:"center", justifyContent:"space-between"}}>
                                <div style={{borderRadius:"20px", border:"1px solid #e2e8eb", height:"30px", alignItems:"center", paddingLeft:"10px", display:"flex", width:"200px"}}>
                                    <input type="text" value={message} placeholder="Start a new message" onChange={({target}) => {
                                        setMessage(target.value)
                                        console.log(receiversUID)
                                        onSnapshot(collection(db, "messages"), (snapshot)=>{
                                            console.log(receiversUID)
                                            setMessages(snapshot.docs.map(doc =>  doc.data()).filter(message => message?.receiversUID === receiversUID).filter(message => message?.sendersUID === authentication.currentUser.uid))
                                        })
                                        // console.log(messages)
                                    } }  style={{backgroundColor:"#f7f9f9", height:"20px", border:"none"}}/>
                                </div>
                                <button type="submit" style={{height:"30px", width:"30px", borderRadius:"50%", border:"none"}}>
                                    <i style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", backgroundColor:"#f7f9f9"}}><AiOutlineSend style={{color:"#1d9bf0"}}/></i>
                                </button>
                            </div>
                        </Form.Group>
                    </Form>
                </div>
            <div ref={scroll}></div>
        </div>  
      
    );
}

export default Chat;
