import Vue from 'vue'
import App from '@/App'

describe('App.vue', () => {
  it('should render authentication form', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(App)
    }).$mount()

    expect(vm.$el.querySelector('div.toolbar__title').textContent).to.contain('Autenticação')
  })
})
