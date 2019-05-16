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
            <table v-if="displayList === null" class="table">
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

                <tr class="blur-animated" :class="{blurred: notBlurredDir !== null, unblurred: notBlurredDir === null}" v-if="parent_path !== null">
                    <td><i class="fal fa-folders"></i></td>
                    <td colspan="3">
                        <router-link :to="{ name: 'ListFilesM', params: { path: parent_path } }" v-if="parent_path !== ''">..</router-link>
                        <router-link :to="{ name: 'ListFilesHome' }" v-if="parent_path === ''">..</router-link>
                    </td>
                </tr>

                <tr v-for="(dir, i) in dirs" :key="'dir' + i" class="blur-animated" :class="{blurred: notBlurredDir !== null && i !== notBlurredDir, unblurred: !(notBlurredDir !== null && i !== notBlurredDir)}">
                    <td><i class="fal fa-folder"></i></td>
                    <td colspan="2"><router-link :to="{ name: 'ListFilesM', params: { path: dir.path } }">{{ dir.name }}</router-link></td>
                    <td class="share-button" @click="openShareDirPopup(i)"><i class="fal fa-share-square"></i></td>
                </tr>

                <tr v-for="(file, i) in files" :key="'file' + i" class="blur-animated" :class="{blurred: notBlurredFile !== null && i !== notBlurredFile, unblurred: !(notBlurredFile !== null && i !== notBlurredFile)}">
                    <td><i class="fal" :class="icon(file.name)"></i></td>
                    <td><a :href="$downurl + '/' + file.path + '/' + file.name>{{ file.name }}</a></td>
                    <td><span class="size">{{ sizeRound(file.size) }}</span><span class="extension">{{ sizeUnit(file.size) }}</span></td>
                    <td class="share-button" @click="openShareFilePopup(i)"><i class="fal fa-share-square"></i></td>
                </tr>
                </tbody>
            </table>

            <template v-else>
                <div class="button is-loading generate-link-loading" v-if="generatingLinks" disabled></div>
                <pre class="link-list">{{ displayList }}</pre>
            </template>
        </div>


        <div class="full-background-shadow" :class="{visible: shareFilePopupOpened || shareDirPopupOpened || shareListPopupEnabled}" @click="closeAnyPopup(true)"></div>
        <div class="share-popup" :class="{visible: shareFilePopupOpened || shareDirPopupOpened || shareListPopupEnabled, smaller: shareListPopupEnabled}">

            <div class="share-title">
                <h4 v-if="shareListPopupEnabled">Génération de liens</h4>
                <h4 v-else>Partager un {{ shareFilePopupOpened && !shareDirPopupOpened ? 'fichier' : '' }}{{ !shareFilePopupOpened && shareDirPopupOpened ? 'dossier' : '' }}</h4>
            </div>

            <div class="pretty p-switch p-fill speed-limit-checkbox"><input type="checkbox" v-model="speedLimitEnabled" @change="linkParametersChanged" :disabled="$session.get('max_bandwidth') > 0"/><div class="state p-info"><label></label></div></div>
            <h4 class="limit-speed-title">Limiter le débit</h4>

            <div class="field has-addons has-addons-centered speed-limit-form" :class="{hidden: !speedLimitEnabled}">
                <p class="control"><input class="input" type="text" placeholder="Débit" v-model="speedLimitInput" @keyup="linkParametersChanged"></p>
                <p class="control">
                    <span class="select" @change="linkParametersChanged">
                        <select v-model="speedLimitUnit">
                            <option value="1">o/s</option>
                            <option v-if="!$session.get('max_bandwidth') || $session.get('max_bandwidth') >= 1000" value="1000">Ko/s</option>
                            <option v-if="!$session.get('max_bandwidth') || $session.get('max_bandwidth') >= 1000000" value="1000000">Mo/s</option>
                        </select>
                    </span>
                </p>
            </div>

            <div class="pretty p-switch p-fill time-limit-checkbox"><input type="checkbox" v-model="timeLimitEnabled" @change="linkParametersChanged" :disabled="$session.get('max_duration') > 0"/><div class="state p-info"><label></label></div></div>
            <h4 class="limit-time-title">Limiter la durée</h4>

            <div class="field has-addons has-addons-centered time-limit-form" :class="{hidden: !timeLimitEnabled}">
                <p class="control"><input class="input" type="text" placeholder="Débit" v-model="timeLimitInput" @keyup="linkParametersChanged"></p>
                <p class="control">
                    <span class="select">
                        <select v-model="timeLimitUnit" @change="linkParametersChanged">
                            <option :value="1">secondes</option>
                            <option v-if="!$session.get('max_duration') || $session.get('max_duration') >= 1 * 60" :value="1 * 60">minutes</option>
                            <option v-if="!$session.get('max_duration') || $session.get('max_duration') >= 1 * 60 * 60" :value="1 * 60 * 60">heures</option>
                            <option v-if="!$session.get('max_duration') || $session.get('max_duration') >= 1 * 60 * 60 * 24" :value="1 * 60 * 60 * 24">jours</option>
                            <option v-if="!$session.get('max_duration') || $session.get('max_duration') >= 1 * 60 * 60 * 24 * 7" :value="1 * 60 * 60 * 24 * 7">semaines</option>
                        </select>
                    </span>
                </p>
            </div>

            <div v-if="shareListPopupEnabled" class="">
                <div class="generate-link-button button is-info" @click="generateLinks">Générer les liens</div>
            </div>

            <div v-else class="field link-text-area">
                <div class="control is-small" :class="{'is-loading': generatingLinkRequest}">
                    <textarea class="textarea is-small" type="text" placeholder="" v-model="generatedLink" @click="$event.target.select()" readonly></textarea>
                </div>
            </div>
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
        border-radius: 8px;

        overflow: hidden;
        opacity: 0;
        pointer-events: none;

        &.visible {
            height: 200px;
            pointer-events: all;
            opacity: 1;
        }

        &.smaller {
            height: 170px;
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

        .link-text-area, .generate-link-button {
            position: absolute;

            width: 100%;

            //background-color: red;

            left: 0;
            bottom: 0;

            textarea {
                resize: none;
                min-height: 65px;

                font-weight: 300;
                color: #868686;

                &::-webkit-scrollbar {
                    width: 4px;
                }

                &::-webkit-scrollbar-thumb {
                    background-color: #808080;
                    border-radius: 3px;
                }
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

    .generate-link-loading {
        position: absolute;

        margin-top: 11px;
        margin-left: -36px;

        width: 32px;
        height: 32px;
    }

    .link-list {
        margin-top: 10px;
        background-color: white;
        padding: 9px;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.13);
        font-size: 10.5px;
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

    import debounce from 'lodash';

    export default {
        name: 'ListFiles',
        data () {
            return {
                lastError: null,

                notBlurredFile: null,
                notBlurredDir: null,

                shareBasePath: null,

                shareFilePopupOpened: false,
                shareDirPopupOpened: false,
                shareListPopupEnabled: false,

                generatingLinks: false,
                displayList: null,
                linksToGenerate: [],

                speedLimitInput: 1,
                speedLimitEnabled: !!this.$session.get('max_bandwidth'),
                speedLimitUnit: 1000000,

                timeLimitInput: 15,
                timeLimitEnabled: !!this.$session.get('max_duration'),
                timeLimitUnit: 60,

                shouldRegenLink: false,
                generatingLinkRequest: false,
                generatedLink: '',

                path: null,
                parent_path: null,
                dirs: [/*
                    {
                        name: 'Windows',
                    },
                    {
                        name: 'Linux',
                    },
                */],
                files: [
                    /*{
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
                    },*/
                ],
            }
        },
        created() {
            this.fetchList(this.routePath);

            this.$eventbus.$on('list_mode_changed', this.listModeChanged);
        },
        beforeDestroy() {
            this.$eventbus.$emit('list_mode_disable');
            this.$eventbus.$off('list_mode_changed', this.listModeChanged);
        },
        watch: {
            '$route.params.path': function(path) {
                console.log("path has changed");

                this.$eventbus.$emit('list_mode_disable');
                this.generatingLinks = false;
                this.displayList = null;
                this.linksToGenerate = [];

                this.fetchList(this.routePath);
            },
        },
        computed: {
            routePath() {
                return this.$route.params.path ? this.$route.params.path : '';
            },
        },
        methods: {
            listModeChanged(state) {
                console.log("issou : " + state);
                if (state) {
                    this.openShareListPopup();
                } else {
                    this.generatingLinks = false;
                    this.displayList = null;
                    this.linksToGenerate = [];
                }
            },
            fetchList(path) {
                console.log("fetching list for:" + path);

                this.lastError = null;
                this.$axios.get(this.$url + '/api/ls/' + path)
                    .then((response) => {
                        response.data.dirs.sort((a, b) => a.name.localeCompare(b.name, undefined, {
                            numeric: true, // natural sort
                            sensitivity: 'base' // case insensitive
                        }));

                        response.data.files.sort((a, b) => a.name.localeCompare(b.name, undefined, {
                            numeric: true, // natural sort
                            sensitivity: 'base' // case insensitive
                        }));

                        this.path = response.data.path;
                        this.parent_path = response.data.parent_path;
                        this.dirs = response.data.dirs;
                        this.files = response.data.files;
                    })
                    .catch((err) => {
                        console.log(err); // Todo: afficher l'erreur

                        this.dirs = [];
                        this.files = [];

                        if (err.response.status === 400) {
                            this.lastError = 'Lien invalide.'
                        }
                        else if (err.response.status === 500) {
                            this.lastError = 'Erreur serveur';
                        }
                        else if (err.response.status === 404) {
                            this.lastError = 'Lien introuvable.';
                        }
                        else if (err.response.status === 401) {
                            this.lastError = 'Erreur d\'authentification.';
                        }
                        else {
                            this.lastError = 'Erreur inconnue.';
                        }
                    })
            },
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
            closeAnyPopup(revertOptions=false) {
                if (this.generatingLinkRequest) return false;
                if (this.generatingLinks) return false;

                if (revertOptions) {
                    this.$eventbus.$emit('list_mode_disable');
                }

                this.shareFilePopupOpened = false;
                this.shareDirPopupOpened = false;
                this.shareListPopupEnabled = false;

                this.notBlurredFile = null;
                this.notBlurredDir = null;

                return true;
            },
            openShareListPopup() {
                if (!this.closeAnyPopup()) return;

                this.speedLimitEnabled = !!this.$session.get('max_bandwidth') || false;
                if (this.$session.get('max_bandwidth')) {
                    this.figureOutSpeedLimit(this.$session.get('max_bandwidth'));
                } else {
                    this.speedLimitUnit = 1000000;
                    this.speedLimitInput = 1;
                }

                this.timeLimitEnabled = !!this.$session.get('max_duration') || true;
                if (this.$session.get('max_duration') && 60*15 > this.$session.get('max_duration')) {
                    this.figureOutTimeLimit(this.$session.get('max_duration'));
                } else {
                    this.timeLimitUnit = 60;
                    this.timeLimitInput = 15;
                }

                this.notBlurredFile = -1;
                this.notBlurredDir = -1;

                this.generatedLink = '';

                this.shareListPopupEnabled = true;
                this.linkParametersChanged();
            },
            openShareFilePopup(i) {
                if (!this.closeAnyPopup()) return;

                this.speedLimitEnabled = !!this.$session.get('max_bandwidth') || false;
                if (this.$session.get('max_bandwidth')) {
                    this.figureOutSpeedLimit(this.$session.get('max_bandwidth'));
                } else {
                    this.speedLimitUnit = 1000000;
                    this.speedLimitInput = 1;
                }

                this.timeLimitEnabled = !!this.$session.get('max_duration') || true;
                if (this.$session.get('max_duration') && 60*15 > this.$session.get('max_duration')) {
                    this.figureOutTimeLimit(this.$session.get('max_duration'));
                } else {
                    this.timeLimitUnit = 60;
                    this.timeLimitInput = 15;
                }

                this.notBlurredFile = i;
                this.notBlurredDir = -1;
                this.shareBasePath = this.files[i].path;

                this.generatedLink = '';

                this.shareFilePopupOpened = true;
                this.linkParametersChanged();
            },
            openShareDirPopup(i) {
                if (!this.closeAnyPopup()) return;

                this.speedLimitEnabled = !!this.$session.get('max_bandwidth') || false;
                if (this.$session.get('max_bandwidth')) {
                    this.figureOutSpeedLimit(this.$session.get('max_bandwidth'));
                } else {
                    this.speedLimitUnit = 1000000;
                    this.speedLimitInput = 1;
                }

                this.timeLimitEnabled = !!this.$session.get('max_duration') || true;
                if (this.$session.get('max_duration') && 60*15 > this.$session.get('max_duration')) {
                    this.figureOutTimeLimit(this.$session.get('max_duration'));
                } else {
                    this.timeLimitUnit = 60;
                    this.timeLimitInput = 15;
                }

                this.notBlurredFile = -1;
                this.notBlurredDir = i;
                this.shareBasePath = this.dirs[i].path;

                this.generatedLink = '';

                this.shareDirPopupOpened = true;
                this.linkParametersChanged();
            },
            figureOutSpeedLimit(value) {
                if (1000 > value) {
                    this.speedLimitUnit = 1;
                    this.speedLimitInput = value;
                }
                else if (1000000 > value) {
                    this.speedLimitUnit = 1000;
                    this.speedLimitInput = (value / 1000).toFixed(2);
                }
                else {
                    this.speedLimitUnit = 1000000;
                    this.speedLimitInput = (value / 1000000).toFixed(2);
                }
            },
            figureOutTimeLimit(value) {
                if (1*60 > value) {
                    this.timeLimitUnit = 1;
                    this.timeLimitInput = value;
                }
                else if (1*60*60 > value) {
                    this.timeLimitUnit = 1*60;
                    this.timeLimitInput = (value / (1*60)).toFixed(2);
                }
                else if (1*60*60*24 > value) {
                    this.timeLimitUnit = 1*60*60;
                    this.timeLimitInput = (value / (1*60*60)).toFixed(2);
                }
                else if (1*60*60*24*7 > value) {
                    this.timeLimitUnit = 1*60*60*24;
                    this.timeLimitInput = (value / (1*60*60*24)).toFixed(2);
                }
                else {
                    this.timeLimitUnit = 1 * 60 * 60 * 24 * 7;
                    this.timeLimitInput = (value / (1 * 60 * 60 * 24 * 7)).toFixed(2);
                }
            },
            linkParametersChanged: _.debounce(function() {
                //if (!this.shareFilePopupOpened && this.shareDirPopupOpened) return;

                if (this.generatingLinkRequest) {
                    this.shouldRegenLink = true;
                    return;
                }

                if (this.$session.get('max_bandwidth') && this.speedLimitInput * this.speedLimitUnit > this.$session.get('max_bandwidth')) {
                    this.figureOutSpeedLimit(this.$session.get('max_bandwidth'));
                }

                if (this.$session.get('max_duration') && this.timeLimitInput * this.timeLimitUnit > this.$session.get('max_duration')) {
                    this.figureOutTimeLimit(this.$session.get('max_duration'));
                }

                if (this.shareDirPopupOpened || this.shareFilePopupOpened) {
                    this.generatingLinkRequest = true;
                    this.generatedLink = '';
                    this.$axios.post(this.$url + '/api/gen/', {
                        path: this.shareBasePath,
                        speed: Math.floor(this.speedLimitEnabled ? this.speedLimitInput * this.speedLimitUnit : 0),
                        duration: Math.floor(this.timeLimitEnabled ? this.timeLimitInput * this.timeLimitUnit : 0),
                    })
                    .then((response) => {

                        if (this.shouldRegenLink) {
                            this.linkParametersChanged();
                        } else {
                            if (this.shareFilePopupOpened)
                                this.generatedLink = this.$downurl + '/' + response.data.path;
                            else if (this.shareDirPopupOpened)
                                this.generatedLink = this.$url + '/' + this.$router.resolve({
                                    name: 'GuestListFiles',
                                    params: {
                                        mooltipass: response.data.path,
                                    }
                                }).href;

                            this.generatingLinkRequest = false;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        // Todo: afficher l'erreur

                        if (this.shouldRegenLink) {
                            this.linkParametersChanged();
                        } else {
                            this.generatingLinkRequest = false;
                        }
                    });
                } else if (this.shareListPopupEnabled) {
                    console.log('issou');
                } else {
                    this.closeAnyPopup();
                    console.log('wtf!');
                }
            }, 165),

            generateLinks() {
                if (!this.closeAnyPopup()) return;

                // Préparation de la list edes liens à générer
                this.generatingLinks = true;
                this.linksToGenerate = [];
                for (let i in this.files) {
                    this.linksToGenerate[i] = {
                        name: this.files[i].name,
                        path: this.files[i].path,
                    }
                }
                console.log(this.linksToGenerate);

                // Génération des liens

                this.displayList = '';
                this.generateNextLink();
            },
            generateNextLink() {
                if (this.linksToGenerate.length <= 0) {
                    this.generatingLinks = false;
                    return;
                }
                let elem = this.linksToGenerate.shift();

                this.$axios.post(this.$url + '/api/gen/', {
                    path: elem.path,
                    speed: Math.floor(this.speedLimitEnabled ? this.speedLimitInput * this.speedLimitUnit : 0),
                    duration: Math.floor(this.timeLimitEnabled ? this.timeLimitInput * this.timeLimitUnit : 0),
                })
                .then((response) => {
                    if (this.generatingLinks) { // Au cas ou le mode list aurait été désactivé avant
                        if (this.displayList !== '') {
                            this.displayList += "\n";
                        }

                        this.displayList += this.$downurl + '/' + response.data.path + '/' + encodeURI(elem.name);
                        setTimeout(this.generateNextLink, 10); // Pour que ça soit joli :)
                    }
                })
                .catch((err) => {
                    console.log(err);
                    // Todo: afficher l'erreur
                });
            }
        }
    }
</script>
