<template>
    <nav class="navbar is-dark container_row" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <span class="navbar-item" style="font-size: 1.25em;">
                <router-link v-if="is_logged" :to="{ name: 'ListFilesHome' }" style="color: inherit;" @click="disableListing">NFE 3.0</router-link>
                <a v-else style="color: inherit;">NFE 3.0</a>
            </span>
            <div class="navbar-burger burger" data-target="navbarExampleTransparentExample" :class="{'is-active': burgerOpened}" @click="toggleBurger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

        <div class="navbar-menu" :class="{'is-active': burgerOpened}">
            <div class="navbar-start">
                <!-- navbar items -->
            </div>

            <div class="navbar-end">

                <div v-if="moreOptionsVisible" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">Plus d'options</a>
                    <div class="navbar-dropdown dropdown-right is-boxed">
                        <a class="navbar-item" :class="{'is-enabled': listEnabled}" @click="toggleList">
                            <i class="fal" :class="{'fa-list-ul': !listEnabled, 'fa-check': listEnabled}"></i> Liste
                        </a>

                        <template v-if="currentRoute !== null && currentRoute !== undefined">

                            <a
                              v-if="currentMooltipass !== null && currentMooltipass !== undefined"
                              class="navbar-item"
                              :href="$downurl + '/' + currentMooltipass + '/down/guest/' + currentRoute"
                            >
                                <i class="fal fa-download"></i> Télécharger (tar)
                            </a>

                            <a
                              v-else
                              class="navbar-item"
                              :href="$downurl + '/' + currentRoute"
                            >
                                <i class="fal fa-download"></i> Télécharger (tar)
                            </a>
                        </template>

                        <template v-else-if="currentMooltipass !== null && currentMooltipass">
                            <a
                              v-if="currentMooltipass !== null && currentMooltipass !== undefined"
                              class="navbar-item"
                              :href="$downurl + '/' + currentMooltipass"
                            >
                                <i class="fal fa-download"></i> Télécharger (tar)
                            </a>
                        </template>
                        <!--
                        <a class="navbar-item" :class="{'is-enabled': recursiveEnabled}" @click="toggleRecursive">
                            <i class="fal" :class="{'fa-folders': !recursiveEnabled, 'fa-check': recursiveEnabled}"></i> Récursif
                        </a>
                        -->
                    </div>
                </div>

                <div class="navbar-item has-dropdown is-hoverable" v-if="is_logged && user_admin">
                    <a class="navbar-link">Administration</a>
                    <div class="navbar-dropdown dropdown-right is-boxed">
                        <router-link class="navbar-item" :to="{ name: 'Monitoring' }">
                            <i class="fal fa-monitor-heart-rate"></i>Activité
                        </router-link>
                    </div>
                </div>

                <a v-if="is_logged" class="navbar-item" @click="disconnect"><i class="fal fa-sign-out"></i><span class="is-hidden-desktop">Déconnexion</span></a>


            </div>
        </div>
    </nav>
</template>

<style lang="scss">
    @import '@/resources/bulma-0.7.1/bulma.sass';

    .navbar-item {
        i.fa, i.fal, i.far, i.fas {
            margin-right: 6px;
        }

        &:hover {
            &.is-enabled {
                background-color: #eaf5ea;
            }
        }

        &.is-enabled {
            background-color: #effaef;
        }
    }

    .navbar-dropdown {
        &.dropdown-right {
            right: 0;
            top: 52px;
        }
    }
</style>

<script>
    export default {
        name: 'NavBar',
        data() {
            return {
                listEnabled: false,
                //recursiveEnabled: true,
                burgerOpened: false,

                is_logged: false,
                user_admin: false,

                currentRoute: null,
                currentMooltipass: null,
            }
        },
        created() {
            this.$eventbus.$on('session_has_changed', this.sessionHasChanged);
            this.$eventbus.$on('list_mode_disable', this.listModeDisable);
            this.sessionHasChanged();
        },
        beforeDestroy() {
            this.$eventbus.$off('session_has_changed', this.sessionHasChanged);
            this.$eventbus.$off('list_mode_disable', this.listModeDisable);
        },
        methods: {
            toggleList() {
                this.listEnabled = !this.listEnabled;

                this.$eventbus.$emit('list_mode_changed', this.listEnabled);
            },
            listModeDisable() {
                this.listEnabled = false;
            },
            disableListing() {
                this.listEnabled = false;
                this.$eventbus.$emit('list_mode_changed', false);
            },
            /*toggleRecursive() {
                this.recursiveEnabled = !this.recursiveEnabled;
            },*/
            sessionHasChanged() {
                this.is_logged = this.$session.exists();
                this.user_admin = this.is_logged && this.$session.get('user_admin');
            },
            toggleBurger() {
                this.burgerOpened = !this.burgerOpened;
            },
            disconnect() {
                this.$session.destroy();
                delete this.$axios.defaults.headers.common['Authorization'];
                this.$eventbus.$emit('session_has_changed');
                this.$router.push({name: 'Login'});
            },
        },
        watch: {
            '$route.params.path': {
                handler: function(path) {
                    this.currentRoute = path;
                },
                immediate: true,
            },
            '$route.params.mooltipass': {
                handler: function(path) {
                    this.currentMooltipass = path;
                },
                immediate: true,
            },
        },
        props: [
            'moreOptionsVisible'
        ],
    }
</script>
