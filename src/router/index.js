import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home'
import ListFiles from '@/views/ListFiles'
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
            path: '/list',
            name: 'ListFiles',
            components: {
                default: ListFiles,
                navbar: NavBar
            },
        },
    ]
});

export default router;
