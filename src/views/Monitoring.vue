<template>
    <div class="columns is-centered">
        <div class="column is-10-desktop is-9-fullhd">
            <table class="table download-list">
                <thead>
                <tr>
                    <th width="30px"></th>
                    <th></th>
                    <th width="90px"></th>
                    <th width="215px"></th>
                    <th width="95px"></th>
                </tr>
                </thead>
                <tfoot>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                </tfoot>
                <tbody>
                <tr v-for="(transfer, i) in transfers" :key="i" class="blur-animated" :class="{blurred: notBlurredLine !== null && i !== notBlurredLine, unblurred: !(notBlurredLine !== null && i !== notBlurredLine)}">
                    <td><i class="fal" :class="stateIcon(transfer.current_state)"></i></td>
                    <td><a href="http://google.fr">{{ transfer.file_name }}</a></td>
                    <td class="speed-indicator">{{ speedRound(transfer.current_speed) }}<span class="unit">{{ speedUnit(transfer.current_speed) }}</span><span v-if="transfer.current_speed_limit != 0" style="color: #df372d;"><br/><i class="fal fa-tachometer" style="margin-right: 4px;"></i>{{ speedRound(transfer.current_speed_limit) }}<span class="unit">{{ speedUnit(transfer.current_speed_limit) }}</span></span></td>
                    <td>
                        <div class="progress-bar"><div class="bar-1" :style="{width: percentBar1(transfer) + '%'}" v-if="percentBar1(transfer) > 0"></div><div class="bar-2" :style="{width: percentBar2(transfer) + '%'}" v-if="percentBar2(transfer) > 0"></div><div class="bar-3" :style="{width: percentBar3(transfer) + '%'}" v-if="percentBar3(transfer) > 0"></div><div class="bar-4" :style="{width: percentBar4(transfer) + '%'}" v-if="percentBar4(transfer) > 0"></div></div>
                    </td>

                    <td>
                        <i class="fal fa-tachometer speed-limit" :class="{'is-downloading': transfer.current_state === 0}" style="margin-right: 6px;" @click.self="speedPopupOpen(i)">
                            <span :class="{'popup-opened': speedLimitEnabled}" class="speed-popup" v-if="speedPopupOpened === i" @mouseleave="speedPopupAutoclose" @mouseenter="clearAutoclose">
                                <i class="fal fa-times speed-close-button" :class="{'is-disabled': speedPopupRequest}" @click.self="closeAnyPopup"></i>
                                <span class="speed-title" :class="{hidden: speedLimitEnabled}">Limiter le débit</span>

                                <div class="field has-addons has-addons-centered speed-limit-form" :class="{hidden: !speedLimitEnabled}">
                                    <p class="control"><input class="input" type="text" placeholder="Débit" v-model="speedLimitInput" :disabled="speedPopupRequest"></p>
                                    <p class="control">
                                        <span class="select">
                                            <select v-model="speedLimitUnit" :disabled="speedPopupRequest">
                                                <option value="0">o/s</option>
                                                <option value="1">Ko/s</option>
                                                <option value="2">Mo/s</option>
                                            </select>
                                        </span>
                                    </p>
                                    <p class="control" style="color: white;"><a class="button is-primary" :class="{'is-loading': speedPopupRequest}" :disabled="speedPopupRequest" @click="speedPopupLimit(i)"><i class="fal fa-check"></i></a></p>
                                </div>

                                <div class="pretty p-switch p-fill"><input type="checkbox" v-model="speedLimitEnabled" :disabled="speedPopupRequest"/><div class="state p-info"><label></label></div></div>
                            </span>
                        </i>

                        <i class="fal fa-skull kill-download" :class="{'is-downloading': transfer.current_state === 0}" style="margin-right: 6px;" @click.self="killPopupOpen(i)">
                            <span class="kill-popup" v-if="killPopupOpened === i" @mouseleave="killPopupAutoclose" @mouseenter="clearAutoclose">
                                <i class="fal fa-times kill-close-button" :class="{'is-disabled': killPopupRequest}" @click.self="closeAnyPopup"></i>
                                <span class="kill-title button is-danger" :class="{'is-loading': killPopupRequest}" :disabled="killPopupRequest" @click="killPopupKill(i)">Couper le téléchargement</span>
                            </span>
                        </i>

                        <i class="fal fa-info-circle info-button"></i>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="full-background-shadow"></div>
        <div class="information-big-popup">
            <div class="information-popup-title">Informations supplémentaires</div>
            <i class="fal fa-times big-popup-close"></i>
            <table class="table info-popup-table">
                <thead>
                <tr>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Début Téléchargement</td>
                    <td>08/09/2018 à 11:59:07</td>
                </tr>
                <tr>
                    <td>Fin Téléchargement</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>Durée</td>
                    <td>18m 34s</td>
                </tr>
                <tr>
                    <td>Débit moyen</td>
                    <td>15.7<span style="font-size: 12px;margin-left: 3px;">Mo/s</span></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .full-background-shadow {
        position: fixed;

        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        z-index: 100;

        background-color: rgba(0, 0, 0, 0.75);
    }

    .information-big-popup {
        position: fixed;

        width: 400px;
        height: 183px;

        top: 85px;
        left: 0;
        right: 0;

        margin-left: auto;
        margin-right: auto;

        z-index: 110;

        background-color: #f5f7fa;
        box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
        border-radius: 10px;

        .information-popup-title {
            position: absolute;

            top: 6px;
            left: 11px;
            font-size: 16px;
        }

        .big-popup-close {
            position: absolute;

            top: 10px;
            right: 11px;
            font-size: 18px;
        }

        table.info-popup-table.table {
            margin-top: 19px;
            width: 100%;
            background-color: transparent;

            td {
                font-size: 14px;
            }
        }
    }

    .blur-animated {
        $bluranimation: 135ms;
        &.unblurred {
            filter: blur(0px);
            -webkit-transition: $bluranimation -webkit-filter linear;
            -moz-transition: $bluranimation -moz-filter linear;
            -moz-transition: $bluranimation filter linear;
            -ms-transition: $bluranimation -ms-filter linear;
            -o-transition: $bluranimation -o-filter linear;
            transition: $bluranimation filter linear, $bluranimation -webkit-filter linear;
        }

        &.blurred {
            filter: blur(3px);
            -webkit-transition: $bluranimation -webkit-filter linear;
            -moz-transition: $bluranimation -moz-filter linear;
            -moz-transition: $bluranimation filter linear;
            -ms-transition: $bluranimation -ms-filter linear;
            -o-transition: $bluranimation -o-filter linear;
            transition: $bluranimation filter linear, $bluranimation -webkit-filter linear;
            pointer-events: none;
        }
    }

    .info-button {
        position: relative;

        color: #aaaaaa;
        &:hover { color: #444444; }
        cursor: pointer;
        transition: color 150ms;
    }



    .kill-download {
        position: relative;

        color: #e3e3e3;
        &.is-downloading {
            color: #aaaaaa;
            &:hover { color: #444444; }
            cursor: pointer;
        }
        transition: color 150ms;

        .kill-popup {
            filter: none;

            color: black;

            position: absolute;

            width: 240px;
            height: 52px;

            top: -18px;
            right: -7px;

            display: block;
            //background-color: rgba(255, 0, 0, 0.2);
            background-color: white;
            box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
            border-radius: 6px;
            cursor: default;

            .kill-close-button {
                position: absolute;

                font-size: 19px;

                top: 16px;
                right: 9px;

                $color: #bbbbbb;
                color: $color;
                &:hover { color: #686868; }
                transition: color 200ms;

                cursor: pointer;
                &.is-disabled {
                    color: #dfdfdf;
                    &:hover { color: #dfdfdf; }
                    cursor: default;
                }
            }

            .kill-title {
                position: absolute;
                top: 8px;
                left: 8px;
                font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
            }
        }
    }

    .speed-limit {
        position: relative;

        color: #e3e3e3;
        &.is-downloading {
            color: #aaaaaa;
            &:hover { color: #444444; }
            cursor: pointer;
        }
        transition: color 150ms;

        .speed-popup {
            filter: none;

            color: black;

            position: absolute;

            width: 195px;
            height: 52px;

            top: -18px;
            right: -7px;

            display: block;
            //background-color: rgba(255, 0, 0, 0.2);
            background-color: white;
            box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
            border-radius: 6px;
            cursor: default;

            &.popup-opened { width: 265px; }
            transition: width 100ms;

            .speed-close-button {
                position: absolute;

                font-size: 19px;

                top: 16px;
                right: 9px;

                $color: #bbbbbb;
                color: $color;
                &:hover { color: #686868; }
                transition: color 200ms;

                cursor: pointer;
                &.is-disabled {
                    color: #dfdfdf;
                    &:hover { color: #dfdfdf; }
                    cursor: default;
                }
            }

            .speed-title {
                position: absolute;
                top: 16px;
                right: 79px;
                font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
                pointer-events: none;

                opacity: 1;
                &.hidden { opacity: 0; }
                transition: opacity 150ms;
            }

            .speed-limit-form {
                position: absolute;
                top: 8px;
                right: 79px;

                pointer-events: all;

                opacity: 1;
                &.hidden {
                    pointer-events: none;
                    opacity: 0;
                }
                transition: opacity 200ms;

                input {
                    width: 50px;
                }
            }

            .p-switch {
                position: absolute;
                top: 18px;
                right: 34px;

                label:after {
                    top: calc((0% - (100% - 1em)) - 10%);
                }
            }
        }
    }

    table.table.download-list {
        width: 100%;
        background-color: #f5f7fa;

        tbody tr {
            background-color: rgba(0, 0, 0, 0);
            transition: background-color 250ms;


            &:hover {
                background-color: rgba(0, 0, 0, 0.05);
                transition: background-color 100ms;
            }

            td {
                padding-top: 0;
                padding-bottom: 0;

                $height: 37px;
                height: $height;
                vertical-align: middle;

                a {
                    color: inherit;
                    display: block;
                    text-decoration: none;
                    cursor: pointer;
                }

                &.speed-indicator {
                    text-align: right;

                    font-size: 12px;
                    font-weight: 400;

                    span {
                        font-size: 11px;
                        margin-left: 3px;
                    }
                }
            }
        }
    }

    .progress-bar {
        $height: 4px;
        height: $height;
        width: 100%;
        display: inline-block;
        transform: translateY(-3px);


        .bar-1, .bar-2, .bar-3, .bar-4 {
            height: 100%;
            display: inline-block;
        }

        .bar-1, .bar-4 {
            background-color: #dfdfdf;
        }
        .bar-2 {
            background-color: #5595e0;
        }
        .bar-3 {
            background-color: #92d4ff;
        }

        div:first-child {
            border-top-left-radius: $height;
            border-bottom-left-radius: $height;
        }

        div:last-child {
            border-top-right-radius: $height;
            border-bottom-right-radius: $height;
        }
    }
</style>

<script>
    export default {
        name: 'Monitoring',
        data () {
            return {
                notBlurredLine: null,
                popupAutocloseTimeout: null,

                killPopupOpened: null,
                killPopupRequest: false,

                speedPopupOpened: null,
                speedPopupRequest: false,

                speedLimitInput: null,
                speedLimitEnabled: null,
                speedLimitUnit: null,

                transfers: [
                    {
                        current_state: 0,
                        file_name: 'Win10_1703_French_x64.iso',

                        section_start: 0,
                        downloaded: 26549844 / 2,
                        section_length: 26549844,
                        file_length: 26549844,

                        current_speed: 512397,
                        current_speed_limit: 654000,
                    },
                    {
                        current_state: 1,
                        file_name: 'debian-9.1.0-amd64-netinst.iso',

                        section_start: 0,
                        downloaded: 26549844 / 4,
                        section_length: 26549844 / 2,
                        file_length: 26549844,

                        current_speed: 984,
                        current_speed_limit: 0,
                    },
                    {
                        current_state: 2,
                        file_name: 'ubuntu-17.04-server-amd64.iso',

                        section_start: 26549844 / 3,
                        downloaded: 26549844 / 6,
                        section_length: 26549844 / 3,
                        file_length: 26549844,

                        current_speed: 12587,
                        current_speed_limit: 0,
                    },
                    {
                        current_state: 3,
                        file_name: 'fr_office_professional_plus_2010_with_sp1_x86_x64_dvd_730410.iso',

                        section_start: 26549844 / 2,
                        downloaded: 26549844 / 4,
                        section_length: 26549844 / 2,
                        file_length: 26549844,

                        current_speed: 1574971,
                        current_speed_limit: 0,
                    },
                    {
                        current_state: 4,
                        file_name: 'ESXi-6.5.0-4564106.iso',

                        section_start: 26549844 * 3 / 4,
                        downloaded: 26549844 / 8,
                        section_length: 26549844 / 4,
                        file_length: 26549844,

                        current_speed: 1234567890234567,
                        current_speed_limit: 0,
                    },
                ]
            }
        },
        methods: {
            stateIcon(state) {
                if (state === 0 /*StateTransferring*/) return 'fa-upload';
                else if (state === 1 /*StateFinished*/) return 'fa-check';
                else if (state === 2 /*StateInterruptedClient*/) return 'fa-times';
                else if (state === 3 /*StateInterruptedServer*/) return 'fa-exclamation-triangle';
                else if (state === 4 /*StateInterruptedAdmin*/) return 'fa-skull';
                else return '';
            },
            percentBar1(transfer) {
                return transfer.section_start * 100.0 / transfer.file_length
            },
            percentBar2(transfer) {
                return transfer.downloaded * 100.0 / transfer.file_length
            },
            percentBar3(transfer) {
                return (transfer.section_length - transfer.downloaded) * 100.0 / transfer.file_length
            },
            percentBar4(transfer) {
                return (transfer.file_length - transfer.section_start - transfer.section_length) * 100.0 / transfer.file_length
            },
            speedUnit(speed) {
                let len = (speed + '').length;

                if (len > 12) return 'To/s';
                else if (len > 9) return 'Go/s';
                else if (len > 6) return 'Mo/s';
                else if (len > 3) return 'Ko/s';
                else return 'o/s';
            },
            speedRound(speed) {
                let len = (speed + '').length;

                if (len > 14) return (speed / 10 ** 12).toFixed(0);
                else if (len > 13) return (speed / 10 ** 12).toFixed(1);
                else if (len > 12) return (speed / 10 ** 12).toFixed(2);
                else if (len > 11) return (speed / 10 ** 9).toFixed(0);
                else if (len > 10) return (speed / 10 ** 9).toFixed(1);
                else if (len > 9) return (speed / 10 ** 9).toFixed(2);
                else if (len > 8) return (speed / 10 ** 6).toFixed(0);
                else if (len > 7) return (speed / 10 ** 6).toFixed(1);
                else if (len > 6) return (speed / 10 ** 6).toFixed(2);
                else if (len > 5) return (speed / 10 ** 3).toFixed(0);
                else if (len > 4) return (speed / 10 ** 3).toFixed(1);
                else if (len > 3) return (speed / 10 ** 3).toFixed(2);
                else return speed;
            },
            formSpeedUnit(speed) {
                let len = (speed + '').length;

                if (len > 6) return 2;
                else if (len > 3) return 1;
                else return 0;
            },
            formSpeedRound(speed) {
                let len = (speed + '').length;

                if (len > 8) return (speed / 10 ** 6).toFixed(0);
                else if (len > 7) return (speed / 10 ** 6).toFixed(1);
                else if (len > 6) return (speed / 10 ** 6).toFixed(2);
                else if (len > 5) return (speed / 10 ** 3).toFixed(0);
                else if (len > 4) return (speed / 10 ** 3).toFixed(1);
                else if (len > 3) return (speed / 10 ** 3).toFixed(2);
                else return speed;
            },
            closeAnyPopup() {
                if (this.killPopupOpened !== null && this.killPopupRequest) return false;
                if (this.speedPopupOpened !== null && this.speedPopupRequest) return false;

                this.notBlurredLine = null;
                this.killPopupOpened = null;
                this.speedPopupOpened = null;

                return true;
            },
            clearAutoclose() {
                if (this.popupAutocloseTimeout === null) return;

                clearTimeout(this.popupAutocloseTimeout);
            },

            killPopupOpen(i) {
                if (this.killPopupOpened !== null && this.killPopupRequest) return;
                if (this.transfers[i].current_state !== 0) return;

                if (this.closeAnyPopup()) {
                    this.killPopupOpened = i;
                    this.notBlurredLine = i;
                }
            },
            killPopupKill(i) {
                if (this.killPopupOpened === null) return;
                if (this.killPopupRequest) return;

                this.killPopupRequest = true;

                setTimeout(() => {
                    this.killPopupRequest = false;
                    this.closeAnyPopup();
                }, 1000);
            },
            killPopupAutoclose() {
                if (this.killPopupRequest) return;

                this.popupAutocloseTimeout = setTimeout(() => {
                    if (this.killPopupRequest) return;

                    this.closeAnyPopup();
                }, 450);
            },

            speedPopupOpen(i) {
                if (this.speedPopupOpened !== null && this.speedPopupRequest) return;
                if (this.transfers[i].current_state !== 0) return;

                if (this.closeAnyPopup()) {
                    this.speedLimitEnabled = this.transfers[i].current_speed_limit !== 0;
                    if (this.speedLimitEnabled) {
                        this.speedLimitUnit = this.formSpeedUnit(this.transfers[i].current_speed_limit);
                        this.speedLimitInput = this.formSpeedRound(this.transfers[i].current_speed_limit);
                    } else {
                        this.speedLimitUnit = 2;
                        this.speedLimitInput = 1;
                    }

                    this.speedPopupOpened = i;
                    this.notBlurredLine = i;
                }
            },
            speedPopupLimit(i) {
                if (this.speedPopupOpened === null) return;
                if (this.speedPopupRequest) return;

                this.speedPopupRequest = true;

                setTimeout(() => {
                    this.speedPopupRequest = false;
                    this.closeAnyPopup();
                }, 1000);
            },
            speedPopupAutoclose() {
                return;
                if (this.speedPopupRequest) return;

                this.popupAutocloseTimeout = setTimeout(() => {
                    if (this.speedPopupRequest) return;

                    this.closeAnyPopup();
                }, 450);
            },
            speedLimitChange(i) {
                this.transfers[i].speed_limit_enabled = true;
            },

            getUnit(i) {
                if (i == 0) return 'o/s';
                else if (i == 1) return 'Ko/s';
                else if (i == 2) return 'Mo/s';
                else return '';
            },
        }
    }
</script>
