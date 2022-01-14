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

function Dashboard() {
    const [clients, setClients] = useState([]);
    const [claims, setClaims] = useState([])
    const [stickers, setStickers] = useState(13)
    const [policies, setPolicies] = useState(2)
    const [claimNotifications, setClaimNotifications] = useState(0)
    const { authClaims } = useAuth()
    const claimsCollectionRef = collection(db, "claims");

    useEffect(() => {
        document.title = 'Britam - Dashboard'
        getClaims()
        getClients()
        getAgents()
    }, [])

    const getClients = () => {
        const listUsers = httpsCallable(functions, 'listUsers')
        listUsers().then((results) => {
            const resultsArray = results.data
            const myUsers = resultsArray.filter(user => user.role.Customer === true)
            setClients(myUsers)
        }).catch((err) => {
            console.log(err)
        })
    }

    // getting agents
    const [ agents, setAgents ] = useState([])
    const getAgents = () => {
        const listUsers = httpsCallable(functions, 'listUsers')
        listUsers().then((results) => {
            const resultsArray = results.data
            const myUsers = resultsArray.filter(user => user.role.agent === true)
            setAgents(myUsers)
        }).catch((err) => {
            console.log(err)
        })
    }

    const getClaims = async () => {
        const data = await getDocs(claimsCollectionRef);
        setClaims(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    return (
            <div className='components'>
                <Header title="Welcome to Britam" subtitle="WITH YOU EVERY STEP OF THE WAY" />

                <div className="componentsData" >
                    <div id="first-row" className='mb-5 first-row' style={{display:"flex", width: "100%", justifyContent: "space-between"}}>
                        <div id="bin" className="shadow-sm bg-body rounded first-container">
                            <Container className="row-container">
                                    <div className="col">
                                        <div className="custom-card" style={{backgroundColor:"#804C75"}}>
                                            <Card.Body className="card-body">
                                                <div className="statistics">{`${claims.length}`}</div>
                                                <div className="card-text">Claim Settlement</div>
                                            </Card.Body>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="custom-card" style={{backgroundColor:"#FFB848"}}>
                                            <Card.Body className="card-body">
                                                <div className="statistics">{`${policies}`}</div>
                                                <div className="card-text">Policies</div>
                                            </Card.Body>
                                        </div>
                                    </div>
                            </Container>
                            <Container className="row-container">
                                    <div className="col">
                                        <div className="custom-card" style={{backgroundColor:"#C82E29"}}>
                                            <Card.Body className="card-body">
                                                <div className="statistics">{`${stickers}`}</div>
                                                <div className="card-text">Stickers</div>
                                            </Card.Body>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="custom-card" style={{backgroundColor:"#1FBBA6"}}>
                                            <Card.Body className="card-body">
                                                <div className="statistics">{`${claims.length}`}</div>
                                                <div className="card-text">Claim Notifications</div>
                                            </Card.Body>
                                        </div>
                                    </div>
                            </Container>
                        </div>

                        <div className="shadow-sm bg-body rounded first-container" style={{padding: "5px", display: "flex", alignItems: "flex-start"}}>
                            <div id="short_stats">
                                {authClaims.admin && <>
                                    <h5 className="heading">Daily Reports Summary</h5>
                                    <table>
                                        <thead><th>Category</th><th>Grand totals</th></thead>
                                        <tbody>
                                            <tr>
                                                <td>MTP</td><td>UGX ___</td>
                                            </tr>
                                            <tr>
                                                <td>Comprehensive</td><td>UGX ___</td>
                                            </tr>
                                            <tr>
                                                <td>Windscreen</td><td>UGX ___</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    </>
                                }
                                {authClaims.supervisor && <>
                                    {clients.length > 0 
                                    ? <>
                                    <h5 className="heading">Latest Agents</h5>
                                    <table>
                                        <thead><th>Name</th><th>Email Address</th></thead>
                                        <tbody>
                                            {agents.map(agent => (
                                                <tr key={agent.uid}>
                                                    <td>{agent.name}</td>
                                                    <td>{agent.email}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    </>
                                    : 
                                    <Loader />
                                    }</>}
                                    
                                {authClaims.agent && <>
                                    {clients.length > 0
                                    ? <>
                                    <h5 className="heading">Latest Clients</h5>
                                    <table>
                                        <thead><th>Name</th><th>Email Address</th></thead>
                                        <tbody>
                                            {clients.map(client => (
                                                <tr key={client.uid}>
                                                    <td>{client.name}</td>
                                                    <td>{client.email}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    </>
                                    :
                                    <Loader />
                                    }</>}
                            </div>
                        </div>
                    </div>

                    {/* Graph div  */}
                    <div className="shadow-sm p-3 mb-5 bg-body rounded graph-container" >
                        <h5 style={{"display":"flex", "gap": "10px"}}><span>
                            <div style={{"width": "20px", "height": "20px", backgroundColor: "#E0E7EC"}}></div>
                        </span>Monthly Stickers Issued</h5>
                        <Row style={{paddingTop:"3vh", paddingBottom:"2vh", paddingRight:"3vh"}}>
                            <Col className="graph-space" >
                                    <BarChart />
                            </Col>
                        </Row>
                        <Row style={{diplay:"flex", justifyContent:"center"}}>
                            <Col><h6>Months</h6></Col>
                        </Row>
                    </div>
                </div>  
            </div>
        )
}

export default Dashboard
