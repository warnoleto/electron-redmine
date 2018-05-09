<template>
  <v-form v-model="valid" ref="form">
      <v-container>
        <h3>Reportar Atividade</h3>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <v-select :items="tasks" v-model="taskId" label="Tarefa" single-line item-value="id" required :rules="[required]" @change="taskSelected" :loading="loadingTasks">
                <template slot="item" slot-scope="data">
                  <v-list-tile-content v-text="`#${data.item.id} - ${data.item.subject}`"></v-list-tile-content>
                </template>
                <template slot="selection" slot-scope="data">
                  <v-list-tile-content v-text="`#${data.item.id} - ${data.item.subject}`"></v-list-tile-content>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs12 sm4>
              <v-text-field label="Data" v-model="date" type="date" required :rules="[required]"></v-text-field>
            </v-flex>
            <v-flex  xs12 sm4>
              <v-select :items="activities" v-model="activityId" label="Atividade" single-line item-text="name" item-value="id"  required :rules="[required]" :loading="loadingActivities"></v-select>
            </v-flex>
            <v-flex xs12 sm4>
              <v-text-field label="Tempo Gasto" v-model="hours" type="number"  required :rules="[required]"></v-text-field>
            </v-flex>
            <v-flex xs12 sm4>
              <v-text-field label="Observação" v-model="comments"></v-text-field>
            </v-flex>
            <tracking-chips :date="date"></tracking-chips>
          </v-layout>
        </v-container>
        <v-footer>
            <v-spacer></v-spacer>
            <v-btn @click="cancel" color="error" class="text-md-right">Cancelar</v-btn>
            <v-btn @click="confirm" color="success" class="text-md-right">Salvar</v-btn>
        </v-footer>
      </v-container>
  </v-form>
</template>

<script>

import {mapState, mapGetters} from 'vuex'
import moment from 'moment'
import util from '@/globals/ui-util'
import RedminePostHelper from '@/globals/redmine-post-helper'
import TaskService from '@/services/TaskService'
import TrackingChips from '@/components/ReportForm/TrackingChips'

export default {
  data () {
    return {
      date: moment().format('YYYY-MM-DD'),
      hours: null,
      valid: true,
      tasks: [],
      taskId: '',
      activities: [],
      activityId: '',
      comments: '',
      loadingTasks: true,
      loadingActivities: true
    }
  },
  components: {TrackingChips},
  computed: {
    ...mapState({
      prefs: state => state.Preferences,
      service: state => new TaskService(state.Preferences),
      user: state => state.user,
      tracking: state => state.Tracking
    }),
    ...mapGetters(['totalOfTheDay', 'entriesOfTheDay']),
    required () {
      return util.required
    },
    entries () {
      return this.entriesOfTheDay(this.date)
    }
  },
  methods: {
    taskSelected (value) {
      this.hours = this.totalOfTheDay(this.date, value)
    },
    confirm () {
      if (this.$refs.form.validate()) {
        const posthelper = new RedminePostHelper(this.prefs.hostname, this.prefs.apiKey)

        const params = {
          time_entry: {
            issue_id: this.taskId,
            spent_on: this.date,
            hours: this.hours,
            activity_id: this.activityId,
            comments: this.comments
          }
        }
        posthelper.post('time_entries.xml', params, (err, data) => {
          util.assertNoError(err, 'Falha ao registrar de atividade.')
          this.$store.dispatch('success', 'Registro de tempo efetuado com sucesso')
        })
      }
    },
    cancel () {
      this.refresh()
    },
    refresh () {
      util.clearAlert()
      this.$refs.form.reset()
      this.loadingTasks = true
      this.loadingActivities = true
      this.date = moment().format('YYYY-MM-DD')
      this.hours = null
      this.service.myIssues(this.tracking.current, (err, data) => {
        this.loadingTasks = false
        util.assertNoError(err, 'Não foi possível carregar sua lista de tarefas.')
        this.tasks = data.issues
      })

      this.service.timeEntryActivities((err, data) => {
        this.loadingActivities = false
        util.assertNoError(err, 'Não foi possível carregar lista de atividades.')
        this.activities = data.time_entry_activities
      })
    }
  },
  mounted () {
    this.refresh()
  },
  beforeDestroy () {
    util.clearAlert()
  },
  filters: {
    time (value) {
      return !value ? '...' : moment(value).format('HH:mm')
    }
  }
}
</script>

<style>

</style>

