const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const eventManager = require("../event");

//Get all orders in DB
router.get("/", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

//Get order in DB by ID
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
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

    const totalPrices = await Promise.all(
      orderItemsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    const user = await User.findById(req.body.user)
    const orderSummary = await Promise.all(
      orderItemsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "name price"
        );
        return orderItem; 
      })
    );
    let order = new Order({
      orderItems: orderItemsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip, 
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
      shippingMethod: req.body.shippingMethod, 
      trackingNumber: req.body.trackingNumber,
    });
    eventManager.emit("new_order", {
      name: user.name,
      email: user.email,
      orderSummary,
      ...order._doc
    });
    order = await order.save();
    if (!order) return res.status(404).send("The order cannot be created");
    res.send(order);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Update status of order
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send("Invalid Order ID");
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );
    if (!order) return res.status(404).send("The order cannot be updated");
    res.send(order);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send("Invalid Order ID");
    }
    const order = await Order.findByIdAndDelete(req.params.id);
    if (order) {
      const deleteOrderItems = await order.orderItems.map(async (orderItem) => {
        await OrderItem.findByIdAndDelete(orderItem);
      });
      res
        .status(200)
        .json({ success: true, message: "Order deleted successfully" });
    } else {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Sorry an error occurred, please try again.",
    });
  }
});

// total sales for admin dashboard

router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    return res.status(400).send("The order cannot be generated");
  }
  res.send({ totalsales: totalSales.pop().totalsales });
});

// Return order count for statistics
router.get("/get/count", async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    if (!orderCount) {
      res.status(500).json({ success: false });
    }
    res.send({
      orderCount: orderCount,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

//Get order history for user
router.get("/get/userorders/:userid", async (req, res) => {
  try {
    const userOrderList = await Order.find({user: req.params.userid}).populate({path: 'orderItems', populate:{
      path:'product', populate:'category'
    }}).sort({'dateOrdered': -1})
    if (!userOrderList) {
      res.status(500).json({ success: false });
    }
    res.send(userOrderList);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});
module.exports = router;
