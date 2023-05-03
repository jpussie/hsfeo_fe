console.log('login js is working');

const { createApp } = Vue
createApp({
  setup() {
    const form = Vue.ref({
      email : '',
      password : ''
    })
  }
}).mount('#app')