<template>
    <div class="columns is-centered">
        <div class="column is-9-fullhd">
            <table class="table">
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
                <tr>
                    <td><i class="fal fa-folder"></i></td>
                    <td colspan="2"><a href="http://google.fr">Windows</a></td>
                </tr>
                <tr>
                    <td><i class="fal fa-folder"></i></td>
                    <td colspan="2"><a href="http://google.fr">Linux</a></td>
                </tr>
                <tr>
                    <td><i class="fal fa-file"></i></td>
                    <td><a href="http://google.fr">README.md</a></td>
                    <td>4.27 Ko</td>
                </tr>
                <tr>
                    <td><i class="fal fa-file"></i></td>
                    <td><a href="http://google.fr">Dockerfile</a></td>
                    <td>768 o</td>
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
            }
        }
    }
</style>

<script>
    export default {
        name: 'ListFiles',
        data () {
            return {
            }
        }
    }
</script>
