<template>
  <v-container>
    <h3>Meus Registros</h3>
    <br>
    <v-data-table :headers="headers" :items="entries" class="elevation-1" :rows-per-page-items="[5]" :loading="isLoading">
        <template slot="items" slot-scope="props">
            <td>{{ `#${props.item.issue.id}` }}</td>
            <td class="text-xs-left">{{ props.item.activity.name }}</td>
            <td class="text-xs-left">{{ props.item.comments }}</td>
            <td class="text-xs-left">{{ props.item.spent_on }}</td>
            <td class="text-xs-right">{{ props.item.hours }}</td>
        </template>
    </v-data-table>
    <p>* Listando atividades dos ultimos {{daysToList}} dias. Total registrado hoje {{todayTotal}}h</p>
  </v-container>
</template>

<script>

import Redmine from 'node-redmine'
import {mapState} from 'vuex'
import moment from 'moment'
import util from '@/globals/ui-util'

export default {
  name: 'my-time-entries',
  data () {
    return {
      daysToList: 30,
      headers: [
        { text: '#Id', sortable: false, align: 'left' },
        { text: 'Atividade', sortable: false, align: 'left' },
        { text: 'Comentário', sortable: false, align: 'left' },
        { text: 'Data', sortable: false, align: 'left' },
        { text: 'Tempo', sortable: false, align: 'right' }
      ],
      entries: [],
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      redmine: state => new Redmine(state.Preferences.hostname, {apiKey: state.Preferences.apiKey}),
      user: state => state.user
    }),
    todayTotal () {
      const today = moment()
      return this.entries
        .filter(e => moment(e.spent_on).isSame(today, 'day'))
        .map(e => e.hours)
        .reduce((a, b) => a + b, 0)
    }
  },
  methods: {
    refresh () {
      this.isLoading = true
      util.clearAlert()
      const startDate = moment().subtract(this.daysToList, 'days').format('YYYY-MM-DD')
      const endDate = moment().format('YYYY-MM-DD')
      const params = {
        user_id: 'me',
        spent_on: `><${startDate}|${endDate}`
      }
      this.redmine.time_entries(params, (err, data) => {
        this.isLoading = false
        util.assertNoError(err, 'Nao foi possivel carregar a lista de registros de atividades.')
        this.entries = data.time_entries
      })
    }
  },
  mounted () {
    this.refresh()
  },
  beforeDestroy () {
    util.clearAlert()
  }
}
</script>

<style>

</style>

