import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Pagination from '../helpers/Pagination'
import SearchBar from '../components/searchBar/SearchBar'
import { Table, Form } from 'react-bootstrap'
import { addDoc, getDoc, getDocs, collection, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { authentication, db, functions } from '../helpers/firebase'
import { currencyFormatter } from "../helpers/currency.format";
import { MdInfo, MdAutorenew, MdCancel, MdDelete } from 'react-icons/md'
import useAuth from '../contexts/Auth'
import Loader from '../components/Loader'
import { ImFilesEmpty } from 'react-icons/im'
import '../components/modal/ConfirmBox.css'
import { httpsCallable } from 'firebase/functions';

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Chat from '../components/messenger/Chat'
import '../styles/ctas.css'

export default function Mtp() {
  useEffect(() => { document.title = "Britam - Windscreen"; getMTP()}, []);

  
  // policies
  const { authClaims } = useAuth()
  const [policies, setPolicies] = useState([])
  const policyCollectionRef = collection(db, "policies");
  // initialising the logs collection.
  const logCollectionRef = collection(db, "logs");

  const [ singleDoc, setSingleDoc ] = useState(null)

  // getting mtps under a particular user.
  const getMTP = async () => {
    const data = await getDocs(policyCollectionRef);
    const policiesArray = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    const mtpPolicies = policiesArray.filter(policy => policy.category === 'windscreen').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    // agent mtp policies
    if(authClaims.agent){
      const agentMtpPolicies = mtpPolicies.filter(policy => policy.added_by_uid === authentication.currentUser.uid)
      agentMtpPolicies.length === 0 ? setPolicies(null) : setPolicies(agentMtpPolicies)
    }

    // supervisor mtp policies
    if(authClaims.supervisor){
      const listUsers = httpsCallable(functions, 'listUsers')
      listUsers().then(({data}) => {
        const myAgents = data.filter(user => user.role.agent === true).filter(agent => agent.meta.added_by_uid === authentication.currentUser.uid).map(agentuid => agentuid.uid)
        
        const usersUnderSupervisor = [ ...myAgents, authentication.currentUser.uid]

        const supervisorMtpPolicies = mtpPolicies.filter(policy => usersUnderSupervisor.includes(policy.added_by_uid))
        supervisorMtpPolicies.length === 0 ? setPolicies(null) : setPolicies(supervisorMtpPolicies)
      })
    }

    // supervisor mtp policies
    if(authClaims.admin){
      const listUsers = httpsCallable(functions, 'listUsers')
      listUsers().then(({data}) => {
        const myAgents = data.filter(user => user.role.agent === true).filter(agent => agent.meta.added_by_uid === authentication.currentUser.uid).map(agentuid => agentuid.uid)

        const mySupervisors = data.filter(user => user.role.supervisor === true).filter(supervisor => supervisor.meta.added_by_uid === authentication.currentUser.uid).map(supervisoruid => supervisoruid.uid)

        const agentsUnderMySupervisors = data.filter(user => user.role.agent === true).filter(agent => mySupervisors.includes(agent.meta.added_by_uid)).map(agentuid => agentuid.uid)
        
        const usersUnderAdmin = [ ...myAgents, ...agentsUnderMySupervisors, ...mySupervisors, authentication.currentUser.uid]

        console.log(usersUnderAdmin)

        const AdminMtpPolicies = mtpPolicies.filter(policy => usersUnderAdmin.includes(policy.added_by_uid))
        AdminMtpPolicies.length === 0 ? setPolicies(null) : setPolicies(AdminMtpPolicies)
      })
    }

    // superAdmin mtp policies
    if(authClaims.superadmin){
      mtpPolicies.length === 0 ? setPolicies(null) : setPolicies(mtpPolicies)
    }
    
  }

  // Confirm Box
  const [ openToggle, setOpenToggle ] = useState(false)
  const [ openToggleCancel, setOpenToggleCancel ] = useState(false)
  window.onclick = (event) => {
    if(openToggleCancel || openToggle) {
      if (!event.target.matches('.wack') && !event.target.matches('#myb')) { 
        setOpenToggleCancel(false)
        setOpenToggle(false)
    }
    }
  }


  // search by Name
  const [searchText, setSearchText] = useState('')
  const handleSearch = ({ target }) => setSearchText(target.value);
  const searchByName = (data) => data.filter(row => row.clientDetails).filter(row => row.clientDetails.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1)

  // delete a policy
  const handleDelete = async () => {
    const policyDoc = doc(db, "policies", singleDoc.id);

    await deleteDoc(policyDoc)
      .then(() => toast.success(`Successfully deleted ${singleDoc.clientDetails.name}'s sticker`, {position: "top-center"}))
      .then(async () => {
        await addDoc(logCollectionRef, {
          timeCreated: `${new Date().toISOString().slice(0, 10)} ${ new Date().getHours()}:${ new Date().getMinutes()}:${ new Date().getSeconds()}`,
          type: 'sticker deletion',
          status: 'successful',
          message: `Successfully deleted ${singleDoc.clientDetails.name}'s sticker by ${authentication.currentUser.displayName}`
        })
      })
      .catch(async() => {
        toast.error(`Failed to deleted ${singleDoc.clientDetails.name}'s claim`, {position: "top-center"});
        await addDoc(logCollectionRef, {
          timeCreated: `${new Date().toISOString().slice(0, 10)} ${ new Date().getHours()}:${ new Date().getMinutes()}:${ new Date().getSeconds()}`,
          type: 'sticker deletion',
          status: 'failed',
          message: `Failed to delete ${singleDoc.clientDetails.name}'s sticker by ${authentication.currentUser.displayName}`
        })
      })

      getMTP()
    
  }

  // delete multiple policies
  const handleMultipleDelete = async (arr) => {
    const policyDoc = doc(db, "policies", arr[0]);

    await deleteDoc(policyDoc)
      .then(() => toast.success(`Successfully deleted ${arr[1]}'s sticker`, {position: "top-center"}))
      .then(async () => {
        await addDoc(logCollectionRef, {
          timeCreated: `${new Date().toISOString().slice(0, 10)} ${ new Date().getHours()}:${ new Date().getMinutes()}:${ new Date().getSeconds()}`,
          type: 'sticker deletion',
          status: 'successful',
          message: `Successfully deleted ${arr[1]}'s sticker by ${authentication.currentUser.displayName}`
        })
      })
      .catch(async() => {
        toast.error(`Failed to deleted ${arr[1]}'s claim`, {position: "top-center"});
        await addDoc(logCollectionRef, {
          timeCreated: `${new Date().toISOString().slice(0, 10)} ${ new Date().getHours()}:${ new Date().getMinutes()}:${ new Date().getSeconds()}`,
          type: 'sticker deletion',
          status: 'failed',
          message: `Failed to delete ${arr[1]}'s sticker by ${authentication.currentUser.displayName}`
        })
      })

      getMTP()
    
  }

  // cancel a policy
  const handleCancel = async () => {
  const policyRef = doc(db, "policies", singleDoc.id)
  const data = await getDoc(policyRef);
  const policy = data.data()
  await updateDoc(policyRef, {
    stickersDetails: [{
      basicPremium: "",
      category: policy.stickersDetails[0].category,
      ccPower: policy.stickersDetails[0].ccPower,
      chasisNo: policy.stickersDetails[0].chasisNo,
      grossWeight: policy.stickersDetails[0].grossWeight,
      motorClass: policy.stickersDetails[0].motorClass,
      motorMake: policy.stickersDetails[0].motorMake,
      plateNo: policy.stickersDetails[0].plateNo,
      referenceNo: policy.stickersDetails[0].referenceNo,
      seatingCapacity: policy.stickersDetails[0].seatingCapacity,
      stampDuty: policy.stickersDetails[0].stampDuty,
      status: "cancelled",
      stickerFee: policy.stickersDetails[0].stickerFee,
      totalPremium: policy.stickersDetails[0].totalPremium,
      trainingLevy: policy.stickersDetails[0].trainingLevy,
      vat: policy.stickersDetails[0].vat,
      vehicleUse: policy.stickersDetails[0].vehicleUse

  }]
  });
    toast.success('Successfully Cancelled', {position: "top-center"});
  }

  const handleAllCheck = () => {
    if(document.getElementById("firstAgentCheckbox").checked === true){
      Object.values(document.getElementsByClassName("agentCheckbox")).map(checkbox => checkbox.checked = false)
      setDeleteArray([])
    } else{
      Object.values(document.getElementsByClassName("agentCheckbox")).map(checkbox => checkbox.checked = true)
      setDeleteArray(policies.map(policy => [policy.id, policy.clientDetails.name]))
    }
  }

  // delete multiple agents
  const [ bulkDelete, setBulkDelete ] = useState(null)
  const [ deleteArray, setDeleteArray ] = useState([])
  const handleBulkDelete = async () => {
    if(bulkDelete){
      deleteArray.map(policy=> handleMultipleDelete(policy))
    }
  }

  // actions context
  const [showContext, setShowContext] = useState(false)
  if(showContext === true){
    window.onclick = function(event) {
        if (!event.target.matches('.sharebtn')) {
            setShowContext(false)
        }
    }
  }
  const [clickedIndex, setClickedIndex] = useState(null)

  const [ deleteName, setDeleteName ] = useState('')
  const getPolicy = async (id) => {
    const policyDoc = doc(db, "policies", id);
    await getDoc(policyDoc)
      .then(result => {
        return result.data().clientDetails.name
      })
      .catch(error => {
        console.log(error)
      })
  }

  // pagination
  const [ currentPage, setCurrentPage ] = useState(1)
  const [policiesPerPage] = useState(10)

  const indexOfLastPolicy = currentPage * policiesPerPage
  const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage
  const currentPolicies = !policies || searchByName(policies)
  const totalPagesNum = !policies || Math.ceil(policies.length / policiesPerPage)

  // filter
  const [ switchCategory, setSwitchCategory ] = useState(null)
  const shownPolicies = !policies || currentPolicies.filter(policy => !switchCategory || policy.stickersDetails[0].status === switchCategory)

  const paginatedShownPolicies = !policies || shownPolicies.slice(indexOfFirstPolicy, indexOfLastPolicy)

  console.log(deleteArray)


  return (
    <div className="components">
      <Header title="Windscreen" subtitle="MANAGING WINDSCREEN POLICIES" />
      <ToastContainer/>
      {authClaims.supervisor &&
        <div id="add_client_group">
          <div></div>
          <Link to="/supervisor/add-windscreen" className="classic">
            <button className="btn btn-primary cta">Add Windscreen</button>
          </Link>
        </div>
      }

      {authClaims.agent &&
        <div id="add_client_group">
          <div></div>
          <Link to="/agent/add-windscreen" className="classic">
            <button className="btn btn-primary cta">Add Windscreen</button>
          </Link>
        </div>
      }

      <div className={openToggle ? 'myModal is-active': 'myModal'}>
        <div className="modal__content wack">
          <h1 className='wack'>Confirm</h1>
          <p className='wack'>Are you sure you want to delete <b>{!singleDoc || singleDoc.clientDetails.name}</b></p>
          <div className="buttonContainer wack" >
            <button id="yesButton" onClick={() => {
              setOpenToggle(false)
              handleDelete()
              getMTP()
              }} className='wack'>Yes</button>
            <button id="noButton" onClick={() => setOpenToggle(false)} className='wack'>No</button>
          </div>
        </div>
      </div>

      <div className={openToggleCancel ? 'myModal is-active': 'myModal'}>
        <div className="modal__content wack">
          <h1 className='wack'>Confirm</h1>
          <p className='wack'>Are you sure you want to cancel <b>{!singleDoc || singleDoc.clientDetails.name}</b></p>
          <div className="buttonContainer wack" >
            <button id="yesButton" onClick={() => {
              setOpenToggleCancel(false)
              handleCancel()
              getMTP()
              }} className='wack'>Yes</button>
            <button id="noButton" onClick={() => setOpenToggleCancel(false)} className='wack'>No</button>
          </div>
        </div>
      </div>

      {policies !== null && policies.length > 0 
      ?
        <>
        <div className="table-card componentsData shadow-sm">
        <div id="search">
          <SearchBar placeholder={"Search Policy by name"} value={searchText} handleSearch={handleSearch}/>
          <div></div>
          <Form.Group className="m-3 categories" width="200px">
            <Form.Select aria-label="User role" id='category' onChange={({target: {value}}) => setSwitchCategory(value)}>
                <option value={""}>Filter by status</option>
                <option value="new">New</option>
                <option value="paid">Paid</option>
                <option value="renewed">Renewed</option>
                <option value="expired">Expired</option>
                <option value="deleted">Deleted</option>
                <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </div>

        {shownPolicies.length > 0
         ?
         <Table striped hover responsive>
         <thead>
             <tr><th><input type="checkbox" onChange={handleAllCheck}/></th><th>Client</th><th>Category</th><th>Amount</th><th>Currency</th>
             {!authClaims.agent && <th>Agent</th>}
             <th>Status</th><th>CreatedAt</th><th>Action</th></tr>
         </thead>
         <tbody>
             {paginatedShownPolicies.map((policy, index) => (
               <tr key={policy.id}>
                 <td><input type="checkbox" id='firstAgentCheckbox' className='agentCheckbox' onChange={({target}) => target.checked ? setDeleteArray([ ...deleteArray, [policy.id, policy.clientDetails.name]]) : 
                   setDeleteArray(deleteArray.filter(element => element[0] !== policy.id))
                 }/></td>
                 {policy.clientDetails && <td>{policy.clientDetails.name}</td>}
                 {policy.stickersDetails && <td>{policy.stickersDetails[0].category}</td>}
                 <td><b>{currencyFormatter(policy.stickersDetails[0].totalPremium)}</b></td>
                 <td>{typeof policy.currency == "string" ? policy.currency : ''}</td>
                 {!authClaims.agent && <td>{policy.added_by_name}</td>}
                 <td>
                   {policy.stickersDetails[0].status === 'new'  && 
                      <span
                        style={{backgroundColor: "#337ab7", padding: ".4em .6em", borderRadius: ".25em", color: "#fff", fontSize: "85%"}}
                      >{policy.stickersDetails[0].status}</span>
                   }
                   {policy.stickersDetails[0].status === 'paid'  && 
                      <span
                        style={{backgroundColor: "#3EC089", padding: ".4em .6em", borderRadius: ".25em", color: "#fff", fontSize: "85%"}}
                      >paid</span>
                   }
                   {policy.stickersDetails[0].status === 'renewed'  && 
                      <span
                        style={{backgroundColor: "#337ab7", padding: ".4em .6em", borderRadius: ".25em", color: "#fff", fontSize: "85%"}}
                      >{policy.stickersDetails[0].status}</span>
                   }
                   {policy.stickersDetails[0].status === 'cancelled'  && 
                      <span
                        style={{backgroundColor: "#ffc107", padding: ".4em .6em", borderRadius: ".25em", color: "#fff", fontSize: "85%"}}
                      >{policy.stickersDetails[0].status}</span>
                   }
                   {policy.stickersDetails[0].status === 'expired'  && 
                      <span
                        style={{backgroundColor: "#dc3545", padding: ".4em .6em", borderRadius: ".25em", color: "#fff", fontSize: "85%"}}
                      >{policy.stickersDetails[0].status}</span>
                   }
                 </td>
                 <td>{policy.policyStartDate}</td>

                 <td className="started">
                 <button className="sharebtn" onClick={() => {setClickedIndex(index); setShowContext(!showContext); setSingleDoc(policy); console.log(getPolicy(policy.id))}}>&#8942;</button>

                 <ul  id="mySharedown" className={(showContext && index === clickedIndex) ? 'mydropdown-menu show': 'mydropdown-menu'} onClick={(event) => event.stopPropagation()}>
                   <Link to={`/admin/policy-details/${policy.id}`}>
                     <div className="actionDiv">
                       <i><MdInfo /></i> Details
                     </div>
                   </Link>
                   <Link to={`/admin/policy-renew/${policy.id}`}>
                     <div className="actionDiv">
                       <i><MdAutorenew /></i> Renew
                     </div>
                   </Link>
                   <li onClick={() => {
                                 setOpenToggleCancel(true)
                                 setShowContext(false)
                               }}>
                     <div className="actionDiv">
                       <i><MdCancel /></i> Cancel
                     </div>
                   </li>
                   <li 
                         onClick={() => {
                                 setOpenToggle(true)
                                 setShowContext(false)
                               }}
                       >
                         <div className="actionDiv">
                           <i><MdDelete/></i> Delete
                         </div>
                   </li>
                 </ul>
                 </td>
         
               </tr>
             ))}
         </tbody>

         <tfoot>
         <tr style={{border: "1px solid white", borderTop: "1px solid #000"}}>
             
           <td colSpan={3} style={{paddingLeft: 0}}>
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
               currentClients={paginatedShownPolicies}
               sortedEmployees={policies}
               entries={'Windscreen'} />
             </td>
           </tr>
         </tfoot>

         <tfoot>
             <tr><td></td><th>Client</th><th>Category</th><th>Amount</th><th>Currency</th>
             {!authClaims.agent && <th>Agent</th>}
             <th>Status</th><th>CreatedAt</th><th>Action</th></tr>
         </tfoot>
       </Table>
         :
          <div className="no-table-data">
              <i><ImFilesEmpty /></i>
              <h4>No match</h4>
              <p>There is no current match for Windscreen sticker</p>
          </div>
        }

        

        

        </div>
        </>
      :
        policies === null
        ?
          <div className="no-table-data">
            <i><ImFilesEmpty /></i>
            <h4>No data yet</h4>
            <p>You have not created any Windscreen Stickers Yet</p>
          </div>
        :
          <Loader />
      }
      <div style={{width:"100%", position:"fixed", bottom:"0px", display:"flex", justifyContent:"flex-end"}} className="chat-container">
        <Chat />
      </div>     
    </div>
  );
}
