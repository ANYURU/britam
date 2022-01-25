import { useEffect, useState } from 'react';
import {db, collection} from '../../helpers/firebase'
import SendMessage from './SendMessage';

function Chat() {
    const [ messages, setMessages ] = useState([{text:'Hello', uid: "001", date:"Jan 24 2009"}, {text:'Hi', uid:"002", date:"Aug 23, 2021"},{text: "How're you doing? How was your day? Hope everything is okay. I would like to know you in person.", uid:"003", date:"Mar 21, 2022"}])
    const [ user, setUser ] = useState('Anyuru David Derrick')
    // useEffect(()=> {
    //     db.collection('messages').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
    //         setMessages(snapshot.docs.map(doc => doc.data()))
    //     })
        

    // }, [])
  return (
    <div style={{display:"flex", flexDirection:"column"}}>
        <div style={{height:"300px", width:"300px", border:"1px solid red", backgroundColor:"white"}}>
            <div style={{display:"flex", backgroundColor:"white", position:"relative", height:"80px", border:"1px solid blue", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", opacity:"0.95", paddingTop:"10px", paddingLeft:"20px", marginBottom:"-40px"}} >
                <div>
                    {user}  
                </div>
            </div>
            {messages.map(({text, date}, index) => {
                return (
                    <div key={index}>
                        <div style={{display:"flex", gap:"5px", marginBottom:"5px"}}>
                            <div style={{display:"flex", alignItems:"end"}}>
                                <div style={{width:"40px",  height:"40px", borderRadius:"50%", backgroundColor:"indigo"}}></div>
                            </div>
                            <div className="msg-container" style={{backgroundColor:"rgb(239, 243, 244)", width:"60%", marginTop:"5px", marginBottom:"5px", borderTopLeftRadius:"15px 15px", borderTopRightRadius:"15px 15px", borderBottomRightRadius:"15px 15px"}}>
                                <div style={{padding:"10px"}}>
                                    {text}
                                </div>
                            </div>    
                        </div>
                        <div>
                            {date}
                        </div>
                    </div>
                );
            })}
        </div>        
    </div>  
    );
}

export default Chat;
