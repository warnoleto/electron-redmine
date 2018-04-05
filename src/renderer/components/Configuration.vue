<template>
  <v-container>
       <v-form v-model="valid">
           <v-container>
                <v-text-field label="Url do Seriço" v-model="hostname" required type="url" :validate-on-blur="true" ></v-text-field>
                <v-text-field label="Api Access key" v-model="apiKey" required  :validate-on-blur="true" ></v-text-field>
                <v-btn flat @click="authenticate" color="info" >Autenticar</v-btn>
           </v-container>
            <v-container>
                <v-select :disabled="!isAuthenticated" :items="statusList" v-model="progressStatus" label="Status Em Andamento" single-line item-text="name" item-value="id"></v-select>
                <v-select :disabled="!isAuthenticated" :items="statusList" v-model="pausedStatus" label="Status Pausada" single-line  item-text="name" item-value="id"></v-select>
            </v-container>
            <v-footer>
                <v-btn flat @click="cancel" color="error" class="text-md-right">Cancelar</v-btn>
                <v-btn flat @click="confirm" color="success" class="text-md-right">Salvar</v-btn>
            </v-footer>
       </v-form>
       
  </v-container>
</template>

<script>

import Redmine from 'node-redmine'
import {mapState, mapGetters} from 'vuex'

export default {
  data () {
    return {
      hostname: this.prefHostname,
      apiKey: this.prefApiKey,
      valid: true,
      progressStatus: '',
      pausedStatus: '',
      statusList: []
    }
  },
  computed: {
    ...mapState({
      gravatarUrl: state => state.Preferences.gravatarUrl,
      prefHostname: state => state.Preferences.hostname,
      prefApiKey: state => state.Preferences.apiKey,
      user: state => state.user
    }),
    ...mapGetters([ 'isAuthenticated', 'userFullName' ])
  },
  methods: {
    authenticate () {
      let apiKey = this.apiKey
      let hostname = this.hostname
      let redmine = new Redmine(hostname, { apiKey })

      redmine.current_user({}, (err, data) => {
        if (err) throw err
        let user = data.user
        this.$store.dispatch('authenticate', {apiKey, hostname, user})
      })
      redmine.issue_statuses((err, data) => {
        if (err) throw err
        this.statusList = data.issue_statuses
      })
    },
    confirm () {
      console.log('confirm')
    },
    cancel () {
      console.log('cancel')
    }
  },
  mounted () {
    this.hostname = this.prefHostname
    this.apiKey = this.prefApiKey
    this.authenticate()
  }
}
</script>

<style>

</style>

