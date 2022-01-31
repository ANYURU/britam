import { generatePath, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { MdDownload, MdDetails } from 'react-icons/md'
import Pagination from '../helpers/Pagination';
import SearchBar from '../components/searchBar/SearchBar'
import Header from '../components/header/Header';
import { functions, authentication, db } from '../helpers/firebase';
import { httpsCallable } from 'firebase/functions';
import { Table, Modal, Form } from 'react-bootstrap'
import useAuth from '../contexts/Auth';
import { MdEdit, MdDelete } from 'react-icons/md'
import { AiFillCloseCircle } from 'react-icons/ai'
import Loader from '../components/Loader';
import ClientModal from '../components/ClientModal';
import { useForm } from '../hooks/useForm';
import useDialog from '../hooks/useDialog'
import { ImFilesEmpty } from 'react-icons/im'
import { 
  collection,
  getDocs,

} from 'firebase/firestore'
import Details from './Details'

function Agents({role}) {

  const [stickers, setStickers] = useState(0)
  const [claims, setClaims ] = useState(0)
  const [settledClaims, setSettledClaims] = useState(0)
  const [ organisations, setOrganisations] = useState(0)

  useEffect(() => {
    document.title = 'Britam - Agents'
    process()
  }, [])

  const process = async() => {            
    const listUsers = httpsCallable(functions,'listUsers')
    listUsers().then(({ data }) => {
        if(authClaims?.supervisor) {
          const myAgents = data.filter(user => user.role.agent === true && user?.meta.added_by_uid === authentication.currentUser.uid)
          setAgents(myAgents)
          const agentIds = myAgents.map(agent => agent.uid)
          return agentIds

        } else if (authClaims?.admin) {
          const supervisors = data.filter( user => user?.role?.supervisor === true && user?.meta?.added_by_uid === authentication.currentUser.uid).map(supervisor => supervisor.uid)
          const myAgents = data.filter(user => user?.role?.agent === true).filter(user => [...supervisors, authentication.currentUser.uid].includes(user.meta.added_by_uid))
          setAgents(myAgents)
          return [...supervisors, authentication.currentUser.uid]

        } else if (authClaims?.agent) {
            return[authentication.currentUser.uid]
        }
        
    }).then(async (userIDs) =>{
        const policies = await getPolicies(collection(db, 'policies'))
        setStickers(policies.filter(policy => userIDs.includes(policy.added_by_uid)).reduce((policy, sum) => policy.stickersDetails.length + sum, 0))

        const claims = await getClaims(collection(db, 'claims'))
        setClaims(claims.filter(claim => userIDs.includes(claim.uid)).length)
        setSettledClaims(claims.filter(claim => claim?.status !== "pending" && claim.status !== "").length)
        
        const organisations = await getOrganisations(collection(db, 'organisations'))
        console.log(organisations)
        setOrganisations(organisations.filter(organisation => userIDs.includes(organisation.uid)).length)    
    }).catch((error) => {
        console.log(error)
    })
  }

  const getPolicies = async (policyCollectionRef) => {
    const data = await getDocs(policyCollectionRef);
    const allPolicies = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return allPolicies
  }

  const getClaims = async (claimsCollectionRef) => {
    const data = await getDocs(claimsCollectionRef);
    const allClaims = data.docs.map((doc) => ({ ...doc.data(), id:doc.id }))
    return allClaims
  }

  const getOrganisations = async (organisationsCollectionRef) => {
    const data = await getDocs(organisationsCollectionRef);
    const organisations = data.docs.map((doc) => ({ ...doc.data(), id:doc.id}))
    return organisations
  }
  
  const { authClaims } = useAuth()
  const [ open, handleShow, handleClose] = useDialog(); 
  
  // get agents
  const [agents, setAgents] = useState([]);
  const getAgents = () => {
    const listUsers = httpsCallable(functions, 'listUsers')
    if(authClaims.supervisor){
      listUsers().then(({data}) => {
          const myAgents = data.filter(user => user.role.agent === true).filter(agent => agent.meta.added_by_uid === authentication.currentUser.uid)
          myAgents.length === 0 ? setAgents(null) : setAgents(myAgents)
      }).catch()
    } else if(authClaims.admin){
      listUsers().then(({data}) => {
        const mySupervisors = data.filter(user => user.role.supervisor === true).filter(supervisor => supervisor.meta.added_by_uid === authentication.currentUser.uid).map(supervisoruid => supervisoruid.uid)

        const agentsUnderAdmin = [ ...mySupervisors, authentication.currentUser.uid ]

        const myAgents = data.filter(user => user.role.agent === true).filter(agent => agentsUnderAdmin.includes(agent.meta.added_by_uid))

        myAgents.length === 0 ? setAgents(null) : setAgents(myAgents)
    }).catch()
    }
  }

  const [fields, handleFieldChange] = useForm({
    user_role: 'agent',
    email: '',
    name: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
    licenseNo: '',
    NIN: '',
    photo: '',
})


  // search for agent
  const [searchText, setSearchText] = useState('')
  const handleSearch = ({ target: {value} }) => setSearchText(value);
  const searchByName = (data) => data.filter(row => row.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1)

  // Pagination
  const [ currentPage, setCurrentPage ] = useState(1)
  const [clientsPerPage] = useState(10)
  const indexOfLastAgent = currentPage * clientsPerPage
  const indexOfFirstAgent = indexOfLastAgent - clientsPerPage
  const currentAgents = !agents || searchByName(agents).slice(indexOfFirstAgent, indexOfLastAgent)
  const totalPagesNum = !agents || Math.ceil(agents.length / clientsPerPage)

  // delete a single agent
  const handleDelete = async (id) => {
    const deleteUser = httpsCallable(functions, 'deleteUser')
    deleteUser({uid:id}).then().catch(err => {
      console.log(err)
    })
    getAgents()
  };

  const handleAllCheck = () => {
    if(document.getElementById("firstAgentCheckbox").checked === true){
      Object.values(document.getElementsByClassName("agentCheckbox")).map(checkbox => checkbox.checked = false)
      setDeleteArray([])
    } else{
      Object.values(document.getElementsByClassName("agentCheckbox")).map(checkbox => checkbox.checked = true)
      setDeleteArray(agents.map(agent => agent.uid))
    }
    
    
  }

  // delete multiple agents
  const [ bulkDelete, setBulkDelete ] = useState(null)
  const [ deleteArray, setDeleteArray ] = useState([])
  const [ deleteAllArray, setDeleteAllArray ] = useState([])
  const handleBulkDelete = async () => {
    if(bulkDelete){
      deleteArray.map(agentuid => handleDelete(agentuid))
      getAgents()
    }
  }

  

  // get a single doc
  const [singleDoc, setSingleDoc] = useState(fields);
  const getSingleAgent = async (id) => setSingleDoc(agents.filter(agent => agent.uid == id)[0])
    
  // actions context
  const [showContext, setShowContext] = useState(false)
  window.onclick = function(event) {
      if (!event.target.matches('.sharebtn')) {
          setShowContext(false)
      }
  }

  const [clickedIndex, setClickedIndex] = useState(null)

  // filter
  const [ switchCategory, setSwitchCategory ] = useState(null)
  const shownAgents = !agents || currentAgents.filter(agent => !switchCategory || agent.role[switchCategory])

  const paginatedShownAgent = !agents || shownAgents.slice(indexOfFirstAgent, indexOfLastAgent)

    return (
        <div className='components'>
            <Header title="Agents" subtitle="MANAGING AGENTS" />
   
            <div id="add_client_group">
                <div></div>
                {authClaims.supervisor && 
                  <Link to="/supervisor/add-agents">
                      <button className="btn btn-primary cta">Add Agent</button>
                  </Link>
                }
                {authClaims.admin && 
                  <Link to="/admin/add-agent">
                      <button className="btn btn-primary cta">Add Agent</button>
                  </Link>
                }
            </div>

            <Modal show={open} onHide={handleClose}>
              <ClientModal singleDoc={singleDoc} fields={fields} handleFieldChange={handleFieldChange} handleClose={handleClose} />
            </Modal>

            {agents !== null && agents.length > 0
            ?
              <>
                <div className="shadow-sm table-card componentsData">   
                <div id="search">
                  <SearchBar placeholder={"Search for agent's name"} value={searchText} handleSearch={handleSearch}/>
                  <div></div>
                  <Form.Group className="m-3 categories" width="180px">
                        <Form.Select aria-label="User role" id='category' onChange={({target: {value}}) => setSwitchCategory(value)}>
                            <option value={""}>Filter by category</option>
                            <option value="mtp">MTP</option>
                            <option value="comprehensive">Comprehensive</option>
                            <option value="windscreen">Windscreen</option>
                            <option value="newImports">New Imports</option>
                            <option value="transit">Transit</option>
                        </Form.Select>
                    </Form.Group>
                </div>

                

                  {paginatedShownAgent.length > 0
                  ?
                    <>
                      <Table hover striped responsive>
                        <thead>
                            <tr><th><input type="checkbox" onChange={handleAllCheck}/></th><th>Name</th><th>Email</th><th>Category</th><th>Gender</th><th>Contact</th><th>Address</th>{authClaims.admin && <th>Added by</th>}<th>Action</th></tr>
                        </thead>
                        <tbody>
                          {paginatedShownAgent.map((agent, index) => (
                              <tr key={agent.uid}>
                              <td><input type="checkbox" id='firstAgentCheckbox' className='agentCheckbox' onChange={({target}) => target.checked ? setDeleteArray([ ...deleteArray, agent.uid]) : 
                              setDeleteArray(deleteArray.filter(element => element !== agent.uid))
                            }/></td>
                              <td>{agent.name}</td>
                              <td>{agent.email}</td>
                              <td>
                                {agent.role.mtp && <div>MTP</div>}
                                {agent.role.comprehensive && <div>Comprehensive</div>}
                                {agent.role.windscreen && <div>Windscreen</div>}
                                {agent.role.newImport && <div>New Import</div>}
                                {agent.role.transit && <div>Transit</div>}
                              </td>
                              <td>{agent.meta.gender}</td>
                              <td>{agent.meta.phone}</td>
                              <td>{agent.meta.address}</td>
                              {authClaims.admin && <td>{agent.meta.added_by_name}</td>}
                              <td className="started">
                                <button className="sharebtn" onClick={() => {setClickedIndex(index); setShowContext(!showContext)}}>&#8942;</button>

                                <ul  id="mySharedown" className={(showContext && index === clickedIndex) ? 'mydropdown-menu show': 'mydropdown-menu'} onClick={(event) => event.stopPropagation()}>
                                <li onClick={() => {handleShow(); setShowContext(false)}} 
                                              > 
                                                <div className="actionDiv">
                                                    <i><MdDetails /></i>Details
                                                </div>
                                            </li>
                                            <Modal show={open} onHide={handleClose}>
                                              <Modal.Header closeButton>
                                                <Modal.Title>{`${agent.name}'s details.`}</Modal.Title>
                                              </Modal.Header>
                                              <Modal.Body>
                                                <Details totalStickers={stickers} totalClaims={claims} settledClaims={settledClaims}/>
                                              </Modal.Body>
                                              {/* <Modal.Footer><button onClick={handleClose}>Close</button></Modal.Footer> */}
                                            </Modal>
                                            <li onClick={() => {
                                                    setShowContext(false)
                                                    // setEditID(agent.uid);
                                                    getSingleAgent(agent.uid)
                                                    handleShow(); 
                                                    console.log(agent.uid)
                                                  }}
                                                >
                                                  <div className="actionDiv">
                                                    <i><MdEdit/></i> Edit
                                                  </div>
                                            </li>
                                            <li onClick={() => {
                                                        setShowContext(false)
                                                        const confirmBox = window.confirm(
                                                          `Are you sure you want to ${agent.name}`
                                                        );
                                                        if (confirmBox === true) {
                                                          handleDelete(agent.uid)
                                                        }
                                                      }}
                                                >
                                                  <div className="actionDiv">
                                                    <i><MdDelete/></i> Delete
                                                  </div>
                                            </li>
                                            <li onClick={() => setShowContext(false)}
                                                >
                                                  <div className="actionDiv">
                                                    <i><AiFillCloseCircle/></i> Close
                                                  </div>
                                            </li>
                                </ul>
                              </td>
                          </tr>
                          ))}
                        </tbody>

                        <tfoot>
                          <tr style={{border: "1px solid white", borderTop: "1px solid #000"}}>
                            <td colSpan={3}>
                              <div style={{display: "flex"}}>
                                <Form.Select aria-label="User role" id='category' onChange={(event) => setBulkDelete(event.target.value)}>
                                    <option value="">Bulk Action</option>
                                    <option value="delete">Delete</option>
                                </Form.Select>
                                <button className='btn btn-primary cta mx-2' onClick={handleBulkDelete}>Apply</button>
                              </div>
                            </td>
                            <td colSpan={4}>
                              <Pagination 
                              pages={totalPagesNum}
                              setCurrentPage={setCurrentPage}
                              currentClients={currentAgents}
                              sortedEmployees={agents}
                              entries={'Agents'} />
                            </td>
                          </tr>
                        </tfoot>

                        <tfoot>
                            <tr><th></th><th>Name</th><th>Email</th><th>Category</th><th>Gender</th><th>Contact</th><th>Address</th>{authClaims.admin && <th>Added by</th>}<th>Action</th></tr>
                        </tfoot>
                    </Table>
                    </>
                  :
                  <div className="no-table-data">
                    <i><ImFilesEmpty /></i>
                    <h4>No match</h4>
                    <p>There is no match for current search</p>
                  </div>
                  }

                  

                  

               
            </div>
              </>
            :
              agents === null
              ?
                <div className="no-table-data">
                  <i><ImFilesEmpty /></i>
                  <h4>No data yet</h4>
                  <p>You have not added any client Yet</p>
                </div>
              :
                <Loader />
            }

              
        </div>
    )
}

export default Agents
