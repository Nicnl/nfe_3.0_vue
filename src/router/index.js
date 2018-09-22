import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home'
import ListFiles from '@/views/ListFiles'
import GuestListFiles from '@/views/GuestListFiles'
import Monitoring from '@/views/Monitoring'
import NavBar from '@/components/Navigation/NavBar'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            components: {
                default: Home,
                navbar: NavBar
            },
        },
        {
            path: '/explore/',
            name: 'ListFiles',
            components: {
                default: ListFiles,
                navbar: NavBar
            },
        },
        {
            path: '/explore/:path',
            name: 'ListFilesM',
            components: {
                default: ListFiles,
                navbar: NavBar
            },
        },
        {
            path: '/guest/explore/:mooltipass/',
            name: 'GuestListFiles',
            components: {
                default: GuestListFiles,
                navbar: NavBar
            },
        },
        {
            path: '/guest/explore/:mooltipass/:path',
            name: 'GuestListFilesM',
            components: {
                default: GuestListFiles,
                navbar: NavBar
            },
        },
        {
            path: '/monitoring',
            name: 'Monitoring',
            components: {
                default: Monitoring,
                navbar: NavBar
            },
        },
    ]
});

export default router;
