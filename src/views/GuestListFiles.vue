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
            <table v-if="!listModeEnabled" class="table" style="table-layout: fixed;">
                <thead>
                <tr>
                    <th width="30px"></th>
                    <th></th>
                    <th width="80px"></th>
                </tr>
                </thead>
                <tfoot>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                </tfoot>
                <tbody>

                <tr class="blur-animated" :class="{blurred: notBlurredDir !== null, unblurred: notBlurredDir === null}" v-if="parent_path !== null">
                    <td><i class="fal fa-folders"></i></td>
                    <td colspan="2">
                        <router-link :to="{ name: 'GuestListFilesM', params: { mooltipass: $route.params.mooltipass, path: parent_path } }" v-if="parent_path !== ''">..</router-link>
                        <router-link :to="{ name: 'GuestListFiles', params: {mooltipass: $route.params.mooltipass} }" v-if="parent_path === ''">..</router-link>
                    </td>
                </tr>

                <tr v-for="(dir, i) in dirs" :key="'dir' + i" class="links-files blur-animated" :class="{blurred: notBlurredDir !== null && i !== notBlurredDir, unblurred: !(notBlurredDir !== null && i !== notBlurredDir)}">
                    <td><i class="fal fa-folder"></i></td>
                    <td colspan="2"><router-link :to="{ name: 'GuestListFilesM', params: { mooltipass: $route.params.mooltipass, path: dir.path } }">{{ dir.name }}</router-link></td>
                </tr>

                <tr v-for="(file, i) in files" :key="'file' + i" class="links-folders blur-animated" :class="{blurred: notBlurredFile !== null && i !== notBlurredFile, unblurred: !(notBlurredFile !== null && i !== notBlurredFile)}">
                    <td><i class="fal" :class="icon(file.name)"></i></td>
                    <td><a :href="$downurl + '/' + $route.params.mooltipass + '/down/guest/' + file.path + '/' + ($vlchotfix ? file.name.replace(/\[/g, '_').replace(/\]/g, '_') : file.name)">{{ file.name }}</a></td>
                    <td><span class="size">{{ sizeRound(file.size) }}</span><span class="extension">{{ sizeUnit(file.size) }}</span></td>
                </tr>
                </tbody>
            </table>

            <pre v-else class="link-list">{{ linkList }}</pre>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import '~@/resources/custom/style.scss';

    .links-files, .links-folders {
        td a {
            font-size: 16px;
            @include fluid-type(font-size, 360px, 1000px, 10px, 16px);

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

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
            /* data */ 'xml', 'json,', 'yml', 'yaml', 'ini', 'env', 'toml', 'lock', 'cson', 'bson', 'cfg',
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

                shouldRegenLink: false,
                generatingLinkRequest: false,
                generatedLink: 'https://download.nicnl.com/e946c22fb68d859aef10d2bd0137baaddc231248f1a8f8517ed85db3d9f213caaa8c2eef7d7b1466fb70dcc0b71d00937b59306051b1d1ba17e4ea65345f34f5a542fa6174bc5f55e9ce90540bf284d581e08523eb154b0540902eb9c1a056fe-a5d34ef6dc/appIcon.png',

                listModeEnabled: false,

                linkList: '',

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
                this.listModeEnabled = false;
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
                this.listModeEnabled = state;
                if (state) {
                    this.linkList = '';
                    this.fetchList(this.routePath);
                }
            },
            fetchList(path) {
                this.lastError = null;

                this.$axios.get(this.$url + '/api/guest/' + this.$route.params.mooltipass + '/ls/' + path)
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

                        if (this.listModeEnabled) {
                            for (let i in this.files) {
                                if (this.linkList !== '') {
                                    this.linkList += "\n";
                                }

                                this.linkList += this.$downurl + '/' + this.$route.params.mooltipass + '/down/guest/' + this.files[i].path + '/' + encodeURI(this.files[i].name);
                            }
                        }
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
            closeAnyPopup() {
                if (this.generatingLinkRequest) return false;

                this.notBlurredFile = null;
                this.notBlurredDir = null;

                return true;
            },
        }
    }
</script>
