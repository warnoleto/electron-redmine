<template>
    <v-flex xs12 sm12>
        <v-chip v-for="(entry, index) in entries" outline label color="orange" :key="index" close @input="close(entry)">
           <strong>{{entry.issueId | issueId}}</strong>: {{entry.start | time}} - {{entry.end | time}} ({{entry | duration}})
        </v-chip>
    </v-flex>
</template>
<script>

import {mapGetters} from 'vuex'
import moment from 'moment'

export default {
  props: ['date'],
  computed: {
    ...mapGetters(['totalOfTheDay', 'entriesOfTheDay']),
    entries () {
      return this.entriesOfTheDay(this.date)
    }
  },
  filters: {
    time (value) {
      return !value ? '...' : moment(value).format('HH:mm')
    },
    issueId (value) {
      return `#${value}`
    },
    duration (entry) {
      const d = moment(entry.end).diff(entry.start, 'hours', true).toFixed(2)
      return `${d}h`
    }
  },
  methods: {
    close (value) {
      if (confirm('Deseja remover esse registro?')) {
        this.$store.dispatch('removeTrackingEntry', value)
      }
    }
  }
}
</script>



