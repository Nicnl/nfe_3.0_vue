<template>
    <div class="columns is-centered">
        <div class="column is-10-desktop is-9-fullhd">
            <table class="table">
                <thead>
                <tr>
                    <th width="30px"></th>
                    <th></th>
                    <th width="80px"></th>
                    <th width="20px"></th>
                </tr>
                </thead>
                <tfoot>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                </tfoot>
                <tbody>

                <tr v-for="(dir, i) in dirs" :key="'dir' + i">
                    <td><i class="fal fa-folder"></i></td>
                    <td colspan="2"><a href="http://google.fr">{{ dir.name }}</a></td>
                    <td class="share-button" @click="openShareDirPopup"><i class="fal fa-share-square"></i></td>
                </tr>

                <tr v-for="(file, i) in files" :key="'file' + i">
                    <td><i class="fal" :class="icon(file.name)"></i></td>
                    <td><a href="http://google.fr">{{ file.name }}</a></td>
                    <td><span class="size">{{ sizeRound(file.size) }}</span><span class="extension">{{ sizeUnit(file.size) }}</span></td>
                    <td class="share-button" @click="openShareFilePopup"><i class="fal fa-share-square"></i></td>
                </tr>
                </tbody>
            </table>
        </div>


        <div class="full-background-shadow" :class="{visible: shareFilePopupOpened || shareDirPopupOpened}" @click="closeAnyPopup"></div>
        <div class="share-popup" :class="{visible: shareFilePopupOpened || shareDirPopupOpened}">
            <div class="share-title"><h4>Partager un {{ shareFilePopupOpened && !shareDirPopupOpened ? 'fichier' : '' }}{{ !shareFilePopupOpened && shareDirPopupOpened ? 'dossier' : '' }}</h4></div>

            <div class="pretty p-switch p-fill speed-limit-checkbox"><input type="checkbox" v-model="speedLimitEnabled"/><div class="state p-info"><label></label></div></div>
            <h4 class="limit-speed-title">Limiter le débit</h4>

            <div class="field has-addons has-addons-centered speed-limit-form" :class="{hidden: !speedLimitEnabled}">
                <p class="control"><input class="input" type="text" placeholder="Débit" v-model="speedLimitInput"></p>
                <p class="control">
                    <span class="select">
                        <select v-model="speedLimitUnit">
                            <option value="0">o/s</option>
                            <option value="1">Ko/s</option>
                            <option value="2">Mo/s</option>
                        </select>
                    </span>
                </p>
            </div>

            <div class="pretty p-switch p-fill time-limit-checkbox"><input type="checkbox" v-model="timeLimitEnabled"/><div class="state p-info"><label></label></div></div>
            <h4 class="limit-time-title">Limiter la durée</h4>

            <div class="field has-addons has-addons-centered time-limit-form" :class="{hidden: !timeLimitEnabled}">
                <p class="control"><input class="input" type="text" placeholder="Débit" v-model="timeLimitInput"></p>
                <p class="control">
                    <span class="select">
                        <select v-model="timeLimitUnit">
                            <option :value="1">secondes</option>
                            <option :value="1 * 60">minutes</option>
                            <option :value="1 * 60 * 60">heures</option>
                            <option :value="1 * 60 * 60 * 24">jours</option>
                            <option :value="1 * 60 * 60 * 24 * 7">semaines</option>
                        </select>
                    </span>
                </p>
            </div>

            <div class="field link-text-area">
                <div class="control is-small" :class="{'is-loading': generatingLinkRequest}">
                    <textarea class="textarea is-small" type="text" placeholder="" readonly></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .share-popup {
        position: fixed;

        width: 370px;
        height: 0;

        top: 85px;
        left: 0;
        right: 0;

        margin-left: auto;
        margin-right: auto;

        z-index: 110;

        background-color: #f5f7fa;
        box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
        border-radius: 10px;

        overflow: hidden;
        opacity: 0;
        pointer-events: none;

        &.visible {
            height: 200px;
            pointer-events: all;
            opacity: 1;
        }

        transition: opacity 200ms, height 350ms;

        .share-title {
            position: absolute;
            top: 3px;
            width: 100%;
            background-color: #edeff2;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
            h4 {
                font-size: 16px;
                margin-left: 4px;
            }
        }

        .limit-speed-title {
            position: absolute;
            top: 44px;
            left: 57px;

            font-size: 15px;
            font-weight: 300;

            opacity: 1;
            pointer-events: all;

            &.hidden {
                opacity: 0;
                pointer-events: none;
            }

            transition: opacity 200ms;
        }

        .limit-time-title {
            position: absolute;
            top: 91px;
            left: 57px;

            font-size: 15px;
            font-weight: 300;

            opacity: 1;
            pointer-events: all;

            &.hidden {
                opacity: 0;
                pointer-events: none;
            }

            transition: opacity 200ms;
        }

        .link-text-area {
            position: absolute;

            width: 100%;

            background-color: red;

            left: 0;
            bottom: 0;

            textarea {
                min-height: 65px;
            }
        }

        .p-switch {
            position: absolute;
            left: 15px;

            &.speed-limit-checkbox { top: 49px; }
            &.time-limit-checkbox { top: 96px; }
        }

        .p-switch label:after {
            // hotfix
            top: calc((0% - (100% - 1em)) - 10%);
        }

        .speed-limit-form {
            position: absolute;
            top: 38px;
            left: 170px;

            input {
                width: 65px;
            }

            opacity: 1;
            &.hidden {
                pointer-events: none;
                opacity: 0;
            }
            transition: opacity 200ms;
        }

        .time-limit-form {
            position: absolute;
            top: 85px;
            left: 170px;

            input {
                width: 65px;
            }

            opacity: 1;
            &.hidden {
                pointer-events: none;
                opacity: 0;
            }
            transition: opacity 200ms;
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
                vertical-align: middle;

                a {
                    color: inherit;
                    display: block;
                    text-decoration: none;
                    cursor: pointer;
                    height: 37px;
                    line-height: 36px;
                }

                &.share-button {
                    color: #dfdfdf;
                    cursor: pointer;
                }

                &.share-button:hover {
                    color: #444444;
                }

                transition: color 200ms;

                .extension {
                    margin-left: 3px;
                    font-size: 13px;
                }

                .size {
                    font-size: 15px;
                }
            }
        }
    }
