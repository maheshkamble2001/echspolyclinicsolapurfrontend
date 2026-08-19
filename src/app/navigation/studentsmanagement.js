import { AcademicCapIcon, } from '@heroicons/react/24/outline';
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'



const ROOT_DASHBOARDS = '/studentsmanagement'

const path = (root, item) => `${root}${item}`;

export const studentsmanagement = {
    id: 'studentsmanagement',
    type: NAV_TYPE_ROOT,
    role: 500000,
    path: '/studentsmanagement/students',
    title: 'Students List',
    Icon: AcademicCapIcon,
    // childs: [
    //     {
    //         id: 'studentsmanagement.students',
    //         path: path(ROOT_DASHBOARDS, '/students'),
    //         type: NAV_TYPE_ITEM,
    //         role: 500000,
    //         title: 'All Students',
    //     },
    //     // {
    //     //     id: 'studentsmanagement.studentmapping',
    //     //     path: path(ROOT_DASHBOARDS, '/studentmapping'),
    //     //     type: NAV_TYPE_ITEM,
    //     //     role: 400001,
    //     //     title: 'Map Student Offerings',
    //     // },
    //     // {
    //     //     id: 'studentsmanagement.studentpayments',
    //     //     path: path(ROOT_DASHBOARDS, '/studentpayments'),
    //     //     type: NAV_TYPE_ITEM,
    //     //     role: 400016,
    //     //     title: 'Student Payments',
    //     // },


    // ]
}