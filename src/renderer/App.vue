<template>
  <v-app>
    
      <v-toolbar>
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

      <v-content>
        <router-view></router-view>
      </v-content>
  </v-app>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: 'electron-redmine',
    computed: {
      ...mapState({
        gravatarUrl: state => state.Preferences.gravatarUrl,
        user: state => state.Preferences.user
      }),
      ...mapGetters([ 'isAuthenticated', 'userFullName' ])
    }
  }
</script>

<style>
  /* CSS */
</style>
