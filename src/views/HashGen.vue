<template>
    <div>
        <div class="columns is-multiline is-centered" style="margin-top: 0px;">
            <div class="column is-4-fullhd is-6-desktop is-8-tablet is-full-mobile">
                <div class="notification animated_auto is-link" style="text-align: center;" v-if="!is_configured">
                    Des problèmes de configuration ont été détectés :<br/>
                    <ul style="text-align: left;font-size:14px;font-weight: 300;margin-left: 10%;">
                        <li v-for="(message, i) in is_configured_messages" :key="i">{{ message }}</li>
                    </ul>
                    <br/>
                    Note :<br/>
                    <p style="font-size: 13px;font-weight: 300;">
                        Si vous changez la variable d'environnement JWT_SECRET,<br/>
                        vous devrez regénérer PW_HASH_USER et PW_HASH_ADMIN.
                    </p>
                </div>

                <div class="notification animated is-danger" style="text-align: center;" v-if="error_message">
                    <button class="delete" @click="error_message = null"></button>
                    {{ error_message }}
                </div>

                <div class="notification animated is-success" style="text-align: center;" v-if="gen_hash">
                    <button class="delete" @click="gen_hash = null"></button>
                    Hash : {{ gen_hash }}
                </div>

                <div class="nice_box padded">
                    <h1 style="font-size: 21px;font-weight:400;">Génération de hash</h1>
                    <br/>
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

                        <button class="button is-pulled-right is-dark" :class="{'is-loading': isPerformingRequest}" @click="startAuth">Générer Hash</button>
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

    @keyframes open_animation_auto {
        0%   {
            opacity: 0;
            max-height: 0;
        }
        100% {
            opacity: 1;
            max-height: 450px;
        }
    }

    .notification.animated {
        animation-name: open_animation;
        animation-duration: 500ms;
    }

    .notification.animated_auto {
        animation-name: open_animation_auto;
        animation-duration: 1000ms;
    }
</style>

<script>
    export default {
        name: 'HashGen',
        data() {
            return {
                user: '',
                pass: '',
                isPerformingRequest: false,
                error_message: null,
                gen_hash: '',

                is_configured: true,
                is_configured_messages: [],
            }
        },
        created() {
            this.$axios.get(this.$url + '/api/is_configured')
                .then((response) => {
                    this.is_configured = response.data.is_configured;
                    this.is_configured_messages = response.data.messages;
                })
                .catch((err) => {
                    this.error_message = "Erreur lors de la vérification de la configuration du serveur.";
                })
        },
        methods: {
            startAuth() {
                if (this.isPerformingRequest) return;
                this.isPerformingRequest = true;

                this.error_message = null;
                this.gen_hash = null;

                this.$axios.post(this.$url + '/api/hash', {
                    user: this.user,
                    pass: this.pass,
                })
                    .then((response) => {
                        setTimeout(() => {
                            this.error_message = null;
                            this.gen_hash = response.data.hash;
                            this.isPerformingRequest = false;
                        }, 500);
                    })
                    .catch((error) => {
                        setTimeout(() => {
                            console.log('Error when generating hash', error, error.response);
                            this.isPerformingRequest = false;

                            if (error.response.status === 400)
                                this.error_message = "Veuillez entrer des identifiants";
                            else if (error.response.status === 500)
                                this.error_message =  'Erreur serveur.';
                            else
                                this.error_message = error;
                        }, 500);
                    })

            },
        }
    }
</script>