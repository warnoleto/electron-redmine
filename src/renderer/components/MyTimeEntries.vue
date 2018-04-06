<template>
  <v-container>
    <v-data-table :headers="headers" :items="entries" class="elevation-1">
        <template slot="items" slot-scope="props">
            <td>{{ `#${props.item.issue.id}` }}</td>
            <td class="text-xs-left">{{ props.item.activity.name }}</td>
            <td class="text-xs-left">{{ props.item.comments }}</td>
            <td class="text-xs-left">{{ props.item.spent_on }}</td>
            <td class="text-xs-right">{{ props.item.hours }}</td>
        </template>
    </v-data-table>
  </v-container>
</template>

<script>

import Redmine from 'node-redmine'
import {mapState} from 'vuex'
import moment from 'moment'

export default {
  name: 'my-time-entries',
  data () {
    return {
      headers: [
        { text: '#Id', sortable: false, align: 'center' },
        { text: 'Atividade', sortable: false, align: 'left' },
        { text: 'Comentário', sortable: false, align: 'left' },
        { text: 'Data', sortable: false, align: 'left' },
        { text: 'Tempo', sortable: false, align: 'right' }
      ],
      entries: []
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
      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
      const today = moment().format('YYYY-MM-DD')
      const params = {
        user_id: 'me',
        spent_on: `><${yesterday}|${today}`
      }
      this.redmine.time_entries(params, (err, data) => {
        if (err) throw err
        this.entries = data.time_entries
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

