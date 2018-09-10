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
                    <td>I</td>
                    <td>debian.iso</td>
                    <td>500 Mo</td>
                </tr>
                <tr>
                    <td>I</td>
                    <td>debian.iso</td>
                    <td>500 Mo</td>
                </tr>
                <tr>
                    <td>I</td>
                    <td>debian.iso</td>
                    <td>500 Mo</td>
                </tr>
                <tr>
                    <td>I</td>
                    <td>debian.iso</td>
                    <td>500 Mo</td>
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

            cursor: pointer;
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
