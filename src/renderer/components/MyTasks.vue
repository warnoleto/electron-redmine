<template>
  <v-container>
    <h3>Minhas Tarefas</h3>
    <br>
    <v-data-table :headers="headers" :items="tasks" hide-actions class="elevation-1" :rows-per-page-items="[5]">
        <template slot="items" slot-scope="props">
            <td>{{ `#${props.item.id}` }}</td>
            <td class="text-xs-left">{{ props.item.description }}</td>
            <td class="text-xs-right">{{ props.item.status.name }}</td>
        </template>
    </v-data-table>
  </v-container>
</template>

<script>

import Redmine from 'node-redmine'
import {mapState} from 'vuex'

export default {
  name: 'my-tasks',
  data () {
    return {
      headers: [
        { text: '#Id', sortable: false, align: 'center' },
        { text: 'Descrição', sortable: false, align: 'left' },
        { text: 'Status', sortable: false, align: 'center' }
      ],
      tasks: []
    }
  },
  computed: {
    ...mapState({
      redmine: state => new Redmine(state.Preferences.hostname, {apiKey: state.Preferences.apiKey}),
      user: state => state.user
    })
  },
  methods: {
    refresh () {
      this.redmine.issues({assigned_to_id: 'me'}, (err, data) => {
        if (err) throw err
        this.tasks = data.issues
      })
    }
  },
  mounted () {
    this.refresh()
  }
}
</script>

<style>

</style>

