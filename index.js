const express = require("express");
const app = express();
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_API_SRECRET_KEY);

app.use(express.static("public"));
app.use(express.json());
app.use(cors())


app.post('/checkout', async(req, res) => {
  const {product} = req.body;
 
  const line_items = product.map((product) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.title,
        
      },
      
      unit_amount:product.price*100
    },
    quantity: product.quantity,
  }))
  const session = await stripe.checkout.sessions.create({
    line_items: line_items,
    mode: 'payment',
    payment_method_types:['card','amazon_pay'],

    success_url: `${process.env.DOMAIN_URL}/success`,
    cancel_url:`${process.env.DOMAIN_URL}/cancel`,

  });
  res.send({id:session.id})
})
app.listen(4242, () => console.log("Node server listening on port 4242!"));