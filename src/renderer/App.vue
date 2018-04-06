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

  export default {
    name: 'electron-redmine',
    computed: {
      ...mapState({
        gravatarUrl: state => state.Preferences.gravatarUrl,
        user: state => state.Preferences.user
      }),
      ...mapGetters([ 'isAuthenticated', 'userFullName' ])
    },
    components: { Authentication }
  }
</script>

<style>
  /* CSS */
</style>
