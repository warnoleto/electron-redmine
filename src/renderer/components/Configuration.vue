<template>
      <v-container>
          <v-form ref="form" lazy-validation>
          <h3>Configurações</h3>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-select :items="statusList" v-model="workingStatus" label="Status Em Andamento" single-line item-text="name" item-value="id" required :rules="rules"></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select :items="statusList" v-model="pausedStatus" label="Status Pausada" single-line  item-text="name" item-value="id" required  :rules="rules"></v-select>
              </v-flex>
              <time-field label="Entrada" v-model="entrada"></time-field>
              <time-field label="Intervalo" v-model="intervalo"></time-field>
              <time-field label="Retorno" v-model="retorno"></time-field>
              <time-field label="Saída" v-model="saida"></time-field>
            </v-layout>
          </v-container>
          </v-form>
          <workspaces :workspaces="workspaces"></workspaces>
          <v-footer>
            <v-spacer></v-spacer>
            <v-btn @click="cancel" color="error" class="text-md-right">Cancelar</v-btn>
            <v-btn @click="confirm" color="success" class="text-md-right">Salvar</v-btn>
          </v-footer>
      </v-container>
</template>

<script>

import {ipcRenderer} from 'electron'
import Redmine from 'node-redmine'
import {mapState, mapGetters} from 'vuex'
import util from '@/globals/ui-util'
import Workspaces from './Configuration/Workspaces'
import TimeField from '@/globals/TimeField'

export default {
  components: {Workspaces, TimeField},
  data () {
    return {
      workingStatus: '',
      pausedStatus: '',
      statusList: [],
      workspaces: [],
      entrada: '',
      intervalo: '',
      retorno: '',
      saida: '',
      rules: [util.required]
    }
  },
  computed: {
    ...mapState({
      gravatarUrl: state => state.Preferences.gravatarUrl,
      redmine: state => new Redmine(state.Preferences.hostname, {apiKey: state.Preferences.apiKey}),
      preferences: state => state.Preferences,
      user: state => state.user
    }),
    ...mapGetters([ 'isAuthenticated', 'userFullName', 'workspaceList' ])
  },
  methods: {
    confirm () {
      if (this.$refs.form.validate()) {
        let params = {
          workingStatus: this.workingStatus,
          pausedStatus: this.pausedStatus,
          workspaces: this.workspaces,
          entrada: this.entrada,
          intervalo: this.intervalo,
          retorno: this.retorno,
          saida: this.saida
        }
        this.$store.dispatch('savePreferences', params)
        this.$store.dispatch('success', 'Preferências salvas com sucesso.')
        ipcRenderer.send('request-fs-watch', this.workspaces)
      }
    },
    cancel () {
      util.clearAlert()
      this.$refs.form.reset()
      this.workingStatus = this.preferences.workingStatus
      this.pausedStatus = this.preferences.pausedStatus
    }
  },
  mounted () {
    this.workingStatus = this.preferences.workingStatus
    this.pausedStatus = this.preferences.pausedStatus
    this.entrada = this.preferences.entrada
    this.intervalo = this.preferences.intervalo
    this.retorno = this.preferences.retorno
    this.saida = this.preferences.saida
    this.workspaces = this.workspaceList
    this.redmine.issue_statuses((err, data) => {
      util.assertNoError(err, 'Não foi possível carregar sua lista de status de tarefas.')
      this.statusList = data.issue_statuses
    })
  },
  beforeDestroy () {
    util.clearAlert()
  }
}
</script>

<style>

</style>

