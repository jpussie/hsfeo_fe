console.log('login js is working');
window.addEventListener('load', function(){
  const { createApp } = Vue
  createApp({
    setup() {
      const error_msg = Vue.ref(),
            form = Vue.ref({
                email : '',
                password : '',
                
              })

      const loginUser = () =>{
        console.log('this is working');
        axios.post(domain_url+'auth_login', form.value).then(response => {
          if (response.data?.success) {
            console.log('success data', );
            localStorage.setItem("user_id", response.data?.results.user.id)
            window.location.href = '/pages/billing.html'
          }else{
            console.log('not success data');
            error_msg.value = response.data?.results
          }
          console.log('this is response', response);
        })
      }

      Vue.onBeforeMount(() => {
        isLoggedIn()
      })

      const inputData = (e) => {
        console.log('sadfs');
        error_msg.value = []
      }

      return {
        loginUser,
        inputData,
        form,
        error_msg
      }
    }
  }).mount('#app')
})