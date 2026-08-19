import { AcademicCapIcon, BuildingOffice2Icon, CurrencyDollarIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'
import { ChartBarIcon } from 'lucide-react';


const ROOT_DASHBOARDS = '/companymanagement';

const path = (root, item) => `${root}${item}`;

export const companymanagement = {
    id: 'companymanagement',
    type: NAV_TYPE_ROOT,
    role: 700000,
    path: '/companymanagement/companymanage',
    title: 'Company Management',
    Icon: BuildingOffice2Icon ,
   
}

