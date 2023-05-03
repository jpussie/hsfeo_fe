console.log('workingss');
window.addEventListener('load', function(){
  const { createApp } = Vue
  createApp({
    setup() {
      const message = Vue.ref('this is vue')
      const resData = Vue.ref()
      const showModal = Vue.ref(false)
      const createReservationModal = Vue.ref(false)
      const viewReservationDetails = Vue.ref(false)
      const reservations = Vue.ref()
      const showDetails = Vue.ref(false)
      const showTableData = Vue.ref(false)
      const roomTypes = Vue.ref(
        [
          {'id': 0, 'type':'Dorm Type', 'price':'700'},
          {'id': 1, 'type':'Air-Conditioned', 'price':'900'},
          {'id': 2, 'type':'Deluxe', 'price':'2000'},
        ]
      )
      
      const form = Vue.ref({
        fname : '',
        mname : '',
        lname : '',
        gender : '',
        guest_type: '',
        contact_number : '',
        email: '',
        room_type: '',
        room_price: '',
        room_number: '',
        no_of_night: 0,
        no_of_person: 0,
        no_of_bed: 0,
        no_of_towel: 0,
        check_in_date: 0,
        check_out_date: 0,
        guest_notes: '',
        total: 0,
        status: '',
        payment_status: '',
        payment_type: '',
        notes: ''
      })

      Vue.onBeforeMount(() => {
        getAllReservation()
      })

      const RoomTypePrice = (value) => {
        if (value == 'Deluxe') {
          return 3000
        }else if (value == 'Air-Conditioned') {
          return 900
        }else{
          return 700
        }
      }

      const getAllReservation = () => {
        console.log('getting all reservations');
        var payload_handler = {
          package_entry : 'get_all',
          package_data : {
            page: 10
          }
        }

        axios.post(domain_url+'package_billing', payload_handler).then(response => {
          console.log('response', response);
          if (response.data?.results) {
            reservations.value = response.data.results
            showTableData.value = true
          }
        })
        console.log('storing data');
        console.log(form.value);

      }

      const storeResData = () => {
        form.value.total = Number(RoomTypePrice(form.value.room_type)) * form.value.no_of_night
        form.value.room_price = Number(RoomTypePrice(form.value.room_type))
        var payload_handler = {
          package_entry : 'create',
          package_data : form.value
        }

        axios.post(domain_url+'package_billing', payload_handler).then(response => {
          console.log('response', response);
          if (response.data.success) {
            createReservationModal.value = false
            viewDetailsById(response.data.results)
            getAllReservation()
          }
        })
      }

      const viewDetailsById = (id) => {
        var payload_handler = {
          package_entry : 'view',
          package_data : {
            id: id
          }
        }

        axios.post(domain_url+'package_billing', payload_handler).then(response => {
          if (response.data.success) {
            resData.value = response.data.results
            if (resData.value.reservationDetailsData) {
              form.value.status = resData.value.reservationDetailsData.status
              form.value.payment_status = resData.value.reservationData.payment_status
            }
            showDetails.value = true
            createReservationModal.value = false
            showTableData.value = false
            console.log('showTableData.value', showTableData.value);
          }
        })
      }

      const openPaypal = () => {
        window.open('https://www.sandbox.paypal.com/checkoutnow?sessionID=uid_730d46d7d8_mti6mzy6mzm&buttonSessionID=uid_a37b59258b_mti6ndu6mzi&stickinessID=uid_2c07f0fff0_mti6ndi6nda&smokeHash=&fundingSource=paypal&buyerCountry=PH&locale.x=en_US&commit=true&clientID=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R&env=sandbox&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWwuY29tL3Nkay9qcz9jbGllbnQtaWQ9dGVzdCZjdXJyZW5jeT1VU0QiLCJhdHRycyI6eyJkYXRhLXVpZCI6InVpZF91cWZ2a3lmamxwcmhsaHVpc21udnRuaHZxZWpyZnYifX0&xcomponent=1&version=5.0.370&token=1XH82302X27807434','popup','width=600,height=600'); return false;
      }

      return {
        message,
        showModal,
        createReservationModal,
        viewReservationDetails,
        form,
        resData,
        roomTypes,
        reservations,
        showDetails,
        showTableData,
        openPaypal,
        //functions
        storeResData,
        RoomTypePrice,
        viewDetailsById,
      }
    }
  }).mount('#app')
})
