<template>
    <div id="app" :class="['theme-' + color]">
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
    @import '../static/fontawesome-pro-5.2.0-web/css/all.css';
    @import '../static/custom/style.scss';

    html, body {
        width: 100%;
        height: 100%;
        background-color: #f5f7fa;

        #app {
            position: absolute;
            height: 100%;
            width: 100%;

            display: table;
        }
    }
</style>
