const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const express = require("express");
const router = express.Router();

//Get all orders in DB
router.get("/", async (req, res) => {
  const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList); 
});

//Get order in DB by ID
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name').populate({path: 'orderItems', populate:{path: "product", populate: 'category'}})
  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

// Create a new order
router.post("/", async (req, res) => {
  try {
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );
    const orderItemsResolved = await orderItemsIds;
    console.log("orderItemsResolved>>>  ", orderItemsResolved);
    let order = new Order({
      orderItems: orderItemsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user,
      shippingMethod: req.body.shippingMethod,
      trackingNumber: req.body.trackingNumber,
    });
    order = await order.save();
    if (!order) return res.status(404).send("The order cannot be created");
    res.send(order);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

module.exports = router;
