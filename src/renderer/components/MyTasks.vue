<template>
  <v-container>
    <h3>Minhas Tarefas</h3>
    <br>
    <v-data-table :headers="headers" :items="tasks" hide-actions class="elevation-1" :rows-per-page-items="[5]" :loading="isLoading">
        <template slot="items" slot-scope="props">
            <td>{{ `#${props.item.id}` }}</td>
            <td class="text-xs-left">{{ props.item.subject }}</td>
            <td class="text-xs-right">{{ props.item.status.name }}</td>
            <td class="justify-center layout px-0">
              <v-btn v-if="isActive(props.item)" icon class="mx-0" @click="pauseTask(props.item)">
                <v-icon color="pink">pause</v-icon>
              </v-btn>
              <v-btn v-else icon class="mx-0" @click="startTask(props.item)">
                <v-icon color="green">play_arrow</v-icon>
              </v-btn>

              <v-btn icon v-if="isTracking(props.item)" class="mx-0" @click="stopTracking(props.item)">
                <v-icon color="red">alarm_off</v-icon>
              </v-btn>
              <v-btn icon v-else class="mx-0" @click="startTracking(props.item)">
                <v-icon color="blue-grey">alarm</v-icon>
              </v-btn>
            </td>
        </template>
    </v-data-table>
  </v-container>
</template>

<script>

import Redmine from 'node-redmine'
import {mapState} from 'vuex'
import util from '@/globals/ui-util'
import TaskService from '@/services/TaskService'

const tryFindServerErrorMessage = (err, msgDefault) => {
  if (err) {
    const jsonResp = JSON.parse(err)
    if (jsonResp.Detail && jsonResp.Detail.errors && jsonResp.Detail.errors.length) {
      const msg = jsonResp.Detail.errors.join('. ')
      return msg
    }
  }
  return msgDefault
}

export default {
  name: 'my-tasks',
  data () {
    return {
      headers: [
        { text: '#Id', sortable: false, align: 'center' },
        { text: 'Descrição', sortable: false, align: 'left' },
        { text: 'Status', sortable: false, align: 'center' },
        { text: 'Ações', sortable: false, align: 'center' }
      ],
      tasks: [],
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      redmine: state => new Redmine(state.Preferences.hostname, {apiKey: state.Preferences.apiKey}),
      user: state => state.user,
      prefs: state => state.Preferences,
      tracking: state => state.Tracking,
      service: state => new TaskService(state.Preferences)
    })
  },
  methods: {
    refresh () {
      this.isLoading = true
      util.clearAlert()
      this.redmine.issues({assigned_to_id: 'me'}, (err, data) => {
        this.isLoading = false
        util.assertNoError(err, 'Não foi possível carregar sua lista de tarefas')
        this.tasks = data.issues
      })
    },
    isActive (task) {
      return task.status.id === this.prefs.workingStatus
    },
    isTracking (task) {
      return this.tracking.current === task.id
    },
    pauseTask (task) {
      this.isLoading = true
      this.service.pauseTask(task.id, (err, data) => {
        this.isLoading = false
        util.assertNoError(err, tryFindServerErrorMessage(err, 'Não foi possível pausar a atividade!'))
        this.refresh()
        this.$store.dispatch('success', 'A atividade foi pausada com sucesso.')
      })
    },
    startTask (task) {
      this.isLoading = true
      this.service.startTask(task.id, (err, data) => {
        this.isLoading = false
        util.assertNoError(err, tryFindServerErrorMessage(err, 'Não foi possivel iniciar a atividade! Verifique se não há outra atividade em execução.'))
        this.refresh()
        this.$store.dispatch('success', 'A atividade foi ativada com sucesso.')
      })
    },
    startTracking (task) {
      this.$store.dispatch('startTracking', task.id)
    },
    stopTracking (task) {
      this.$store.dispatch('stopTracking', task.id)
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

