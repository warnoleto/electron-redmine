<template>
  <v-app>
      
      <authentication v-if="!isAuthenticated"></authentication>

      <v-toolbar v-if="isAuthenticated">
        <v-chip v-if="isAuthenticated">
          <v-avatar>
            <img :src="gravatarUrl" :alt="gravatarUrl">
          </v-avatar>
          {{userFullName}}
        </v-chip>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat to="/">Andamento</v-btn>
          <v-btn flat to="/">Minhas Tarefas</v-btn>
          <v-btn flat>Registros</v-btn>
          <v-btn flat to="/config">Configuração</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-content  v-if="isAuthenticated">
        <router-view></router-view>
      </v-content>
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
