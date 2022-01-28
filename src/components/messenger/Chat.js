import { useEffect, useState, useRef } from 'react';
import { db, collection, authentication } from '../../helpers/firebase';

import SendMessage from './SendMessage';

import {IoArrowBackOutline} from 'react-icons/io5'
import {FaAngleDoubleDown, FaAngleDoubleUp} from 'react-icons/fa'
import {BiEnvelope} from 'react-icons/bi'
import {IoCloseSharp} from 'react-icons/io5'
import {BiSearchAlt2} from 'react-icons/bi'

import './messenger.css'




function Chat() {

    const [ acceptedChats, setAcceptedChats ] = useState([{name:"Kizito Douglas"}, {name:"Nakityo Joanita"}, {name:"Anyuru David Derrick"}, {name:"Charles Kasasira Derrick"}])

    const [ search, setSearch ] = useState(false)
    const [ displayMessages, setDisplayMessages ] = useState(false)
    const [ messages, setMessages ] = useState([{text:'Hello', uid: "001", date:"Jan 24 2009", sendersUid:"oxsdUDhbTvMhdDbCRSb2Qaz0IAH3", receiversUid:"09398938"}, {text:'Hi', uid:"002", date:"Aug 23, 2021", sendersUid:"oxsdUDhbTvMhdDbCRSb2Qaz0IAH3", receiversUId:"09398938"},{text: "How're you doing? How was your day? Hope everything is okay. I would like to know you in person.", uid:"003", date:"Mar 21, 2022", sendersUid:"09398938", receiversUid:"oxsdUDhbTvMhdDbCRSb2Qaz0IAH3"}, {text:"I was supposed to come today but unfortunately. My puppy Machelle, fell sick and had to be rushed to the hospital. He started convulsing all of a sudden", date:"Jan 4, 2022", sendersUid:"oxsdUDhbTvMhdDbCRSb2Qaz0IAH3", receiversUid:"09398938"}])
    const [ sender, setSender ] = useState('Default Supervisor')
    const [ selectedChat, setSelectedChat ] = useState(false)
    const [ selectChat, setSelectChat ] = useState(true)
    const [ previousChats, setPreviousChats ] = useState([{name:"Anyuru David Derrick", uid:"0920290", photoURL:"blablabla"}, {name:"Charles Kasasira Derrick", uid:"223848", photoURL:"tintintin"}  ])
    const [ expanded, setExpanded ] = useState(false)

    const scroll = useRef()

    // useEffect(()=> {
    //     db.collection('messages').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
    //         setMessages(snapshot.docs.map(doc => doc.data()))
    //     })
        

    // }, [])
  return (     
        <div id="chatbox" style={{display:"flex", flexDirection:"column", backgroundColor:"white", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", width:"350px"}} className="shadow-sm collapse-chatbox" >
            {
                selectChat === false 
                ? 
                <div style={{display:"flex", backgroundColor:"white", position:"relative", height:"80px", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", paddingTop:"10px", paddingLeft:"20px", justifyContent:"space-between", opacity:"0.8"}} >
                    <div style={{display:"flex", gap:"5px"}}>
                        <button onClick={() => {
                            setSelectChat(true)
                            // document.getElementById("msg-form").classList.remove("expand-form")
                            // document.getElementById("msg-form").classList.add("collapse-form")
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
                            // document.getElementById("msg-form").classList.remove("collapse-form")
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
                                // document.getElementById("msg-form").classList.add("collapse-form")
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
                                        photoURL
                                    }, index) => {
                                        return (
                                            <div style={{display:"flex", gap:"5px", alignItems:"center", cursor:"pointer"}} onClick={() => {
                                                setSelectChat(!selectChat)
                                                // document.getElementById("msg-form").classList.add("expand-form")
                                                // document.getElementById("msg-form").classList.remove("collapse-form")
                                                document.getElementById("msg-form").classList.remove('hide-msg-form')
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
                                    photoURL
                                }, index) => {
                                    return (
                                        <div style={{display:"flex", gap:"5px", alignItems:"center", cursor:"pointer"}} onClick={() => {
                                            setSelectChat(!selectChat)
                                            document.getElementById("msg-form").classList.remove('hide-msg-form')
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
                    messages.map(({text, date, sendersUid}, index) => {
                        if(sendersUid === authentication.currentUser.uid) {
                            // console.log(text)
                            return (
                                <div key={index} style={{marginTop:"20px"}}>
                                    <div style={{display:"flex", gap:"5px"}}>
                                        <div style={{display:"flex", alignItems:"end"}}>
                                            <div style={{width:"40px",  height:"40px", borderRadius:"50%", backgroundColor:"gray", opacity:"0.2", display:"flex", justifyContent:"center", alignItems:"center"}}><div>PK</div></div>
                                        </div>
                                        <div className="msg-container" style={{backgroundColor:"rgb(239, 243, 244)", width:"60%", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", borderBottomRightRadius:"15px 15px", color:"#0f1419"}}>
                                            <div style={{padding:"10px"}}>
                                                {text}
                                            </div>
                                        </div>    
                                    </div>
                                    <span style={{display:"flex", width:"60%", paddingLeft:"50px"}}>
                                        {date}
                                    </span>
                                </div>
                            );
                        } 
                        
                        return (
                            <div key={index} style={{marginTop:"20px" }}>
                                <div className="msg-container" style={{display:"flex", justifyContent:"flex-end", paddingRight:"20px"}}>
                                    <span className={{width:"60%"}}> 
                                        <div style={{padding:"10px", width:"180px", backgroundColor:"#1d9bf0", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", borderBottomLeftRadius:"15px 15px", color:"#fff"}}>
                                            {text}
                                        </div>
                                        <div style={{display:"flex", justifyContent:"flex-end"}}>
                                            {date}
                                        </div>
                                    </span>
                                </div>    
                            </div>
                        );
                    })
                }
                    
            </div>
            <div id="msg-form" style={{width:"100%", backgroundColor:"white", borderTop:"solid 1px #eff3f4", height:"50px"}}>
                <SendMessage scroll={scroll}/>
            </div>
            <div ref={scroll}></div>
        </div>  
      
    );
}

export default Chat;
