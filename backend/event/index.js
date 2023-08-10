const { EventEmitter } = require("events");
const { mailNoReplyDispatcher, mailInfoDispatcher } = require("../util");
const { newUserTemplate } = require("../util/templates");
const eventManager = new EventEmitter();
const { adminEmail } = require("../config");

eventManager.on("new_user", async (payload) => {
  try {
    // console.log("event emitter payload", payload)
    const to = payload.email;
    const message = `Dear ${payload.name}, <br>

        <p>Welcome to Azchem Resources! We're so excited to have you on board.<p>
        <br>

        <p>Here are your credentials for safe keeping - you can star this email if you want:<p>
        <br>
        <p><b>Username: ${payload.email}</b><p> <br>
        <p><b>Password: ${payload.password}</b></p> <br>

        <p>We're a company that provides essential products that will always stand the test of time. Our products include food flavors, food colors, and food additives. We're committed to providing our customers with the highest quality products and services, and we're confident that you'll be happy with our products.<p>
        <br>

        <p>As a valued customer, you'll enjoy a number of benefits, including:</p><br>

        <ul>
        <li>Exclusive discounts on our products</li>
        <li>Early access to new products</li>
        <li>Personalized customer service</li>
        <li>And more!</li>
      </ul>
      <br>

        <p>We hope you'll take some time to explore our website and learn more about our products. We're confident that you'll find something that you love.</p><br>

        <p>Thank you for choosing Azchem Resources!</p><br>
        <p>Sincerely,</p><br>        

        <p>The Azchem Resources Team</p><br>        
        
        <p>https://azchemresources.com/</p><br>
        
        `;
    const html = await newUserTemplate(message);
    const options = {
      to,
      html,
      subject: "Welcome to Azchem Resources Store",
    };
    await mailNoReplyDispatcher(options);
  } catch (error) {
    // console.log("eventEmitter mailNoReplyDispatcher Error",error);
  }
});

eventManager.on("new_order", async (payload) => {
  try {
    // Extract order items' details
    const orderItemsDetails = payload.orderSummary.map((orderItem) => {
      return `
        <tr>
          <td style="text-align: left;">${orderItem.product.name}</td>
          <td style="text-align: left;">${orderItem.quantity}</td>
          <td style="text-align: left;">₦${(orderItem.product.price * orderItem.quantity).toFixed(2)}</td>
        </tr>
      `;
    });

    const to = payload.email;
    const message = `Dear ${payload.name}, <br>

        <p style="text-align: left;">Thank you for choosing Azchem Resources Store for your recent purchase. We are delighted to confirm your order details as follows:<p>
        <br>

        <p style="text-align: left;">Order Number: #${payload._id}<p>
        <p style="text-align: left;">Order Date: ${payload.dateOrdered.toISOString().split("T")[0]}<p>
        <p style="text-align: left;">Shipping Address: ${payload.shippingAddress1} or ${
      payload.shippingAddress2
    }<p>
        <br> 

        <h3 style="text-align: left;"><b>Your Order Summary:</b></h3>
        <table style="text-align: left;">
          <tr>
            <th>Product Name</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
          ${orderItemsDetails.join("")}
        </table>
        <p style="text-align: left;">Total Price: ${payload.totalPrice.toLocaleString("en-US", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        })}<p>
        <br>

        <p style="text-align: left;">Please note that the above prices and quantities are subject to verification. You will receive a separate email with tracking information once your order has been shipped.</p><br>

        <p style="text-align: left;">Thank you for choosing Azchem Resources!</p><br>
        <p style="text-align: left;">Sincerely,</p>   
        <p style="text-align: left;">The Azchem Resources Team</p>      
        <p style="text-align: left;">https://azchemresources.com/</p>
        
        `;
    const html = await newUserTemplate(message);
    const options = {
      to,
      html,
      subject: "Your order has been placed",
    };
    await mailNoReplyDispatcher(options);
  } catch (error) {
    console.log("eventEmitter mailNoReplyDispatcher Error", error);
  }
});


module.exports = eventManager;
