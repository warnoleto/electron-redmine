<template>
  <v-form v-model="valid">
      <v-container>
        <h3>Reportar Atividade</h3>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <v-select :items="tasks" v-model="task" label="Tarefa" single-line item-value="id">
                <template slot="item" slot-scope="data">
                  <v-list-tile-content v-text="`#${data.item.id} - ${data.item.description}`"></v-list-tile-content>
                </template>
                <template slot="selection" slot-scope="data">
                  <v-list-tile-content v-text="`#${data.item.id} - ${data.item.description}`"></v-list-tile-content>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs12 sm4>
              <v-text-field label="Data" v-model="date" type="date"></v-text-field>
            </v-flex>
            <v-flex  xs12 sm4>
              <v-select :items="activities" v-model="activity" label="Atividade" single-line item-text="name" item-value="id"></v-select>
            </v-flex>
            <v-flex xs12 sm4>
              <v-text-field label="Tempo Gasto" v-model="hours" type="number"></v-text-field>
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

export default {
  data () {
    return {
      date: moment().format('YYYY-MM-DD'),
      hours: 1,
      valid: true,
      tasks: [],
      task: '',
      activities: [],
      activity: '',
      comments: ''
    }
  },
  computed: {
    ...mapState({
      redmine: state => new Redmine(state.Preferences.hostname, {apiKey: state.Preferences.apiKey}),
      user: state => state.user
    })
  },
  methods: {
    confirm () {
      console.log('confirm')
    },
    cancel () {
      console.log('cancel')
    },
    refresh () {
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

