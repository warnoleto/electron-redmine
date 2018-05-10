<template>
  <v-app>
      
      <authentication v-if="!isAuthenticated"></authentication>

      <v-toolbar v-if="isAuthenticated">
        <v-chip>
          <v-avatar>
            <img :src="gravatarUrl" :alt="gravatarUrl">
          </v-avatar>
          {{userFullName}}
        </v-chip>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat to="/" exact>Andamento</v-btn>
          <v-btn flat to="/my-tasks">Minhas Tarefas</v-btn>
          <v-btn flat to="/my-time-entries">Registros</v-btn>
          <v-btn flat to="/config">Configuração</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-content  v-if="isAuthenticated">
         <v-alert :type="notification.type" :value="notification.visible">
          {{notification.message}}
        </v-alert>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-content>
      <v-footer color="blue" app>
        <span class="white--text">&nbsp;&copy; 2018</span>
      </v-footer>
  </v-app>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import Authentication from '@/components/Authentication'
  import {ipcRenderer} from 'electron'
  import moment from 'moment'

  const notify = (ctx, message, level = 'warn') => {
    ctx.$store.dispatch(level, message)
    ipcRenderer.send('show-notification', {message})
  }

  const isUserHere = (ctx) => {
    if (!ctx.currentTracking) {
      return
    }
    if (!ctx.hasWorkspaces) {
      return
    }

    const minutesAgo = moment().subtract(15, 'minutes')
    if (moment(ctx.lastEvent).isBefore(minutesAgo)) {
      ctx.$store.dispatch('stopTracking', ctx.currentTracking)
      notify(ctx, 'O rastreamento de sua atividade foi interrompido devido a inatividade.')
    }
  }

  const isShiftEnd = (ctx) => {
    if (!ctx.currentTracking) {
      return
    }
    if (moment().isSame(moment(ctx.intervalo, 'HH:mm'), 'minute')) {
      ctx.$store.dispatch('stopTracking', ctx.currentTracking)
      notify(ctx, 'O rastreamento de sua atividade foi interrompido para ao início do intervalo.')
    }
    if (moment().isSame(moment(ctx.saida, 'HH:mm'), 'minute')) {
      ctx.$store.dispatch('stopTracking', ctx.currentTracking)
      notify(ctx, 'O rastreamento de sua atividade foi interrompido para ao término do expediente.')
    }
  }

  export default {
    name: 'electron-redmine',
    data () {
      return {
        thetimeout: null
      }
    },
    computed: {
      ...mapState({
        gravatarUrl: state => state.Preferences.gravatarUrl,
        intervalo: state => state.Preferences.intervalo,
        saida: state => state.Preferences.saida,
        notification: state => state.Notifications,
        lastEvent: state => state.Tracking.lastFileEvent,
        currentTracking: state => state.Tracking.current
      }),
      ...mapGetters([ 'isAuthenticated', 'userFullName', 'workspaceList', 'hasWorkspaces' ])
    },
    components: { Authentication },
    mounted () {
      this.$store.dispatch('clearOldTrackingEntries')
      ipcRenderer.send('request-fs-watch', this.workspaceList)

      ipcRenderer.on('file-changed', (event, data) => {
        this.$store.dispatch('registerFileChanged')
      })

      setInterval(() => {
        isUserHere(this)
        isShiftEnd(this)
      }, 60000)
    }
  }
</script>

<style>
  /* CSS */
</style>
