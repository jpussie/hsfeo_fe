
const PayPalButton = paypal.Buttons.driver('vue', window.Vue)

Vue.component('app', {
  // The style prop for the PayPal button should be passed in as `style-object` or `styleObject` to avoid conflict with Vue's `style` reserved prop.
  template: `
    <paypal-buttons :on-approve="onApprove" :create-order="createOrder" :on-shipping-change="onShippingChange" :on-error="onError" :style-object="style" />
  `,
  components: {
    'paypal-buttons': PayPalButton,
  },

  computed: {
    createOrder: function () {
      return (data) => {
        // Order is created on the server and the order id is returned
        return fetch("/my-server/create-paypal-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // use the "body" param to optionally pass additional order information
          // like product skus and quantities
          body: JSON.stringify({
            cart: [
              {
                sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
                quantity: "YOUR_PRODUCT_QUANTITY",
              },
            ],
          }),
        })
        .then((response) => response.json())
        .then((order) => order.id);
      }
    },
    onApprove: function () {
      return (data) => {
        // Order is captured on the server
        return fetch("/my-server/capture-paypal-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: data.orderID
          })
        })
        .then((response) => response.json());
      }
    },
    onShippingChange: function () {
      return (data, actions) => {
        if (data.shipping_address.country_code !== 'US') {
          return actions.reject()
        }
        return actions.resolve()
      }
    },
    onError: function () {
      return (err) => {
        console.error(err)
        window.location.href = '/your-error-page-here'
      }
    },
    style: function () {
      return {
        shape: 'pill',
        color: 'gold',
        layout: 'horizontal',
        label: 'paypal',
        tagline: false,
      }
    },
  },
})

const vm = new Vue({
  el: '#container',
})