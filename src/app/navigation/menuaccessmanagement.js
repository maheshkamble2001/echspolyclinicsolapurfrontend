import { HomeIcon, ChartBarIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'
import { MenuIcon, MenuSquareIcon } from 'lucide-react';

const ROOT_DASHBOARDS = '/menuaccessmanagement'

const path = (root, item) => `${root}${item}`;

export const menuaccessmanagement = {
    id: 'menuaccessmanagement',
    type: NAV_TYPE_ROOT,
    role: 100000,
    path: '/menuaccessmanagement',
    title: 'Menu Management',
    Icon: LockClosedIcon,
    childs: [
        {
            id: 'menuaccessmanagement.menu',
            path: path(ROOT_DASHBOARDS, '/menu'),
            type: NAV_TYPE_ITEM,
            role:100001,
            title: 'Menu List',
            Icon: HomeIcon,
        },
           {
            id: 'menuaccessmanagement.assigned-menu',
            path: path(ROOT_DASHBOARDS, '/assigned-menu'),
            type: NAV_TYPE_ITEM,
            role: 100002,
            title: 'Assigned Menu',
            Icon: HomeIcon,
        },
        {
            id: 'menuaccessmanagement.assign-menu',
            path: path(ROOT_DASHBOARDS, '/assign-menu'),
             role: 100003,
            type: NAV_TYPE_ITEM,
            title: 'Not Assigned Menu',
            Icon: HomeIcon,
        },

    ]
    }