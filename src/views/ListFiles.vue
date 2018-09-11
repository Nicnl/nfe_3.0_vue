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
                    <td class="share-button"><i class="fal fa-share-square"></i></td>
                </tr>

                <tr v-for="(file, i) in files" :key="'file' + i">
                    <td><i class="fal" :class="icon(file.name)"></i></td>
                    <td><a href="http://google.fr">{{ file.name }}</a></td>
                    <td><span class="size">{{ sizeRound(file.size) }}</span><span class="extension">{{ sizeUnit(file.size) }}</span></td>
                    <td class="share-button"><i class="fal fa-share-square"></i></td>
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
        }
    }
</script>
