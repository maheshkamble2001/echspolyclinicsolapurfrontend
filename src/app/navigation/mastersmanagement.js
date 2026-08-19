import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'
import { ChartBarIcon, Layers } from 'lucide-react';


const ROOT_DASHBOARDS = '/mastersmanagement'

const path = (root, item) => `${root}${item}`;

export const masters = {
    id: 'mastersmanagement',
    type: NAV_TYPE_ROOT,
    role: 800000,
    path: '/mastersmanagement',
    title: 'Masters Management',
    Icon: Layers ,
    childs: [
        {
            id: 'mastersmanagement.groups',
            path: path(ROOT_DASHBOARDS, '/expense-groups'),
            type: NAV_TYPE_ITEM,
            role: 800001,
            title: 'Groups Management',
            Icon: ChartBarIcon,
        },
        
        {
            id: 'mastersmanagement.natures',
            path: path(ROOT_DASHBOARDS, '/expense-natures'),
            type: NAV_TYPE_ITEM,
            role: 800002,
            title: 'Natures Management',
            Icon: ChartBarIcon,
        },
        {
            id: 'mastersmanagement.expensecategory ',
            type: NAV_TYPE_ITEM,
            role: 400000,
            path: path(ROOT_DASHBOARDS, '/expensecategory'),
            title: 'Ledger Management',
            Icon: ChartBarIcon,

        },
        {
            id: 'mastersmanagement.supplier ',
            type: NAV_TYPE_ITEM,
            role: 800003,
            path: path(ROOT_DASHBOARDS, '/suppliers'),
            title: 'Suppliers',
            Icon: ChartBarIcon,
        },

        

    ]
}

