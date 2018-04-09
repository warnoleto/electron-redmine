<template>
      <v-container>
          <v-form ref="form" lazy-validation>
          <h3>Configurações</h3>
          <v-select :items="statusList" v-model="workingStatus" label="Status Em Andamento" single-line item-text="name" item-value="id" required :rules="rules"></v-select>
          <v-select :items="statusList" v-model="pausedStatus" label="Status Pausada" single-line  item-text="name" item-value="id" required  :rules="rules"></v-select>
          </v-form>
          <workspaces></workspaces>
          <v-footer>
            <v-spacer></v-spacer>
            <v-btn @click="cancel" color="error" class="text-md-right">Cancelar</v-btn>
            <v-btn @click="confirm" color="success" class="text-md-right">Salvar</v-btn>
          </v-footer>
      </v-container>
</template>

<script>

import Redmine from 'node-redmine'
import {mapState, mapGetters} from 'vuex'
import rules from '@/globals/rules'
import Workspaces from './Configuration/Workspaces'

export default {
  components: {Workspaces},
  data () {
    return {
      workingStatus: '',
      pausedStatus: '',
      statusList: [],
      rules: [rules.required]
    }
  },
  computed: {
    ...mapState({
      gravatarUrl: state => state.Preferences.gravatarUrl,
      redmine: state => new Redmine(state.Preferences.hostname, {apiKey: state.Preferences.apiKey}),
      preferences: state => state.Preferences,
      user: state => state.user
    }),
    ...mapGetters([ 'isAuthenticated', 'userFullName' ])
  },
  methods: {
    confirm () {
      if (this.$refs.form.validate()) {
        let workingStatus = this.workingStatus
        let pausedStatus = this.pausedStatus
        this.$store.dispatch('savePreferences', {workingStatus, pausedStatus})
      }
    },
    cancel () {
      this.$refs.form.reset()
      this.workingStatus = this.preferences.workingStatus
      this.pausedStatus = this.preferences.pausedStatus
    }
  },
  mounted () {
    this.workingStatus = this.preferences.workingStatus
    this.pausedStatus = this.preferences.pausedStatus
    this.redmine.issue_statuses((err, data) => {
      if (err) throw err
      this.statusList = data.issue_statuses
    })
  }
}
</script>

<style>

</style>

