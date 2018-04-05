<template>
  <v-container>
        <v-btn flat color="info" >Hel0o</v-btn>
  </v-container>
</template>

<script>

// import Redmine from 'node-redmine'
import {mapState} from 'vuex'

export default {
  name: 'my-tasks',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      prefHostname: state => state.Preferences.hostname,
      prefApiKey: state => state.Preferences.apiKey,
      user: state => state.user
    })
  },
  methods: {
    refresh () {
      /* let apiKey = this.apiKey
      let hostname = this.hostname
      let redmine = new Redmine(hostname, { apiKey }) */
    }
  },
  mounted () {
    this.refresh()
  }
}
</script>

<style>

</style>

