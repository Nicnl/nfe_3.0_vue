<template>
    <nav class="navbar is-dark container_row" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <span class="navbar-item" style="font-size: 1.25em;"><router-link :to="{ name: 'ListFiles' }" style="color: inherit;">NFE 3.0</router-link></span>
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

                <!--
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">Options</a>
                    <div class="navbar-dropdown dropdown-right is-boxed">
                        <a class="navbar-item" :class="{'is-enabled': listEnabled}" @click="toggleList">
                            <i class="fal" :class="{'fa-list-ul': !listEnabled, 'fa-check': listEnabled}"></i> Liste
                        </a>
                        <a class="navbar-item" :class="{'is-enabled': recursiveEnabled}" @click="toggleRecursive">
                            <i class="fal" :class="{'fa-folders': !recursiveEnabled, 'fa-check': recursiveEnabled}"></i> Récursif
                        </a>
                    </div>
                </div>
                -->

                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">Administration</a>
                    <div class="navbar-dropdown dropdown-right is-boxed">
                        <router-link class="navbar-item" :to="{ name: 'Monitoring' }">
                            <i class="fal fa-monitor-heart-rate"></i>Activité
                        </router-link>
                    </div>
                </div>

                <a class="navbar-item"><i class="fal fa-sign-out"></i><span class="is-hidden-desktop">Déconnexion</span></a>


            </div>
        </div>
    </nav>
</template>

<style lang="scss">
    @import '../../../static/bulma-0.7.1/bulma.sass';

    .navbar-item {
        i.fa, i.fal, i.far, i.fas {
            margin-right: 6px;
        }

        /*
        &:hover {
            &.is-enabled {
                background-color: #eaf5ea;
            }
        }


        &.is-enabled {
            background-color: #effaef;
        }
        */
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
                //listEnabled: false,
                //recursiveEnabled: true,
                burgerOpened: false,
            }
        },
        methods: {
            /*toggleList() {
                this.listEnabled = !this.listEnabled;
            },
            toggleRecursive() {
                this.recursiveEnabled = !this.recursiveEnabled;
            },*/
            toggleBurger() {
                this.burgerOpened = !this.burgerOpened;
            },
        }
    }
</script>
