import { MdAccountBalance, MdBusinessCenter, MdDirectionsCarFilled, MdAirlineSeatReclineExtra, MdAssessment, MdPeople, MdPerson, MdSettings } from 'react-icons/md'

const menuData = {
    SuperAdmin: [
        {
            number: 1,
            name: "Dashboard",
            icon: <MdAccountBalance />,
            link: "/superadmin/dashboard"
        },
        {
            number: 2,
            name: "Clients",
            icon: <MdPerson />,
            link: "/superadmin/clients"
        },
        {
            number: 3,
            name: "User Management",
            icon: <MdPeople />,
            link: "/superadmin/user-management",
            subMenu: [
                {
                    name: "Agents",
                    link: "/superadmin/agents"
                },
                {
                    name: "Supervisors",
                    link: "/superadmin/supervisors"
                },
                {
                    name: "Admins",
                    link: "/superadmin/admins"
                },
                {
                    name: "Add Users",
                    link: "/add-user"
                },
                {
                    name: "View Log Trail",
                    link: "/superadmin/view-log-trail"
                }
            ]
        },
        {
            number: 4,
            name: "Policies",
            icon: <MdDirectionsCarFilled />,
            link: "/superadmin/policies",
            subMenu: [
                {
                    name: "MTP",
                    link: "/superadmin/motor-third-party"
                },
                {
                    name: "Windscreen",
                    link: "/superadmin/windscreen"
                },
                {
                    name: "Comprehensive",
                    link: "/superadmin/comprehensive"
                }
            ]
        },
        {
            number: 5,
            name: "Claims",
            icon: <MdAirlineSeatReclineExtra />,
            link: "/superadmin/claims"
        },
        {
            number: 6,
            name: "Reports",
            icon: <MdAssessment />,
            link: "/superadmin/reports"
        }
    ],
    Admin: [
        {
            number: 1,
            name: "Dashboard",
            icon: <MdAccountBalance />,
            link: "/admin/dashboard"
        },
        {
            number: 2,
            name: "Organisations",
            icon: <MdBusinessCenter />,
            link: "/admin/organisations"
        },
        {
            number: 3,
            name: "Clients",
            icon: <MdPerson />,
            link: "/admin/clients"
        },
        {
            number: 4,
            name: "Sticker No. Management",
            icon: <MdPerson />,
            link: "/admin/sticker-management"
        },
        {
            number: 5,
            name: "User Management",
            icon: <MdPeople />,
            link: "/admin/user-management",
            subMenu: [
                {
                    name: "Agents",
                    link: "/admin/agents"
                },
                {
                    name: "Supervisor",
                    link: "/admin/supervisor"
                },
                {
                    name: "Add Users",
                    link: "/add-user"
                },
                {
                    name: "View Log Trail",
                    link: "/admin/view-log-trail"
                }
            ]
        },
        {
            number: 6,
            name: "Policies",
            icon: <MdDirectionsCarFilled />,
            link: "/admin/policies",
            subMenu: [
                {
                    name: "MTP",
                    link: "/admin/motor-third-party"
                },
                {
                    name: "Windscreen",
                    link: "/admin/windscreen"
                },
                {
                    name: "Comprehensive",
                    link: "/admin/comprehensive"
                }
            ]
        },
        {
            number: 7,
            name: "Claims",
            icon: <MdAirlineSeatReclineExtra />,
            link: "/admin/claims"
        },
        {
            number: 8,
            name: "Reports",
            icon: <MdAssessment />,
            link: "/admin/reports"
        }
    ],
    SuperVisor: [
        {
            number: 1,
            name: "Dashboard",
            icon: <MdAccountBalance />,
            link: "/supervisor/dashboard"
        },
        {
            number: 2,
            name: "Clients",
            icon: <MdPerson />,
            link: "/supervisor/clients"
        },
        {
            number: 3,
            name: "User Management",
            icon: <MdPeople />,
            link: "/supervisor/user-management",
            subMenu: [
                {
                    name: "Agents",
                    link: "/supervisor/agents"
                },
                {
                    name: "Add Users",
                    link: "/add-user"
                },
                {
                    name: "View Log Trail",
                    link: "/supervisor/view-log-trail"
                }
            ]
        },
        {
            number: 4,
            name: "Policies",
            icon: <MdDirectionsCarFilled />,
            link: "/supervisor/policies",
            subMenu: [
                {
                    name: "MTP",
                    link: "/supervisor/motor-third-party"
                },
                {
                    name: "Windscreen",
                    link: "/supervisor/windscreen"
                },
                {
                    name: "Comprehensive",
                    link: "/supervisor/comprehensive"
                }
            ]
        },
        {
            number: 5,
            name: "Claims",
            icon: <MdAirlineSeatReclineExtra />,
            link: "/supervisor/claims"
        },
        {
            number: 6,
            name: "Reports",
            icon: <MdAssessment />,
            link: "/supervisor/reports"
        }
    ],
    Agent: [
        {
            number: 1,
            name: "Dashboard",
            icon: <MdAccountBalance />,
            link: "/agent/dashboard",
            head: "Britam - Dashboard"
        },
        {
            number: 2,
            name: "Clients",
            icon: <MdPerson />,
            link: "/agent/clients"
        },
        {
            number: 3,
            name: "User Management",
            icon: <MdPeople />,
            link: "/agent/view-log-trail"
        },
        {
            number: 4,
            name: "Policies",
            icon: <MdDirectionsCarFilled />,
            link: null,
            subMenu: [
                {
                    name: "MTP",
                    link: "/agent/motor-third-party"
                },
                {
                    name: "Windscreen",
                    link: "/agent/windscreen"
                },
                {
                    name: "Comprehensive",
                    link: "/agent/comprehensive"
                }
            ]
        },
        {
            number: 5,
            name: "Claims",
            icon: <MdAirlineSeatReclineExtra />,
            link: "/agent/claims"
        },
        {
            number: 6,
            name: "Reports",
            icon: <MdAssessment />,
            link: "/agent/reports"
        },
        {
            number: 7,
            name: "Account Settings",
            icon: <MdSettings />,
            link: "/agent/settings"
        }
    ]
}


export default menuData;

