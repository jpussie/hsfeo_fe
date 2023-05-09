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
      const editMode = Vue.ref(false)
      const openCreditModal = Vue.ref(true)
      const showModalCreate = Vue.ref(true)
      const invoiceData = Vue.ref()

      const roomTypes = Vue.ref(
        [
          {'id': 0, 'type':'Dorm Type', 'price':'700'},
          {'id': 1, 'type':'Air-Conditioned', 'price':'900'},
          {'id': 2, 'type':'Deluxe', 'price':'2000'},
        ]
      )
      
      const form = Vue.ref({
        reservationData_id: '',
        guestData_id: '',
        reservationDetailsData_id: '',
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

      const clearForm = () => {
        form.value.reservationData_id  = ''
        form.value.guestData_id  = ''
        form.value.reservationDetailsData_id  = ''
        form.value.fname  = ''
        form.value.mname  = ''
        form.value.lname  = ''
        form.value.gender  = ''
        form.value.guest_type = ''
        form.value.contact_number  = ''
        form.value.email = ''
        form.value.room_type = ''
        form.value.room_price = ''
        form.value.room_number = ''
        form.value.no_of_night = ''
        form.value.no_of_person = ''
        form.value.no_of_bed = ''
        form.value.no_of_towel = ''
        form.value.check_in_date = ''
        form.value.check_out_date = ''
        form.value.notes = ''
        form.value.total = ''
        form.value.status = ''
        form.value.payment_status = ''
        form.value.payment_type = ''

      }

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
            invoiceData.value = response.data.results
            // viewDetailsById(response.data.results, 'view')
            // getAllReservation()
            Swal.fire(
              'Success!',
              'You successfully created reservation!',
              'success'
            )
            showModalCreate.value = false
            clearForm()
          }
        })
      }

      const updateResData = () => {
        form.value.total = Number(RoomTypePrice(form.value.room_type)) * form.value.no_of_night
        form.value.room_price = Number(RoomTypePrice(form.value.room_type))
        var payload_handler = {
          package_entry : 'update',
          package_data : form.value
        }

        axios.post(domain_url+'package_billing', payload_handler).then(response => {
          console.log('response', response);
          if (response.data.success) {
            createReservationModal.value = false
            showTableData.value = false
            viewDetailsById(response.data.results, 'view')
            getAllReservation()
            Swal.fire(
              'Changes Saved!',
              'You successfully updated reservation details!',
              'success'
            )
            clearForm()
          }
        })
      }

      payCredit = () => {
        Swal.fire(
          'Success Payment!',
          'Successfuly Paid',
          'success'
        )
        openCreditModal.value = false
      }
      const viewDetailsById = (id, type) => {
        var payload_handler = {
          package_entry : 'view',
          package_data : {
            id: id
          }
        }

        axios.post(domain_url+'package_billing', payload_handler).then(response => {
          if (response.data.success) {
            resData.value = response.data.results
            form.value.reservationData_id  = resData.value.reservationData.id
            form.value.guestData_id  = resData.value.guestData.id
            form.value.reservationDetailsData_id  = resData.value.reservationDetailsData.id
            form.value.fname  = resData.value.guestData.fname
            form.value.mname  = resData.value.guestData.mname
            form.value.lname  = resData.value.guestData.lname
            form.value.gender  = resData.value.guestData.gender
            form.value.guest_type = resData.value.guestData.guest_type
            form.value.contact_number  = resData.value.guestData.contact_number
            form.value.email = resData.value.guestData.email
            form.value.room_type = resData.value.reservationDetailsData.room_type
            form.value.room_price = resData.value.reservationDetailsData.room_price
            form.value.room_number = resData.value.reservationDetailsData.room_number
            form.value.no_of_night = resData.value.reservationDetailsData.no_of_nights
            form.value.no_of_person = resData.value.reservationDetailsData.no_of_person
            form.value.no_of_bed = resData.value.reservationDetailsData.no_of_extra_foam
            form.value.no_of_towel = resData.value.reservationDetailsData.no_of_extra_towels
            form.value.check_in_date = resData.value.reservationDetailsData.check_in_date
            form.value.check_out_date = resData.value.reservationDetailsData.check_out_date
            form.value.notes = resData.value.reservationDetailsData.notes
            form.value.total = resData.value.reservationDetailsData.total
            form.value.status = resData.value.reservationDetailsData.status
            form.value.payment_status = resData.value.reservationData.payment_status
            form.value.payment_type = resData.value.reservationData.payment_type
          
            if (type == 'update') {
              
              createReservationModal.value = true
              editMode.value = true

              console.log('form', form.value)
            }else{
              showDetails.value = true
              createReservationModal.value = false
              console.log('showTableData.value', showTableData.value);
            }
            showTableData.value = false
            
          }
        })
        
      }

      savePayment = () => {
        console.log('form.value', form.value);

        var payload_handler = {
          package_entry : 'update',
          package_data : form.value
        }

        axios.post(domain_url+'package_billing', payload_handler).then(response=>{
            console.log('response', response);
            Swal.fire(
              'Changes Saved!',
              'You successfully updated reservation details!',
              'success'
            )
            showModalCreate.value = false
            // clearForm()
            // viewDetailsById(response.data.results, 'view')
        })
      }

      onChange = (event) => {
        console.log(event, event);
      }
      
      const openPaypal = () => {
        window.open('https://www.paypal.com/ph/signin','popup','width=600,height=600'); return false;
      }

      statusClass = (value) => {
        if (value == 'BOOKED') {
          return 'primary'
        }else if (value == 'CHECKED-IN') {
          return 'warning'
        }else if(value == 'CHECKED-OUT') {
          return 'success'
        }else if (value == 'CANCELED') {
          return 'danger'
        }
      }

      paymentStatusClass = (value) => {
        if (value == 'UNPAID') {
          return 'warning'
        }else if(value == 'PAID') {
          return 'success'
        }else if (value == 'PENDING') {
          return 'danger'
        }
      }

      return {

        showModalCreate,
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
        editMode,
        openCreditModal,
        invoiceData,
        
        statusClass,
        paymentStatusClass,
        savePayment,
        openPaypal,
        payCredit,
        //functions
        storeResData,
        RoomTypePrice,
        viewDetailsById,
        updateResData,
        
      }
    }
  }).mount('#app')
})
