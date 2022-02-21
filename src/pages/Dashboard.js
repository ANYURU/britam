import { useState, useEffect } from 'react'
import useAuth from '../contexts/Auth'
import { Card, Container, Row, Col} from 'react-bootstrap'
// import BarChart from '../figures/BarChart'
import '../styles/dashboard.css'
import BarChart from '../figures/BarChart'
import Header from '../components/header/Header'
import { getDocs, collection } from 'firebase/firestore'
import { functions, db } from '../helpers/firebase';
import { httpsCallable } from 'firebase/functions';
import Loader from '../components/Loader'
import { authentication } from '../helpers/firebase'
import moment from 'moment'
import { ImFilesEmpty } from 'react-icons/im'
import { getAgentClients } from '../helpers/smallFunctions'
import { Link } from 'react-router-dom'

import Chat from '../components/messenger/Chat'
import '../styles/ctas.css'

function Dashboard({parent_container}) {
    const [clients, setClients] = useState([]);
    const [claims, setClaims] = useState([])
    const [claimsSettled, setClaimsSettled] = useState([])
    const [stickers, setStickers] = useState(0)
    // const [policies, setPolicies] = useState(2)
    const [claimNotifications, setClaimNotifications] = useState(0)
    const { authClaims } = useAuth()
    const claimsCollectionRef = collection(db, "claims");

    useEffect(async () => {
        document.title = 'Britam - Dashboard'
        getAgentClients().then(result => setClients(result))
        getClaims()
        getAgents()
        getSupervisors()
        getAdmins()
        getPolicies()
        setStickers(handlePolicyStickers(await getPolicies()))
    }, [])

    

    // policies
    const [policies, setPolicies] = useState([])
    const policyCollectionRef = collection(db, "policies");

    
    const getPolicies = async () => {
        const data = await getDocs(policyCollectionRef);
        const allPolicies = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

        if(authClaims.agent){// agent's policies
            setPolicies(allPolicies.filter(claim => claim.added_by_uid === authentication.currentUser.uid)) 
            return (allPolicies.filter(policy => policy.added_by_uid === authentication.currentUser.uid))
        }

        if(authClaims.supervisor){ // supervisor's policies
            const listUsers = httpsCallable(functions, 'listUsers')
            listUsers().then(({data}) => {
              const myAgents = data.filter(user => user.role.agent === true).filter(agent => agent.meta.added_by_uid === authentication.currentUser.uid).map(agentuid => agentuid.uid)
              
              const usersUnderSupervisor = [ ...myAgents, authentication.currentUser.uid]
      
              const supervisorPolicies = allPolicies.filter(claim => usersUnderSupervisor.includes(claim.added_by_uid))
              setPolicies(supervisorPolicies)
              return(supervisorPolicies)
            })
          }
        
        if(authClaims.admin){ // admin's policies
            const listUsers = httpsCallable(functions, 'listUsers')
            listUsers().then(({data}) => {
              const myAgents = data.filter(user => user.role.agent).filter(agent => agent.meta.added_by_uid === authentication.currentUser.uid).map(agentuid => agentuid.uid)
      
              const mySupervisors = data.filter(user => user.role.supervisor).filter(supervisor => supervisor.meta.added_by_uid === authentication.currentUser.uid).map(supervisoruid => supervisoruid.uid)
      
              const agentsUnderMySupervisors = data.filter(user => user.role.agent === true).filter(agent => mySupervisors.includes(agent.meta.added_by_uid)).map(agentuid => agentuid.uid)
              
              const usersUnderAdmin = [ ...myAgents, ...agentsUnderMySupervisors, ...mySupervisors, authentication.currentUser.uid]
      
              const adminPolicies = allPolicies.filter(policy => usersUnderAdmin.includes(policy.added_by_uid))
              setPolicies(adminPolicies)
              return(adminPolicies)
            })
        }

        if(authClaims.superadmin){// superadmin's policies
            setPolicies(allPolicies)
            return(allPolicies)
        } 
    }

    // claims
    const getClaims = async () => {
        const data = await getDocs(claimsCollectionRef);
        const allClaims = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const allSettledClaims = allClaims.filter(claim => claim.status === 'settled')
        if(authClaims.agent){ // agent's claims
            setClaims(allClaims.filter(claim => claim.uid === authentication.currentUser.uid)) 
            setClaimsSettled(allSettledClaims.filter(claim => claim.uid === authentication.currentUser.uid))
        } 

        if(authClaims.supervisor){ // supervisor's claims
            const listUsers = httpsCallable(functions, 'listUsers')
            listUsers().then(({data}) => {
              const myAgents = data.filter(user => user.role.agent === true).filter(agent => agent.meta.added_by_uid === authentication.currentUser.uid).map(agentuid => agentuid.uid)
              
              const usersUnderSupervisor = [ ...myAgents, authentication.currentUser.uid]
      
              const supervisorClaims = allClaims.filter(claim => usersUnderSupervisor.includes(claim.added_by_uid))
              setClaims(supervisorClaims)
              setClaimsSettled(supervisorClaims.filter(claim => claim.status === 'settled'))
            })
          }
        
        if(authClaims.admin){ // admin's claims
            const listUsers = httpsCallable(functions, 'listUsers')
            listUsers().then(({data}) => {
              const myAgents = data.filter(user => user.role.agent).filter(agent => agent.meta.added_by_uid === authentication.currentUser.uid).map(agentuid => agentuid.uid)
      
              const mySupervisors = data.filter(user => user.role.supervisor).filter(supervisor => supervisor.meta.added_by_uid === authentication.currentUser.uid).map(supervisoruid => supervisoruid.uid)
      
              const agentsUnderMySupervisors = data.filter(user => user.role.agent).filter(agent => mySupervisors.includes(agent.meta.added_by_uid)).map(agentuid => agentuid.uid)
              
              const usersUnderAdmin = [ ...myAgents, ...agentsUnderMySupervisors, ...mySupervisors, authentication.currentUser.uid]
              const adminClaims = allClaims.filter(claim => usersUnderAdmin.includes(claim.uid))
              const settledClaims = adminClaims.filter(claim => claim.status === "settled")
              setClaimsSettled(settledClaims)
              setClaims(adminClaims)
            })
        }

        authClaims.superadmin && setClaims(allClaims) && setClaimsSettled(allClaims.filter(claim => claim.status === "settled")) // superadmin's claims
          
          
    }

    // getting agents
    const [ agents, setAgents ] = useState([])
    const getAgents = () => {
        const listUsers = httpsCallable(functions, 'listUsers')
        listUsers().then((results) => {
            const resultsArray = results.data
            const myAgents = resultsArray.filter(user => user.role.agent).filter(agent => agent.meta.added_by_uid === authentication.currentUser.uid).slice(0, 5)
            myAgents.length === 0 ? setAgents(null) : setAgents(myAgents)
        }).catch((err) => {
        })
    }

    // getting supervisors
    const [ supervisors, setSupervisors ] = useState([])
    const getSupervisors = () => {
        const listUsers = httpsCallable(functions, 'listUsers')
        listUsers().then((results) => {
            const resultsArray = results.data
            const mySupervisors = resultsArray.filter(user => user.role.supervisor).filter(supervisor => supervisor.meta.added_by_uid === authentication.currentUser.uid).slice(0, 5)
            mySupervisors.length === 0 ? setSupervisors(null) : setSupervisors(mySupervisors)
        }).catch((err) => {
        })
    }

    // getting admins
    const [ admins, setAdmins ] = useState([])
    const getAdmins = () => {
        const listUsers = httpsCallable(functions, 'listUsers')
        listUsers().then((results) => {
            const resultsArray = results.data
            const myUsers = resultsArray.filter(user => user.role.admin).slice(0, 5)
            setAdmins(myUsers)
        }).catch((err) => {
        })
    }


    // Total number of stickers
    const handlePolicyStickers = (pols) => {
        let sum = 0
        !pols || pols.forEach( pol =>  {
            sum += !pol.stickersDetails || pol.stickersDetails.length
        })
        return sum     
    }

    return (
            <div className='components' /* style={{margin: "30px"}} */>
                <Header title="Welcome to Britam" subtitle="WITH YOU EVERY STEP OF THE WAY" className="heading"/>

                <div className="componentsData">
                    <div id="first-row" className={`mb-5 first-row ${parent_container ? 'dashboard-cards' : 'expanded-menu-dashboard-cards'}`}  style={{display:"flex", width: "100%", justifyContent: "space-between"}}>
                        <div id="bin" className={`shadow-sm bg-body rounded first-container ${!parent_container && 'bin-exp'}`} style={{display:'flex', flexDirection:"row"}}>
                            <div /* className="row-container" */ className={`card-row-container ${parent_container ?'coll':'exp'}`}>
                                    <div className="col">
                                        <div id="custom-card" className="custom-card m-1" style={{backgroundColor:"#804C75"}}>
                                            <Card.Body className="card-body">
                                                <div className="statistics">{`${claimsSettled.length}`}</div>
                                                <div className="card-text">Claim Settlements</div>
                                            </Card.Body>
                                        </div>
                                    </div>
                                    <div  className="col">
                                        <div id="custom-card" className="custom-card m-1" style={{backgroundColor:"#FFB848"}}>
                                            <Card.Body className="card-body">
                                                <div className="statistics">{`${policies.length}`}</div>
                                                <div className="card-text">Policies</div>
                                            </Card.Body>
                                        </div>
                                    </div>
                            </div>
                            <div /* className="row-container" className=""*/ className={`card-row-container ${parent_container ?'coll':'exp'}`}>
                                    <div className="col">
                                        <div id="custom-card"className="custom-card m-1" style={{backgroundColor:"#C82E29"}}>
                                            <Card.Body className="card-body">
                                                <div className="statistics">{policies.length}</div>
                                                <div className="card-text">Stickers</div>
                                            </Card.Body>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div id="custom-card" className="custom-card m-1" style={{backgroundColor:"#1FBBA6"}}>
                                            <Card.Body className="card-body">
                                                <div className="statistics">{`${claims.length}`}</div>
                                                <div className="card-text">Claim Notifications</div>
                                            </Card.Body>
                                        </div>
                                    </div>
                            </div>
                        </div>

                        <div id="first-container" className="shadow-sm bg-body rounded first-container" style={{padding: "5px", display: "flex"}}>
                            <div id="short_stats">
                                {authClaims.superadmin && (
                                    admins.length > 0
                                    ?
                                        <>
                                            <h5 className="heading">Admins</h5>
                                            <table className='responsive'>
                                                <thead><tr><th>Name</th><th>Address</th></tr></thead>
                                                <tbody>
                                                    {admins.map(admin => (
                                                        <tr key={admin.uid}>
                                                            <td>{admin.name}</td>
                                                            <td>{admin.email}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    : 
                                        <Loader />
                                    )}

                                {authClaims.admin && (
                                    supervisors.length > 0 
                                    ?
                                    <>
                                        <h5 className="heading">Supervisors</h5>
                                        <table className='table table-responsive'>
                                            <thead><tr><th>Name</th><th>Address</th></tr></thead>
                                            <tbody>
                                                {supervisors.map(supervisor => (
                                                    <tr key={supervisor.uid}>
                                                        <td>{supervisor.name}</td>
                                                        <td>{supervisor.email}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                    : <Loader />
                                )}

                                {authClaims.supervisor && (
                                    agents && agents.length > 0 
                                    ? <>
                                    <h5 className="heading">Latest Agents</h5>
                                    <table className='table table-responsive'>
                                        <thead><tr><th>Name</th><th>Email Address</th></tr></thead>
                                        <tbody>
                                            {agents.map(agent => (
                                                <tr key={agent.uid}>
                                                    <td>{agent.name}</td>
                                                    <td>{agent.email}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="heading">Total Number of Agents: {agents.length} <Link to={'/supervisor/agents'}>view all</Link></p>
                                    </>
                                    : 
                                    agents === null
                                    ?
                                    <div className="no-table-data">
                                        <i><ImFilesEmpty /></i>
                                        <h4>No Agents</h4>
                                        <p>You have not added any agent Yet</p>
                                    </div>
                                    :
                                    <Loader />
                                )}
                                    
                                {authClaims.agent && (
                                    clients && clients.length > 0
                                    ?
                                    <div>
                                        <h5 className="heading">Latest Clients</h5>
                                        <table className='table table-responsive'>
                                            <thead><tr><th>Name</th><th>Email Address</th></tr></thead>
                                            <tbody>
                                                {clients.map(client => (
                                                    <tr key={client.uid}>
                                                        <td>{client.name}</td>
                                                        <td>{client.email}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <p className="heading">Total Number of Clients: {clients.length} <Link to={'/agent/clients'}>view all</Link></p>
                                    </div>
                                    :
                                    clients === null
                                    ?
                                    <div className="no-table-data">
                                        <i><ImFilesEmpty /></i>
                                        <h4>No Clients</h4>
                                        <p>You have not added any client Yet</p>
                                    </div>
                                    :
                                    <Loader />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Graph div  */}
                    <div className="shadow-sm p-3 mb-5 bg-body rounded graph-container" >
                        <h5 style={{"display":"flex", "gap": "10px"}}><span>
                            <div style={{"width": "20px", "height": "20px", backgroundColor: "#E0E7EC"}}></div>
                        </span>Monthly Stickers Issued</h5>
                        <Row style={{paddingTop:"3vh", paddingBottom:"2vh", paddingRight:"3vh"}}>
                            <Col id="graph-space" className="graph-space" >
                                    <BarChart />
                            </Col>
                        </Row>
                        <Row style={{diplay:"flex", justifyContent:"center"}}>
                            <Col><h6>Months</h6></Col>
                        </Row>
                    </div>
                </div>  
                {console.log(parent_container)}
                <div style={{width:"100%", position:"fixed", bottom:"0px", display:"flex", justifyContent:"flex-end"}} className={parent_container ? "chat-container": "expanded-menu-chat-container"}>
                    <Chat />
                </div> 
            </div>
        )
}

export default Dashboard

