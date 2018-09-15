<template>
    <div id="app">
        <router-view name="navbar"/>

        <div class="app-bottom" style="height: 100%;display: table-row;">
            <router-view/>
        </div>
    </div>
</template>

<script>
    import NavBar from '@/components/Navigation/NavBar'

    export default {
        name: 'App',
        data() {
            return {
            }
        },
        components: {
            NavBar,
        }
    }
</script>

<style lang="scss">
    @import '../static/bulma-0.7.1/bulma.sass';
    @import '../static/fontawesome-pro-5.3.1-web/css/all.css';
    @import '~pretty-checkbox/src/pretty-checkbox.scss';
    @import '../static/custom/style.scss';

    html, body {
        width: 100%;
        height: 100%;
        background-color: #f5f7fa;

        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #808080;
            border-radius: 3px;
        }

        #app {
            position: absolute;
            height: 100%;
            width: 100%;
            background-color: #f5f7fa;

            display: table;
        }
    }
</style>
