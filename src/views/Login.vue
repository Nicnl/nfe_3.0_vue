<template>
    <div>
        <div class="columns is-multiline is-centered" style="margin-top: 0px;">
            <div class="column is-4-fullhd is-6-desktop is-8-tablet is-full-mobile">
                <div class="notification animated is-danger" style="text-align: center;" v-if="error_message">
                    <button class="delete" @click="error_message = null"></button>
                    {{ error_message }}
                </div>

                <div class="nice_box padded">
                    <form v-on:submit.prevent>
                        <div class="field">
                            <label class="label" style="font-weight: normal;">Nom d'utilisateur</label>
                            <div class="control">
                                <input name="username" class="input" type="text" placeholder="Nom d'utilisateur" v-model="user" @keyup.enter="startAuth">
                            </div>
                        </div>

                        <div class="field">
                            <label class="label" style="font-weight: normal;">Mot de passe</label>
                            <div class="control">
                                <input name="password" class="input" type="password" placeholder="Mot de passe" v-model="pass" @keyup.enter="startAuth">
                            </div>
                        </div>

                        <button class="button is-pulled-right is-dark" :class="{'is-loading': isPerformingRequest}" @click="startAuth">Connexion</button>
                        <div class="is-clearfix"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .nice_box {
        display: block;

        background-color: #ffffff;
        transition: background-color 110ms ease, border 110ms ease;

        border-radius: 4px;

        border: 1px solid;
        border-top: 3px solid;
    }

    .padded {
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 8px;
        padding-bottom: 10px;
    }

    /* The animation code */
    @keyframes open_animation {
        0%   {
            height: 0;
            padding: 0 2.5rem 0 1.5rem;
        }
        99%  {
            height: 64px;
            padding: 1.25rem 2.5rem 1.25rem 1.5rem;
        }
        100% {
            height: auto;
            padding: 1.25rem 2.5rem 1.25rem 1.5rem;
        }
    }

    .notification.animated {
        animation-name: open_animation;
        animation-duration: 500ms;
    }
</style>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                user: '',
                pass: '',
                isPerformingRequest: false,
                error_message: null,
            }
        },
        methods: {
            startAuth() {
                if (this.isPerformingRequest) return;
                this.isPerformingRequest = true;

                this.error_message = null;

                this.$axios.post(this.$url + '/auth', {
                    user: this.user,
                    pass: this.pass,
                })
                    .then((response) => {
                        setTimeout(() => {
                            this.error_message = null;

                            this.$session.start();

                            this.$session.set('jwt', response.data.token);
                            this.$session.set('user_id', response.data.user_id);
                            this.$session.set('user_admin', response.data.user_admin);

                            this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$session.get('jwt');
                            this.$eventbus.$emit('session_has_changed');
                            this.$router.push({name: 'Home'});
                        }, 500);
                    })
                    .catch((error) => {
                        setTimeout(() => {
                            console.log('Error when authenticating', error, error.response);
                            this.isPerformingRequest = false;

                            if (error.response.status === 400)
                                this.error_message = "Veuillez entrer des identifiants";
                            else if (error.response.status === 401)
                                this.error_message =  'Identifiants incorrects.';
                            else
                                this.error_message = error;
                        }, 500);
                    })

            },
        }
    }
</script>