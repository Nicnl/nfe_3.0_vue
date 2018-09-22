<template>
    <div v-if="lastError" class="columns is-centered">
        <div class="column is-6-desktop is-6-fullhd">
            <div class="notification is-danger" style="margin-top: 10px;">
                <button class="delete" @click="lastError = null"></button>
                {{ lastError }}
            </div>
        </div>
    </div>

    <div v-else class="columns is-centered">

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
                <tr v-if="!Object.keys(transfers).length">
                    <td colspan="5"><h3 style="text-align: center;font-weight: 300;">Aucun transferts</h3></td>
                </tr>

                <tr v-for="transfer in orderedTransfers" :key="transfer.guid" class="blur-animated" :class="{blurred: notBlurredLine !== null && transfer.guid !== notBlurredLine, unblurred: !(notBlurredLine !== null && transfer.guid !== notBlurredLine)}">
                    <td style="text-align: center;"><i class="fal" :class="stateIcon(transfer.current_state)"></i></td>
                    <td><a href="http://google.fr">{{ transfer.file_name }}</a></td>
                    <td class="speed-indicator">{{ speedRound(transfer.current_speed) }}<span class="unit">{{ speedUnit(transfer.current_speed) }}</span><span v-if="transfer.current_speed_limit != 0" style="color: #df372d;"><br/><i class="fal fa-tachometer" style="margin-right: 4px;"></i>{{ speedRound(transfer.current_speed_limit) }}<span class="unit">{{ speedUnit(transfer.current_speed_limit) }}</span></span></td>
                    <td>
                        <div class="progress-bar" :class="['transfer-state-' + transfer.current_state]"><div class="bar-1" :style="{width: percentBar1(transfer) + '%'}" v-if="percentBar1(transfer) > 0"></div><div class="bar-2" :style="{width: percentBar2(transfer) + '%'}" v-if="percentBar2(transfer) > 0"></div><div class="bar-3" :style="{width: percentBar3(transfer) + '%'}" v-if="percentBar3(transfer) > 0"></div><div class="bar-4" :style="{width: percentBar4(transfer) + '%'}" v-if="percentBar4(transfer) > 0"></div><h5 class="progress-percentage">{{ (transfer.downloaded / transfer.section_length * 100).toFixed(1) }}%</h5></div>
                    </td>

                    <td>
                        <i class="fal fa-tachometer speed-limit" :class="{'is-downloading': transfer.current_state === 0}" style="margin-right: 6px;" @click.self="speedPopupOpen(transfer.guid)">
                            <span :class="{'popup-opened-big': speedLimitEnabled && popupSetOpeningClass, 'popup-opened-mini': !speedLimitEnabled && popupSetOpeningClass}" class="speed-popup" v-if="speedPopupOpened === transfer.guid" @mouseleave="speedPopupAutoclose" @mouseenter="clearAutoclose">
                                <i class="fal fa-times speed-close-button" :class="{'is-disabled': speedPopupRequest}" @click.self="closeAnyPopup"></i>
                                <span class="speed-title" :class="{hidden: speedLimitEnabled}">Limiter le débit</span>

                                <div class="field has-addons has-addons-centered speed-limit-form" :class="{hidden: !speedLimitEnabled}">
                                    <p class="control"><input class="input" type="text" placeholder="Débit" v-model="speedLimitInput" :disabled="speedPopupRequest"></p>
                                    <p class="control">
                                        <span class="select">
                                            <select v-model="speedLimitUnit" :disabled="speedPopupRequest">
                                                <option value="1">o/s</option>
                                                <option value="1000">Ko/s</option>
                                                <option value="1000000">Mo/s</option>
                                            </select>
                                        </span>
                                    </p>
                                    <p class="control" style="color: white;"><a class="button is-primary" :class="{'is-loading': speedPopupRequest}" :disabled="speedPopupRequest" @click="speedPopupLimit(transfer.guid)"><i class="fal fa-check"></i></a></p>
                                </div>

                                <div class="pretty p-switch p-fill"><input type="checkbox" v-model="speedLimitEnabled" :disabled="speedPopupRequest" @change="speedCheckboxChanged(transfer.guid)"/><div class="state p-info"><label></label></div></div>
                            </span>
                        </i>

                        <i class="fal fa-skull kill-download" :class="{'is-downloading': transfer.current_state === 0}" style="margin-right: 6px;" @click.self="killPopupOpen(transfer.guid)">
                            <span class="kill-popup" v-if="killPopupOpened === transfer.guid" @mouseleave="killPopupAutoclose" @mouseenter="clearAutoclose">
                                <i class="fal fa-times kill-close-button" :class="{'is-disabled': killPopupRequest}" @click.self="closeAnyPopup"></i>
                                <span class="kill-title button is-danger" :class="{'is-loading': killPopupRequest}" :disabled="killPopupRequest" @click="killPopupKill(transfer.guid)">Couper le téléchargement</span>
                            </span>
                        </i>

                        <i class="fal fa-info-circle info-button" @click="infoPopupOpen(transfer.guid)"></i>
                    </td>
                </tr>
                </tbody>
            </table>
            <a class="button is-danger is-pulled-right" @click="clearTransfers" :disabled="isClearingTransfers" :class="{'is-loading': isClearingTransfers}">Vider la liste</a>
            <div class="is-clearfix"></div>
        </div>

        <div class="full-background-shadow" :class="{visible: informationPopupOpened !== null}" @click="closeAnyPopup"></div>
        <div class="information-big-popup" :class="{visible: informationPopupOpened !== null}">
            <div class="information-popup-title">Informations supplémentaires</div>
            <i class="fal fa-times big-popup-close" @click="closeAnyPopup"></i>
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
                    <td v-if="informationPopupOpened !== null">{{ niceDate(transfers[informationPopupOpened].start_date) }}</td>
                </tr>
                <tr>
                    <td>Fin Téléchargement</td>
                    <td v-if="informationPopupOpened !== null">{{ transfers[informationPopupOpened].end_date ? niceDate(transfers[informationPopupOpened].end_date) : '-' }}</td>
                </tr>
                <tr>
                    <td>Durée</td>
                    <td v-if="informationPopupOpened !== null">{{ niceTime(informationPopupDuration) }}</td>
                </tr>
                <tr>
                    <td>Débit moyen</td>
                    <td v-if="informationPopupOpened !== null">
                        <template v-if="transfers[informationPopupOpened].end_date">{{speedRound(transfers[informationPopupOpened].downloaded / (transfers[informationPopupOpened].end_date - transfers[informationPopupOpened].start_date)) }}<span style="font-size: 12px;margin-left: 3px;">{{ speedUnit(transfers[informationPopupOpened].downloaded / (transfers[informationPopupOpened].end_date - transfers[informationPopupOpened].start_date)) }}</span></template>
                        <template v-else>{{ speedRound(transfers[informationPopupOpened].downloaded / (transfers[informationPopupOpened].current_time - transfers[informationPopupOpened].start_date)) }}<span style="font-size: 12px;margin-left: 3px;">{{ speedUnit(transfers[informationPopupOpened].downloaded / (transfers[informationPopupOpened].current_time - transfers[informationPopupOpened].start_date)) }}</span></template>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>

    $bluranimation: 135ms;
    .blur-animated {
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

    .full-background-shadow {
        position: fixed;

        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        z-index: 100;

        background-color: rgba(0, 0, 0, 0.75);

        pointer-events: none;
        opacity: 0;

        &.visible {
            pointer-events: all;
            opacity: 1;
        }

        transition: opacity 230ms;
    }

    .information-big-popup {
        position: fixed;

        width: 400px;
        height: 0;

        top: 85px;
        left: 0;
        right: 0;

        margin-left: auto;
        margin-right: auto;

        z-index: 110;

        background-color: #f5f7fa;
        box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
        border-radius: 8px;

        overflow: hidden;
        opacity: 0;
        pointer-events: none;

        &.visible {
            height: 183px;
            pointer-events: all;
            opacity: 1;
        }

        transition: opacity 200ms, height 350ms;

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

            color: #aaaaaa;
            &:hover { color: #444444; }
            cursor: pointer;
            transition: color 150ms;
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

            @keyframes kill-popup-open-animation {
                0% { width: 0; opacity: 0; }
                100% { width: 240px; opacity: 1; }
            }
            animation: kill-popup-open-animation 200ms;

            opacity: 1;
            width: 240px;
            overflow: hidden;

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
                right: 32px;
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

            overflow: hidden;

            opacity: 1;
            height: 52px;

            top: -18px;
            right: -7px;

            display: block;
            //background-color: rgba(255, 0, 0, 0.2);
            background-color: white;
            box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
            border-radius: 6px;
            cursor: default;

            width: 0px;
            &.popup-opened-mini { width: 195px; }
            &.popup-opened-big { width: 265px; }
            transition: width 200ms;

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

                white-space: nowrap;
                text-overflow: clip;
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

            &:hover {
                background-color: rgba(0, 0, 0, 0.05);
                -webkit-transition: $bluranimation -webkit-filter linear, background-color 100ms;
                -moz-transition: $bluranimation -moz-filter linear, background-color 100ms;
                -moz-transition: $bluranimation filter linear, background-color 100ms;
                -ms-transition: $bluranimation -ms-filter linear, background-color 100ms;
                -o-transition: $bluranimation -o-filter linear, background-color 100ms;
                transition: $bluranimation filter linear, $bluranimation -webkit-filter linear, background-color 100ms;
            }

            -webkit-transition: $bluranimation -webkit-filter linear, background-color 250ms;
            -moz-transition: $bluranimation -moz-filter linear, background-color 250ms;
            -moz-transition: $bluranimation filter linear, background-color 250ms;
            -ms-transition: $bluranimation -ms-filter linear, background-color 250ms;
            -o-transition: $bluranimation -o-filter linear, background-color 250ms;
            transition: $bluranimation filter linear, $bluranimation -webkit-filter linear, background-color 250ms;

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
        position: relative;
        $height: 4px;
        height: $height;
        width: 100%;
        display: inline-block;
        transform: translateY(3px);


        .bar-1, .bar-2, .bar-3, .bar-4 {
            height: 100%;
            display: inline-block;
        }

        &.transfer-state-0 {
            .bar-1, .bar-4 { background-color: #dfdfdf; }
            .bar-2 { background-color: #5595e0; }
            .bar-3 { background-color: #92d4ff; }
        }

        &.transfer-state-1 {
            .bar-1, .bar-4 { background-color: #dfdfdf; }
            .bar-2 { background-color: #43c66d; }
            .bar-3 { background-color: #c3e8cd; }
        }

        &.transfer-state-2 {
            .bar-1, .bar-4 { background-color: #dfdfdf; }
            .bar-2 { background-color: #797979; }
            .bar-3 { background-color: #aaaaaa; }
        }

        &.transfer-state-3, &.transfer-state-4 {
            .bar-1, .bar-4 { background-color: #dfdfdf; }
            .bar-2 { background-color: #c67365; }
            .bar-3 { background-color: #f3b9b3; }
        }


        div:first-child {
            border-top-left-radius: $height;
            border-bottom-left-radius: $height;
        }

        div:last-child {
            border-top-right-radius: $height;
            border-bottom-right-radius: $height;
        }

        .progress-percentage {
            position: absolute;

            top: -3px;
            left: 0;
            width: 100%;
            text-align: center;
            height: 8px;

            font-size: 11px;
            font-weight: 300;

            color: #444444;
        }
    }
</style>

<script>
    import orderBy from 'lodash';

    export default {
        name: 'Monitoring',
        data () {
            return {
                lastError: null,

                notBlurredLine: null,
                popupAutocloseTimeout: null,

                killPopupOpened: null,
                killPopupRequest: false,

                speedPopupOpened: null,
                speedPopupRequest: false,
                popupSetOpeningClass: false,

                speedLimitInput: null,
                speedLimitEnabled: null,
                speedLimitUnit: null,

                informationPopupOpened: null,
                informationPopupDurationInterval: null,
                informationPopupDuration: 0,

                isClearingTransfers: false,

                transfers: {
                    /*
                    "3005baba-d0dd-4435-9bc4-0136c955f934": {
                        "guid": "3005baba-d0dd-4435-9bc4-0136c955f934",
                        "current_speed": 14485783,
                        "CurrentSpeedLimitDelay": 0,
                        "current_speed_limit": 0,
                        "ShouldInterrupt": true,
                        "current_state": 4,
                        "downloaded": 40898560,
                        "ClientIP": "",
                        "start_date": 1537037092,
                        "end_date": 1537037094,
                        "Url": "",
                        "UrlExpiration": "0001-01-01T00:00:00Z",
                        "UrlSpeedLimit": 0,
                        "file_length": 3368163328,
                        "file_name": "Win10_1511_2_French_x32.iso",
                        "FilePath": "/Windows/Windows 10 - 1511/Win10_1511_2_French_x32.iso",
                        "section_start": 0,
                        "section_length": 3368163328,
                        "BufferSize": 20480
                    },
                    "a4e95d2a-cc70-40b9-b822-82c60b983e61": {
                        "guid": "a4e95d2a-cc70-40b9-b822-82c60b983e61",
                        "current_speed": 20399389,
                        "CurrentSpeedLimitDelay": 0,
                        "current_speed_limit": 0,
                        "ShouldInterrupt": false,
                        "current_state": 2,
                        "downloaded": 108625920,
                        "ClientIP": "",
                        "start_date": 1537037078,
                        "end_date": 1537037082,
                        "Url": "",
                        "UrlExpiration": "0001-01-01T00:00:00Z",
                        "UrlSpeedLimit": 0,
                        "file_length": 3368163328,
                        "file_name": "Win10_1511_2_French_x32.iso",
                        "FilePath": "/Windows/Windows 10 - 1511/Win10_1511_2_French_x32.iso",
                        "section_start": 0,
                        "section_length": 3368163328,
                        "BufferSize": 20480
                    },
                    "cdf5c328-2380-41ac-9ccd-d8d4eca36f4b": {
                        "guid": "cdf5c328-2380-41ac-9ccd-d8d4eca36f4b",
                        "current_speed": 18790733,
                        "CurrentSpeedLimitDelay": 0,
                        "current_speed_limit": 0,
                        "ShouldInterrupt": false,
                        "current_state": 0,
                        "downloaded": 131031040,
                        "ClientIP": "",
                        "start_date": 1537037107,
                        "end_date": -62135596800,
                        "Url": "",
                        "UrlExpiration": "0001-01-01T00:00:00Z",
                        "UrlSpeedLimit": 0,
                        "file_length": 3368163328,
                        "file_name": "Win10_1511_2_French_x32.iso",
                        "FilePath": "/Windows/Windows 10 - 1511/Win10_1511_2_French_x32.iso",
                        "section_start": 0,
                        "section_length": 3368163328,
                        "BufferSize": 20480
                    },
                    "cdf5c328-2380-41ac-9ccd-d8d4eca36f4qsdqsdb": {
                        "guid": "cdf5c328-2380-41ac-9ccd-d8d4eca36f4qsdqsdb",
                        "current_speed": 18790733,
                        "CurrentSpeedLimitDelay": 0,
                        "current_speed_limit": 0,
                        "ShouldInterrupt": false,
                        "current_state": 1,
                        "downloaded": 131031040,
                        "ClientIP": "",
                        "start_date": 1537037107,
                        "end_date": -62135596800,
                        "Url": "",
                        "UrlExpiration": "0001-01-01T00:00:00Z",
                        "UrlSpeedLimit": 0,
                        "file_length": 3368163328,
                        "file_name": "Win10_1511_2_French_x32.iso",
                        "FilePath": "/Windows/Windows 10 - 1511/Win10_1511_2_French_x32.iso",
                        "section_start": 0,
                        "section_length": 3368163328,
                        "BufferSize": 20480
                    },
                    "cdf5c328-2380-41ac-2321323d-d8d4eca36f4b": {
                        "guid": "cdf5c328-2380-41ac-2321323d-d8d4eca36f4b",
                        "current_speed": 18790733,
                        "CurrentSpeedLimitDelay": 0,
                        "current_speed_limit": 0,
                        "ShouldInterrupt": false,
                        "current_state": 3,
                        "downloaded": 131031040,
                        "ClientIP": "",
                        "start_date": 1537037107,
                        "end_date": -62135596800,
                        "Url": "",
                        "UrlExpiration": "0001-01-01T00:00:00Z",
                        "UrlSpeedLimit": 0,
                        "file_length": 3368163328,
                        "file_name": "Win10_1511_2_French_x32.iso",
                        "FilePath": "/Windows/Windows 10 - 1511/Win10_1511_2_French_x32.iso",
                        "section_start": 0,
                        "section_length": 3368163328,
                        "BufferSize": 20480
                    }
                },
                    /*
                    [
                    {
                        current_state: 0, // ok
                        file_name: 'Win10_1703_French_x64.iso', // ok

                        section_start: 0, // ok
                        downloaded: 26549844 / 2, // ok
                        section_length: 26549844, // ok
                        file_length: 26549844, // ok

                        start_date: 1536854285, // ok
                        end_date: 0, // ok

                        current_speed: 512397, // ok
                        current_speed_limit: 0, // ok
                    },
                    {
                        current_state: 1,
                        file_name: 'debian-9.1.0-amd64-netinst.iso',

                        section_start: 0,
                        downloaded: 26549844 / 4,
                        section_length: 26549844 / 2,
                        file_length: 26549844,

                        start_date: 1536854285,
                        end_date: 1536854285 + 60,

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

                        start_date: 1536854285,
                        end_date: 1536854285 + 164,

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

                        start_date: 1536854285,
                        end_date: 1536854285 + 286,

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

                        start_date: 1536854285,
                        end_date: 1536854285 + 652,

                        current_speed: 1234567890234567,
                        current_speed_limit: 0,
                    },
                    ]*/
                },

                refreshTimeout: null,
                cancelRefreshTimeout: false,
            }
        },
        computed: {
            orderedTransfers: function () {
                return _.orderBy(this.transfers, ['current_state', 'section_start', 'start_date'], ['asc', 'asc', 'desc']);
            }
        },
        created() {
            this.fetchTransfers(this.startTimeoutFetchTransfers);
        },
        beforeDestroy() {
            if (this.refreshTimeout !== null) clearInterval(this.refreshTimeout);
            this.cancelRefreshTimeout = true;
        },
        methods: {
            startTimeoutFetchTransfers() {
                if (this.refreshTimeout !== null) clearInterval(this.refreshTimeout);
                if (this.cancelRefreshTimeout) return;

                this.refreshTimeout = setTimeout(() => {
                    this.refreshTimeout = null;

                    this.fetchTransfers(this.startTimeoutFetchTransfers);
                }, 500);
            },
            fetchTransfers(doneCallback) {
                this.$axios.get(this.$url + '/api/transfers')
                    .then((response) => {
                        this.transfers = response.data;
                        doneCallback();
                    })
                    .catch((err) => {
                        doneCallback();
                        this.lastError = err;
                    });
            },
            clearTransfers() {
                if (this.isClearingTransfers) return;

                this.isClearingTransfers = true;
                this.$axios.delete(this.$url + '/api/transfers')
                    .then((response) => {
                        setTimeout(() => {
                            this.transfers = response.data;
                            this.isClearingTransfers = false;
                        }, 500);
                    })
                    .catch((err) => {
                        setTimeout(() => {
                            this.lastError = err;
                            this.isClearingTransfers = false;
                        }, 500);
                    });
            },
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
                speed = Math.floor(speed);
                let len = (speed + '').length;

                if (len > 12) return 'To/s';
                else if (len >= 9) return 'Go/s';
                else if (len >= 6) return 'Mo/s';
                else if (len >= 3) return 'Ko/s';
                else return 'o/s';
            },
            speedRound(speed) {
                speed = Math.floor(speed);
                let len = (speed + '').length;

                if (len > 14) return (speed / 10 ** 12).toFixed(0);
                else if (len > 13) return (speed / 10 ** 12).toFixed(1);
                else if (len > 12) return (speed / 10 ** 12).toFixed(2);
                else if (len > 11) return (speed / 10 ** 9).toFixed(0);
                else if (len > 10) return (speed / 10 ** 9).toFixed(1);
                else if (len >= 9) return (speed / 10 ** 9).toFixed(2);
                else if (len > 8) return (speed / 10 ** 6).toFixed(0);
                else if (len > 7) return (speed / 10 ** 6).toFixed(1);
                else if (len >= 6) return (speed / 10 ** 6).toFixed(2);
                else if (len > 5) return (speed / 10 ** 3).toFixed(0);
                else if (len > 4) return (speed / 10 ** 3).toFixed(1);
                else if (len >= 3) return (speed / 10 ** 3).toFixed(2);
                else return speed;
            },
            formSpeedUnit(speed) {
                speed = Math.floor(speed);
                let len = (speed + '').length;

                if (len > 6) return 1000000;
                else if (len > 3) return 1000;
                else return 1;
            },
            formSpeedRound(speed) {
                speed = Math.floor(speed);
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

                if (this.informationPopupDurationInterval !== null) {
                    clearInterval(this.informationPopupDurationInterval);
                    this.informationPopupDurationInterval = null;
                }

                this.notBlurredLine = null;
                this.killPopupOpened = null;
                this.popupSetOpeningClass = false;
                this.speedPopupOpened = null;
                this.informationPopupOpened = null;

                return true;
            },
            clearAutoclose() {
                if (this.popupAutocloseTimeout === null) return;

                clearTimeout(this.popupAutocloseTimeout);
            },

            killPopupOpen(guid) {
                if (this.killPopupOpened !== null && this.killPopupRequest) return;
                if (this.transfers[guid].current_state !== 0) return;

                if (this.closeAnyPopup()) {
                    this.killPopupOpened = guid;
                    this.notBlurredLine = guid;
                }
            },
            killPopupKill(guid) {
                if (this.killPopupOpened === null) return;
                if (this.killPopupRequest) return;

                this.killPopupRequest = true;

                this.$axios.delete(this.$url + '/api/transfer/' + guid + '/')
                    .then(() => {
                        setTimeout(() => {
                            this.killPopupRequest = false;
                            this.closeAnyPopup();
                        }, 600);
                    })
                    .catch((err) => {
                        setTimeout(() => {
                            this.killPopupRequest = false;
                            this.closeAnyPopup();
                        }, 600);

                        // Todo: prévenir qu'il y a eu une erreur
                        console.log(err);
                    });
            },
            killPopupAutoclose() {
                if (this.killPopupRequest) return;

                this.popupAutocloseTimeout = setTimeout(() => {
                    if (this.killPopupRequest) return;

                    this.closeAnyPopup();
                }, 450);
            },

            speedPopupOpen(guid) {
                if (this.speedPopupOpened !== null && this.speedPopupRequest) return;
                if (this.transfers[guid].current_state !== 0) return;

                if (this.closeAnyPopup()) {
                    this.speedLimitEnabled = this.transfers[guid].current_speed_limit !== 0;
                    if (this.speedLimitEnabled) {
                        this.speedLimitUnit = this.formSpeedUnit(this.transfers[guid].current_speed_limit);
                        this.speedLimitInput = this.formSpeedRound(this.transfers[guid].current_speed_limit);
                    } else {
                        this.speedLimitUnit = 1000000;
                        this.speedLimitInput = 1;
                    }

                    this.speedPopupOpened = guid;
                    setTimeout(() => { this.popupSetOpeningClass = true; }, 20);
                    this.notBlurredLine = guid;
                }
            },
            sendSpeedLimit(guid, callback, speed_limit, delay) {
                this.speedPopupRequest = true;

                this.$axios.patch(this.$url + '/api/transfer/' + guid + '/', {speed_limit: speed_limit})
                    .then((response) => {
                        setTimeout(() => {
                            this.speedPopupRequest = false;
                            if (callback !== null) callback();
                        }, delay)
                    })
                    .catch((err) => {
                        console.log(err); // Todo: afficher l'erreur
                        setTimeout(() => {
                            this.speedPopupRequest = false;
                            if (callback !== null) callback();
                        }, delay)
                    })
            },
            speedPopupLimit(guid) {
                if (this.speedPopupOpened === null) return;
                if (this.speedPopupRequest) return;


                this.sendSpeedLimit(guid, this.closeAnyPopup, this.speedLimitInput * this.speedLimitUnit, 600);
            },
            speedCheckboxChanged(guid) {
                if (!this.speedLimitEnabled) {
                    this.sendSpeedLimit(guid, null, 0, 100);
                }
            },
            speedPopupAutoclose() {
                return;
                if (this.speedPopupRequest) return;

                this.popupAutocloseTimeout = setTimeout(() => {
                    if (this.speedPopupRequest) return;

                    this.closeAnyPopup();
                }, 450);
            },
            infoPopupOpen(guid) {
                if (this.informationPopupOpened !== null) return;

                if (this.closeAnyPopup()) {
                    this.informationPopupDuration = this.transfers[guid].current_time - this.transfers[guid].start_date;

                    if (this.informationPopupDurationInterval !== null) {
                        clearInterval(this.informationPopupDurationInterval);
                        this.informationPopupDurationInterval = null;
                    }

                    if (this.transfers[guid].current_state === 0) {
                        this.informationPopupDurationInterval = setInterval(() => {
                            if (this.transfers[guid].current_state !== 0) {
                                if (this.informationPopupDurationInterval !== null) {
                                    clearInterval(this.informationPopupDurationInterval);
                                    this.informationPopupDurationInterval = null;
                                }
                                return;
                            }
                            this.informationPopupDuration++;
                        }, 1000)
                    }

                    this.informationPopupOpened = guid;
                    this.notBlurredLine = guid;
                }
            },

            niceTime(seconds) {
                let date = new Date(null);
                date.setSeconds(seconds); // specify value for SECONDS here
                return date.toISOString().substr(11, 8);
            },

            niceDate(seconds) {
                let date = new Date(null);
                date.setSeconds(seconds); // specify value for SECONDS here
                return date.toISOString().substr(0, 19).replace('T', ' ');
            },
        }
    }
</script>
