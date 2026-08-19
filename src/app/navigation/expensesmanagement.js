import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'
import { ChartBarIcon } from 'lucide-react';


const ROOT_DASHBOARDS = '/expensesmanagement'

const path = (root, item) => `${root}${item}`;

export const expensesmanagement = {
    id: 'expensesmanagement',
    type: NAV_TYPE_ROOT,
    role: 900000,
    path: '/expensesmanagement',
    title: 'Expenses Management',
    Icon: CurrencyDollarIcon,
    childs: [

        {
            id: 'expensesmanagement.expenses',
            path: path(ROOT_DASHBOARDS, '/expenses'),
            type: NAV_TYPE_ITEM,
            role: 900001,
            title: ' My Expenses',
            Icon: ChartBarIcon,
        },

       

        {
            id: 'expensesmanagement.userexpenses',
            path: path(ROOT_DASHBOARDS, '/userexpenses'),
            type: NAV_TYPE_ITEM,
            role: 600000,
            title: 'Users Expenses',
            Icon: ChartBarIcon,
        },

        {
            id: 'expensesmanagement.pendingexpenses',
            path: path(ROOT_DASHBOARDS, '/pending-expenses'),
            type: NAV_TYPE_ITEM,
            role: 900012,
            title: 'Pending Expenses',
            Icon: ChartBarIcon,
        },
        {
            id: 'expensesmanagement.readyforapproval',
            path: path(ROOT_DASHBOARDS, '/readyforapproval'),
            type: NAV_TYPE_ITEM,
            role: 610000,
            title: 'Ready For Approval',
            Icon: ChartBarIcon,
        },
        
        {
            id: 'expensesmanagement.approved ',
            type: NAV_TYPE_ITEM,
            role: 610001,
            path: path(ROOT_DASHBOARDS, '/approved'),
            title: 'Approved Expenses',
            Icon: ChartBarIcon,

        },

        {
            id: 'expensesmanagement.paid ',
            type: NAV_TYPE_ITEM,
            role: 610002,
            path: path(ROOT_DASHBOARDS, '/paid'),
            title: 'Paid Expenses',
            Icon: ChartBarIcon,
            
        },
        {
            id: 'expensesmanagement.rejectedexpenses',
            path: path(ROOT_DASHBOARDS, '/rejected-expenses'),
            type: NAV_TYPE_ITEM,
            role: 900011,
            title: 'Rejected Expenses',
            Icon: ChartBarIcon,
        },

         {
            id: 'expensesmanagement.expensereport',
            path: path(ROOT_DASHBOARDS, '/expensesreport'),
            type: NAV_TYPE_ITEM,
            role: 500000,
            title: 'Expense Report',
            Icon: ChartBarIcon,
        },
        
          {
            id: 'expensesmanagement.billReport ',
            type: NAV_TYPE_ITEM,
            role: 500001,
            path: path(ROOT_DASHBOARDS, '/bill-report'),
            title: 'Bill Report',
            Icon: ChartBarIcon,

        },
        {
            id: 'expensesmanagement.approverPending ',
            type: NAV_TYPE_ITEM,
            role: 610003,
            path: path(ROOT_DASHBOARDS, '/approver-pending'),
            title: 'Approver Pending',
            Icon: ChartBarIcon,

        },

    ]
}

