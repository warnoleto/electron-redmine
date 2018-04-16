<template>
  <v-flex xs12 sm3>
    <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" offset-y full-width :nudge-right="40"
        max-width="290px" min-width="290px"  >
      <v-text-field slot="activator" :label="label" :value="tempValue" prepend-icon="access_time" readonly ></v-text-field>
      <v-time-picker :value="tempValue" @change="$refs.menu.save(tempValue)" @input="triggerEvent" :allowed-minutes="allowedMinutes"></v-time-picker>
    </v-menu>
  </v-flex>
</template>

<script>
export default {
  props: [ 'value', 'label' ],
  data () {
    return {
      menu: false
    }
  },
  methods: {
    allowedMinutes (v) {
      return v === 0 || v === 30
    },
    triggerEvent (value) {
      this.$emit('input', value)
    }
  },
  computed: {
    tempValue () {
      return this.value
    }
  }
}
</script>