</style>

<script>
    const iconExceptions = {
        'fa-file-code': [
            'dockerfile',
            'readme.md',
            'license',
            'vagrantfile'
        ]
    };
    const iconRules = {
        'fa-file-word': ['doc', 'docx', 'dot', 'odt', 'ott', 'oth', 'odm', 'sxw', 'stw', 'sxg', 'docm', 'dotx'],
        'fa-file-video': ['mp4', 'mov', 'webm', 'mkv', 'avi', 'wmv', 'm4p', 'mp4a', 'mp4v', 'm4v', 'mpg', 'mpeg', 'flv', 'vob', 'xvid'],
        'fa-file-spreadsheet': ['xls', 'xlw', 'lxt', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlsb', 'ods', 'ots', 'sxc', 'stc'],
        'fa-file-powerpoint': ['pps', 'ppt', 'pot', 'pptx', 'pptm', 'potx', 'potm'],
        'fa-file-pdf': ['pdf'],
        'fa-file-audio': ['mp3', 'aac', 'wma', 'wav', 'flac', 'alac', 'ogg', 'aif', 'aiff', 'mid', 'm4a'],
        'fa-file-archive': ['tar.gz', 'tgz', 'tar.Z', 'tar.bz2', 'tar.lzma', 'tlz', 'tar.xz', 'txz', 'tbz2', 'zip', 'rar', 'apk', 'cab', 'dmg', 'pak', 'zpaq'],
        'fa-file-alt': ['txt', 'md', 'rtf'],
        'fa-file-image': ['tif', 'tiff', 'bmp', 'jpg', 'jpeg', 'gif', 'png', 'eps', 'raw', 'cr2', 'nef', 'orf', 'sr2', 'psd', 'svg', 'ico'],
        'fa-file-code': [
            /* web */ 'htm', 'html', 'css', 'sass', 'scss', 'vue', 'js', 'php', 'phtml', 'ts',
            /* c */ 'c', 'cpp', 'h', 'hpp', 'tpp', 'ipp', 'o',
            /* java */ 'class', 'java',
            /* go */ 'go', 'mod',
            /* python */ 'py', 'pyc',
            /* data */ 'xml', 'json,', 'yml', 'yaml', 'ini', 'env', 'toml', 'cson', 'bson', 'cfg',
            /* script */ 'sh', 'bash',
            /* other */ 'gitignore',
            /* hell */ 'vb', 'vbs', 'bat', 'vbx',
            /* rust */ 'rs',
            /* ruby */ 'rb',
            /* clojure */ 'clj',
            /* c# */ 'cs',
            /* db */ 'sql',
            /* apple */ 'm', 'swift',
            /* perl */ 'pl'
        ]
    };

    export default {
        name: 'ListFiles',
        data () {
            return {
                shareFilePopupOpened: true,
                shareDirPopupOpened: false,

                generatingLinkRequest: false,

                speedLimitInput: 1,
                speedLimitEnabled: false,
                speedLimitUnit: 0,

                timeLimitInput: 15,
                timeLimitEnabled: true,
                timeLimitUnit: 60,

                dirs: [
                    {
                        name: 'Windows',
                    },
                    {
                        name: 'Linux',
                    },
                ],
                files: [
                    {
                        name: 'document.doc',
                        size: 4136749512
                    },
                    {
                        name: 'superman.mkv',
                        size: 768
                    },
                    {
                        name: 'statistics.xls',
                        size: 58718
                    },
                    {
                        name: 'presentation.ppt',
                        size: 658718
                    },
                    {
                        name: 'manuel.pdf',
                        size: 8718
                    },
                    {
                        name: 'music.mp3',
                        size: 8718
                    },
                    {
                        name: 'backup.tar.gz',
                        size: 8718
                    },
                    {
                        name: 'README.md',
                        size: 8718
                    },
                    {
                        name: 'photo_famille.jpeg',
                        size: 8718
                    },
                    {
                        name: 'main.go',
                        size: 8718
                    },
                    {
                        name: 'Dockerfile',
                        size: 8718
                    },
                ],
            }
        },
        methods: {
            sizeUnit(speed) {
                let len = (speed + '').length;

                if (len > 12) return 'To';
                else if (len > 9) return 'Go';
                else if (len > 6) return 'Mo';
                else if (len > 3) return 'Ko';
                else return 'o';
            },
            sizeRound(speed) {
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
            icon(filename) {
                filename = filename.toLowerCase();

                for (let iconName in iconExceptions) {
                    for (let i in iconExceptions[iconName]) {
                        if (filename == iconExceptions[iconName][i])
                            return iconName;
                    }
                }

                for (let iconName in iconRules) {
                    for (let i in iconRules[iconName]) {
                        if (filename.endsWith('.' + iconRules[iconName][i]))
                            return iconName;
                    }
                }
                return 'fa-file';
            },
            closeAnyPopup() {
                this.shareFilePopupOpened = false;
                this.shareDirPopupOpened = false;

                return true;
            },
            openShareFilePopup() {
                if (!this.closeAnyPopup()) return;
                this.shareFilePopupOpened = true;
            },
            openShareDirPopup() {
                if (!this.closeAnyPopup()) return;
                this.shareDirPopupOpened = true;
            },
        }
    }
</script>
