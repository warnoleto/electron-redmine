<template>
  <v-container>
       <v-form v-model="valid">
           <v-container>
                <v-text-field label="Url do Seriço" v-model="hostname" required type="url" :validate-on-blur="true" ></v-text-field>
                <v-text-field label="Api Access key" v-model="apiKey" required  :validate-on-blur="true" ></v-text-field>
                <v-btn flat @click="authenticate" color="info" >Autenticar</v-btn>
           </v-container>
       </v-form>
  </v-container>
</template>

<script>

import Redmine from 'node-redmine'
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'authentication',
  data () {
    return {
      hostname: this.prefHostname,
      apiKey: this.prefApiKey,
      valid: true
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
    }
  },
  mounted () {
    this.hostname = this.prefHostname
    this.apiKey = this.prefApiKey
  }
}
</script>

<style>

</style>

