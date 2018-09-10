<template>
    <nav class="navbar is-dark container_row" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="is-hidden-tablet sidebar-burger" @click="$eventbus.$emit('sidebar-burger-clicked')">
                <i class="fa fa-bars"></i>
            </a>
            <span class="navbar-item" style="font-size: 1.25em;">NFE 3.0</span>
        </div>
    </nav>
</template>

<style lang="scss">
    @import '../../../static/bulma-0.7.1/bulma.sass';
</style>

<script>
    export default {
        name: 'NavBar',
        data() {
            return {
            }
        },
    }
</script>
