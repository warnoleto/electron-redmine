import store from '../store'
export default {
  required: v => !!v || 'Preenchimento Obrigatório!',

  assertNoError: (err, msg) => {
    if (err) {
      store.dispatch('error', msg)
      throw err
    }
  },
  clearAlert: () => store.dispatch('clearAlert')
}
