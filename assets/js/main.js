// var domain_url = 'https://app.dev.hfseo.local:8890/api/'
var domain_url='http://127.0.0.1:8000/api/'
var user_data = '' 


const getCurrentUser = async () => {
  if (localStorage.getItem('user_id')) {
    console.log('naay user_id')
   await axios.get(domain_url+'get_current_user/'+localStorage.getItem('user_id')).then(response => {
      console.log('response', response);
      if (response.data.success) {
        console.log('response.data', response.data);
        user_data = response.data.results.name
        console.log('user_data', user_data);
      }
    })
  }else{
    console.log('walay user_id');
    window.location.href = '/login.html'
  }
}

const getUserData = () => {
  return user_data
}

const isLoggedIn = () => {
  if (localStorage.getItem('user_id')) {
    window.location.href = '/pages/billing.html'
  }
}

const logoutUser = () => {
  if (localStorage.getItem('user_id')) {
    localStorage.removeItem('user_id')
    window.location.href = '/login.html'
  }
}