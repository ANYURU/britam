import { MdAccountBalance, MdBusinessCenter, MdDirectionsCarFilled, MdAirlineSeatReclineExtra, MdAssessment, MdPeople, MdPerson, MdSettings } from 'react-icons/md'
import { RiCalendarTodoFill } from 'react-icons/ri'

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
            name: "Admins",
            icon: <MdPerson />,
            link: "/superadmin/admins"
        },
        {
            number: 3,
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
                },
                {
                    name: "New imports",
                    link: "/superadmin/new-import"
                },
                {
                    name: "Transit",
                    link: "/superadmin/transit"
                }
            ]
        },
        {
            number: 4,
            name: "Claims",
            icon: <MdAirlineSeatReclineExtra />,
            link: "/superadmin/claims"
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
            name: "Sticker No.",
            icon: <MdPerson />,
            link: "/admin/sticker-management"
        },
        {
            number: 5,
            name: "Users",
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
                    name: "Log Trail",
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
                    name: "Comprehensive",
                    link: "/admin/comprehensive"
                },
                {
                    name: "Windscreen",
                    link: "/admin/windscreen"
                },
                {
                    name: "New imports",
                    link: "/admin/new-import"
                },
                {
                    name: "Transit",
                    link: "/admin/transit"
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
            link: "/admin/reports",
            subMenu: [
                {
                    name: "Daily",
                    link: "/admin/daily-reports"
                },
                {
                    name: "Weekly",
                    link: "/admin/weekly-reports"
                },
                {
                    name: "Monthly",
                    link: "/admin/monthly-reports"
                },
                {
                    name: "Status Reports (new,paid,expired,cancelled, deleted)",
                    link: "/admin/reports"
                }
            ]
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
            name: "Users",
            icon: <MdPeople />,
            link: "/supervisor/agents",
            subMenu: [
                {
                    name: "Agents",
                    link: "/supervisor/agents"
                },
                {
                    name: "Log Trail",
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
                    name: "Comprehensive",
                    link: "/supervisor/comprehensive"
                },
                {
                    name: "Windscreen",
                    link: "/supervisor/windscreen"
                },
                {
                    name: "New imports",
                    link: "/supervisor/new-import"
                },
                {
                    name: "Transit",
                    link: "/supervisor/transit"
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
            link: "/agent/dashboard"
        },
        {
            number: 2,
            name: "Clients",
            icon: <MdPerson />,
            link: "/agent/clients"
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
                },
                {
                    name: "New imports",
                    link: "/agent/new-import"
                },
                {
                    name: "Transit",
                    link: "/agent/transit"
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
            number: 3,
            name: "Log Trails",
            icon: <RiCalendarTodoFill />,
            link: "/agent/view-log-trail"
        },
        {
            number: 6,
            name: "Reports",
            icon: <MdAssessment />,
            link: "/agent/reports"
        }
    ]
}


export default menuData;

