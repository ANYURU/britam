import { useEffect, useState, useRef } from 'react';
import {db, collection} from '../../helpers/firebase';
import SendMessage from './SendMessage';
import {IoArrowBackOutline} from 'react-icons/io5'
import {FaAngleDoubleDown} from 'react-icons/fa'



function Chat() {
    const [ messages, setMessages ] = useState([{text:'Hello', uid: "001", date:"Jan 24 2009"}, {text:'Hi', uid:"002", date:"Aug 23, 2021"},{text: "How're you doing? How was your day? Hope everything is okay. I would like to know you in person.", uid:"003", date:"Mar 21, 2022"}, {text:"I was supposed to come today but unfortunately. My puppy Machelle, fell sick and had to be rushed to the hospital. He started convulsing all of a sudden", date:"Jan 4, 2022"}])
    const [ user, setUser ] = useState('Anyuru David Derrick')
    const [ selectedChat, setSelectedChat ] = useState(false)
    const scroll = useRef()

    // useEffect(()=> {
    //     db.collection('messages').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
    //         setMessages(snapshot.docs.map(doc => doc.data()))
    //     })
        

    // }, [])
  return (
      
        <div style={{display:"flex", flexDirection:"column", backgroundColor:"white", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px"}} className="shadow-sm">
            <div style={{display:"flex", backgroundColor:"white", position:"relative", height:"80px", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", opacity:"0.7", paddingTop:"10px", paddingLeft:"20px", justifyContent:"space-between"}} >
                <div style={{display:"flex", gap:"5px"}}>
                    <button style={{height:"30px", width:"30px", borderRadius:"50%", border:"none"}}>
                        <i style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", backgroundColor:"#f7f9f9"}}><IoArrowBackOutline /></i>
                    </button>
                    <div>
                        {user}  
                    </div>
                </div>
                <button style={{height:"30px", width:"30px", borderRadius:"50%", border:"none", marginRight:"20px"}}>
                    <i style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", backgroundColor:"#f7f9f9"}}><FaAngleDoubleDown /></i>
                </button>
            </div>
                
            <div style={{height:"400px", width:"300px", backgroundColor:"white", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", paddingLeft:"20px", overflow:"scroll", scrollBehavior:"smooth"}}>
                {messages.map(({text, date}, index) => {
                    return (
                        <div key={index} style={{marginTop:"20px"}}>
                            <div style={{display:"flex", gap:"5px"}}>
                                <div style={{display:"flex", alignItems:"end"}}>
                                    <div style={{width:"40px",  height:"40px", borderRadius:"50%", backgroundColor:"gray", opacity:"0.2", display:"flex", justifyContent:"center", alignItems:"center"}}><div>PK</div></div>
                                </div>
                                <div className="msg-container" style={{backgroundColor:"rgb(239, 243, 244)", width:"60%", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", borderBottomRightRadius:"15px 15px"}}>
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
                })}
            </div>
            <div style={{width:"100%", backgroundColor:"white", borderTop:"solid 1px #eff3f4", height:"50px"}}>
                <SendMessage scroll={scroll}/>
            </div>
            <div ref={scroll}></div>
        </div>  
      
    );
}

export default Chat;
