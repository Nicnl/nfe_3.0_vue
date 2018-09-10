import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home'
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
    ]
});

export default router;
