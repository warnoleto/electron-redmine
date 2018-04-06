<template>
  <v-form v-model="valid">
      <v-container>
          <h3>Reportar Atividade</h3>
      </v-container>
      <v-footer>
          <v-btn flat @click="cancel" color="error" class="text-md-right">Cancelar</v-btn>
          <v-btn flat @click="confirm" color="success" class="text-md-right">Salvar</v-btn>
      </v-footer>
  </v-form>
</template>

<script>

import {mapState} from 'vuex'

export default {
  data () {
    return {
      valid: true
    }
  },
  computed: {
    ...mapState({
      gravatarUrl: state => state.Preferences.gravatarUrl,
      hostname: state => state.Preferences.hostname,
      apiKey: state => state.Preferences.apiKey,
      user: state => state.user
    })
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
  }
}
</script>

<style>

</style>

