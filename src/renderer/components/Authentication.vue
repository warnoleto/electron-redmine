<template>
  <v-container>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm6 md6>
          <v-card class="elevation-1">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Authenticação</v-toolbar-title>
            </v-toolbar>
            <v-alert :type="notification.type" :value="notification.visible">
              {{notification.message}}
            </v-alert>
            <v-form ref="form" lazy-validation>
              <v-card-text>
                <v-text-field label="Url do Serviço" v-model="hostname" required :rules="rules" type="url" ></v-text-field>
                <v-text-field label="Api Access key" v-model="apiKey" required :rules="rules" ></v-text-field>
              </v-card-text>
              <v-card-actions>
              <v-spacer></v-spacer>
                <v-btn @click="authenticate" color="info" >Autenticar</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>

import Redmine from 'node-redmine'
import {mapState, mapGetters} from 'vuex'
import util from '@/globals/ui-util'

export default {
  name: 'authentication',
  data () {
    return {
      hostname: this.prefHostname,
      apiKey: this.prefApiKey,
      rules: [util.required]
    }
  },
  computed: {
    ...mapState({
      gravatarUrl: state => state.Preferences.gravatarUrl,
      prefHostname: state => state.Preferences.hostname,
      prefApiKey: state => state.Preferences.apiKey,
      notification: state => state.Notifications,
      user: state => state.user
    }),
    ...mapGetters([ 'isAuthenticated', 'userFullName' ])
  },
  methods: {
    authenticate () {
      if (!this.$refs.form.validate()) {
        return
      }
      let apiKey = this.apiKey
      let hostname = this.hostname
      let redmine = new Redmine(hostname, { apiKey })

      redmine.current_user({}, (err, data) => {
        util.assertNoError(err, 'Não foi possível autenticar! Verifique os parâmetros informados.')
        let user = data.user
        this.$store.dispatch('authenticate', {apiKey, hostname, user})
      })
    }
  },
  mounted () {
    this.hostname = this.prefHostname
    this.apiKey = this.prefApiKey
  },
  beforeDestroy () {
    util.clearAlert()
  }
}
</script>

<style>

</style>

