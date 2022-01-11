import useAuth from '../contexts/Auth'
import NotLoggedIn from '../pages/NotLoggedIn'
import Login from '../pages/Login'
import Logout from '../pages/Logout'
import ForgotPassword from '../pages/ForgotPassword'
import { useState, useEffect } from 'react'

//different user roles routes
import SuperAdminRoutes from './SuperAdminRoutes'
import AdminRoutes from './AdminRoutes'
import SupervisorRoutes from './SupervisorRoutes'
import AgentsRoutes from './AgentsRoutes'

//different menus for different roles
import AdminMenu from '../pages/admin/AdminMenu'
import SupervisorMenu from '../pages/supervisor/SupervisorMenu'
import AgentMenu from '../pages/agent/AgentMenu'
import SuperAdminMenu from '../pages/superAdmin/SuperAdminMenu'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function MyRouter() {

    useEffect(() => {
        localStorage.getItem('user')
    }, [])

    const {currentUser, authClaims, user } = useAuth()
    const [ largeContentClass, setLargeContentClass ] = useState(false)


    return (
        <Router>
            <div className={largeContentClass ? 'top-container-large': `top-container` }>
                {currentUser?.loggedIn && 
                <>
                <div className='MenuSide'>
                    {authClaims?.admin && <AdminMenu setLargeContentClass={setLargeContentClass} largeContentClass={largeContentClass} />}
                    {authClaims?.supervisor && <SupervisorMenu setLargeContentClass={setLargeContentClass} largeContentClass={largeContentClass} />}
                    {authClaims?.agent && <AgentMenu setLargeContentClass={setLargeContentClass} largeContentClass={largeContentClass} />}
                    {authClaims?.superadmin && <SuperAdminMenu setLargeContentClass={setLargeContentClass} largeContentClass={largeContentClass} />}
                </div>
                    <main className='displayLeft'>
                        <AdminRoutes />
                        <SupervisorRoutes />
                        <AgentsRoutes />
                        <SuperAdminRoutes />
                    </main>
                </>
                }
                <Switch >
                    <Route path="/forgot-password" component={ForgotPassword} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/not-logged-in" component={NotLoggedIn} />
                    <Route path="/login" component={Login} />
                    <Route path="/" exact component={Login} />     
                </Switch>
            </div>
        </Router>
    )
}

export default MyRouter
