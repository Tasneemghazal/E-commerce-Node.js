import 'dotenv/config'
import express from 'express'
import initApp from './src/app.router.js'
const app = express();
const PORT = process.env.PORT || 3000;

const endpointSecret="whsec_vLZGfKmNIvSX6qgsRTwcnLPGlNHMSSTu";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig,endpointSecret);
  } catch (err) {
  return  response.status(400).send(`Webhook Error: ${err.message}`);
    
  }
   if(event.type == 'checkout.session.completed'){
      console.log("create order ....");
    const checkoutSessionCompleted = event.data.object;
   }else{
    console.log(`Unhandled event type ${event.type}`);
   }
   
  response.send();
});
initApp(app,express);

app.listen(PORT,()=>{
    console.log(`server listening on ${PORT}`);
})