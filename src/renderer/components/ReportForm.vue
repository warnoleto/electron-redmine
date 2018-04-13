<template>
  <v-form v-model="valid" ref="form">
      <v-container>
        <h3>Reportar Atividade</h3>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <v-select :items="tasks" v-model="taskId" label="Tarefa" single-line item-value="id" required :rules="[required]">
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
              <v-select :items="activities" v-model="activityId" label="Atividade" single-line item-text="name" item-value="id"  required :rules="[required]"></v-select>
            </v-flex>
            <v-flex xs12 sm4>
              <v-text-field label="Tempo Gasto" v-model="hours" type="number"  required :rules="[required]"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field label="Observação" v-model="comments"></v-text-field>
            </v-flex>
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

import {mapState} from 'vuex'
import moment from 'moment'
import Redmine from 'node-redmine'
import rules from '@/globals/rules'
import RedminePostHelper from '@/globals/redmine-post-helper'

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
      comments: ''
    }
  },
  computed: {
    ...mapState({
      prefs: state => state.Preferences,
      redmine: state => new Redmine(state.Preferences.hostname, {apiKey: state.Preferences.apiKey}),
      user: state => state.user
    }),
    required () {
      return rules.required
    }
  },
  methods: {
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
          if (err) throw err
          this.$store.dispatch('success', 'Registro de tempo efetuado com sucesso')
        })
      }
    },
    cancel () {
      this.refresh()
    },
    refresh () {
      this.$store.dispatch('clearAlert')
      this.$refs.form.reset()
      this.date = moment().format('YYYY-MM-DD')
      this.hours = null
      this.redmine.issues({assigned_to_id: 'me'}, (err, data) => {
        if (err) throw err
        this.tasks = data.issues
      })

      this.redmine.time_entry_activities((err, data) => {
        if (err) throw err
        this.activities = data.time_entry_activities
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

