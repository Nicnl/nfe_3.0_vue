import Vue from 'vue'
import Router from 'vue-router'

import NotFound404 from '@/views/NotFound404.vue'
import ListFiles from '@/views/ListFiles.vue'
import GuestListFiles from '@/views/GuestListFiles.vue'
import Login from '@/views/Login.vue'
import HashGen from '@/views/HashGen.vue'
import Monitoring from '@/views/Monitoring.vue'
import NavBar from '@/components/Navigation/NavBar.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        /*{
            path: '/',
            name: 'Home',
            components: {
                default: Home,
                navbar: NavBar
            },
        },*/
        {
            path: '/',
            name: 'ListFilesHome',
            components: {
                default: ListFiles,
                navbar: NavBar
            },
            props: {
                navbar: {
                    moreOptionsVisible: true,
                }
            }
        },
        {
            path: '/explore/',
            name: 'ListFiles',
            components: {
                default: ListFiles,
                navbar: NavBar
            },
            props: {
                navbar: {
                    moreOptionsVisible: true,
                }
            }
        },
        {
            path: '/explore/:path',
            name: 'ListFilesM',
            components: {
                default: ListFiles,
                navbar: NavBar
            },
            props: {
                navbar: {
                    moreOptionsVisible: true,
                }
            }
        },
        {
            path: '/guest/explore/:mooltipass/',
            name: 'GuestListFiles',
            components: {
                default: GuestListFiles,
                navbar: NavBar
            },
            props: {
                navbar: {
                    moreOptionsVisible: true,
                }
            }
        },
        {
            path: '/guest/explore/:mooltipass/:path',
            name: 'GuestListFilesM',
            components: {
                default: GuestListFiles,
                navbar: NavBar
            },
            props: {
                navbar: {
                    moreOptionsVisible: true,
                }
            }
        },
        {
            path: '/monitoring',
            name: 'Monitoring',
            components: {
                default: Monitoring,
                navbar: NavBar
            },
        },
        {
            path: '/login',
            name: 'Login',
            components: {
                default: Login,
                navbar: NavBar
            },
        },
        {
            path: '/hash_gen',
            name: 'HashGen',
            components: {
                default: HashGen,
                navbar: NavBar
            },
        },
        {
            path: "*",
            components: {
                default: NotFound404,
                navbar: NavBar
            },
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.name == 'GuestListFiles' || to.name == 'GuestListFilesM' || to.name == 'HashGen') {
        next();
        return;
    }

    if (router.app.$session.exists()) {
        if (!router.app.$axios.defaults.headers.common.hasOwnProperty('Authorization')) {
            router.app.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + router.app.$session.get('jwt');

            Vue.nextTick(() => {
                router.app.$eventbus.$emit('authenticated');
            });
        }

        if (to.name == 'Login') next({path: '/'});
        else next();
    }
    else {
        if (to.name == 'Login') next();
        else next({path: '/login'});
    }
});

export default router;
