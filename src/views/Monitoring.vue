<template>
    <div class="columns is-centered">
        <div class="column is-10-desktop is-9-fullhd">
            <table class="table">
                <thead>
                <tr>
                    <th width="30px"></th>
                    <th></th>
                    <th width="50px"></th>
                    <th width="215px"></th>
                    <th width="100px"></th>
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
                <tr v-for="(transfer, i) in transfers" :key="i">
                    <td><i class="fal" :class="stateIcon(transfer.current_state)"></i></td>
                    <td><a href="http://google.fr">{{ transfer.file_name }}</a></td>
                    <td class="speed-indicator">{{ speedRound(transfer.current_speed) }}<span class="unit">{{ speedUnit(transfer.current_speed) }}</span></td>
                    <td>
                        <div class="progress-bar"><div class="bar-1" :style="{width: percentBar1(transfer) + '%'}" v-if="percentBar1(transfer) > 0"></div><div class="bar-2" :style="{width: percentBar2(transfer) + '%'}" v-if="percentBar2(transfer) > 0"></div><div class="bar-3" :style="{width: percentBar3(transfer) + '%'}" v-if="percentBar3(transfer) > 0"></div><div class="bar-4" :style="{width: percentBar4(transfer) + '%'}" v-if="percentBar4(transfer) > 0"></div></div>
                    </td>
                    <td>
                        <i class="fal fa-tachometer" style="margin-right: 6px;"></i>
                        <i class="fal fa-skull" style="margin-right: 6px;"></i>
                        <i class="fal fa-info-circle"></i>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss">
    table.table {


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
                line-height: $height;
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
                    font-weight: 500;

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
                transfers: [
                    {
                        current_state: 0,
                        file_name: 'Win10_1703_French_x64.iso',

                        section_start: 0,
                        downloaded: 26549844 / 2,
                        section_length: 26549844,
                        file_length: 26549844,

                        current_speed: 512397,
                    },
                    {
                        current_state: 1,
                        file_name: 'debian-9.1.0-amd64-netinst.iso',

                        section_start: 0,
                        downloaded: 26549844 / 4,
                        section_length: 26549844 / 2,
                        file_length: 26549844,

                        current_speed: 984,
                    },
                    {
                        current_state: 2,
                        file_name: 'ubuntu-17.04-server-amd64.iso',

                        section_start: 26549844 / 3,
                        downloaded: 26549844 / 6,
                        section_length: 26549844 / 3,
                        file_length: 26549844,

                        current_speed: 12587,
                    },
                    {
                        current_state: 3,
                        file_name: 'fr_office_professional_plus_2010_with_sp1_x86_x64_dvd_730410.iso',

                        section_start: 26549844 / 2,
                        downloaded: 26549844 / 4,
                        section_length: 26549844 / 2,
                        file_length: 26549844,

                        current_speed: 1574971,
                    },
                    {
                        current_state: 4,
                        file_name: 'ESXi-6.5.0-4564106.iso',

                        section_start: 26549844 * 3 / 4,
                        downloaded: 26549844 / 8,
                        section_length: 26549844 / 4,
                        file_length: 26549844,

                        current_speed: 24658793,
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
                if (speed >= 10 ** 9) return 'Go/s';
                else if (speed >= 10 ** 6) return 'Mo/s';
                else if (speed >= 10 ** 3) return 'Ko/s';
                else return 'o/s';
            },
            speedRound(speed) {
                if (speed >= 10 ** 11) return (speed / 10 ** 9).toFixed(0);
                else if (speed >= 10 ** 10) return (speed / 10 ** 9).toFixed(1);
                else if (speed >= 10 ** 9) return (speed / 10 ** 9).toFixed(2);
                else if (speed >= 10 ** 8) return (speed / 10 ** 6).toFixed(0);
                else if (speed >= 10 ** 7) return (speed / 10 ** 6).toFixed(1);
                else if (speed >= 10 ** 6) return (speed / 10 ** 6).toFixed(2);
                else if (speed >= 10 ** 3) return (speed / 10 ** 3).toFixed(0);
                else return speed;
            }
        }
    }
</script>
