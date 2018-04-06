<template>
  <v-form v-model="valid">
      <v-container>
          <v-select :disabled="!isAuthenticated" :items="statusList" v-model="progressStatus" label="Status Em Andamento" single-line item-text="name" item-value="id"></v-select>
          <v-select :disabled="!isAuthenticated" :items="statusList" v-model="pausedStatus" label="Status Pausada" single-line  item-text="name" item-value="id"></v-select>
      </v-container>
      <v-footer>
          <v-btn flat @click="cancel" color="error" class="text-md-right">Cancelar</v-btn>
          <v-btn flat @click="confirm" color="success" class="text-md-right">Salvar</v-btn>
      </v-footer>
  </v-form>
</template>

<script>

import Redmine from 'node-redmine'
import {mapState, mapGetters} from 'vuex'

export default {
  data () {
    return {
      valid: true,
      progressStatus: '',
      pausedStatus: '',
      statusList: []
    }
  },
  computed: {
    ...mapState({
      gravatarUrl: state => state.Preferences.gravatarUrl,
      redmine: state => new Redmine(state.Preferences.hostname, {apiKey: state.Preferences.apiKey}),
      user: state => state.user
    }),
    ...mapGetters([ 'isAuthenticated', 'userFullName' ])
  },
  methods: {
    confirm () {
      console.log('confirm')
    },
    cancel () {
      console.log('cancel')
    }
  },
  mounted () {
    this.redmine.issue_statuses((err, data) => {
      if (err) throw err
      this.statusList = data.issue_statuses
    })
  }
}
</script>

<style>

</style>

