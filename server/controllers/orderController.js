//Place Order COD:/api/order/cod
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    // const userId = req.userId; // ✅ get from JWT
    // const { items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "invalid data" });
    }

    //calculate amount using items
    let amount = await items.reduce(async (acc, items) => {
      const product = await Product.findById(items.product);
      return (await acc) + product.offerPrice * items.quantity;
    }, 0);

    //add tax charge(2%)
    amount += Math.floor(amount * 0.02);
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.json({ success: true, message: "order placed successfully" });
  } catch (error) {
    return res.json({ success: true, message: error.message });
  }
};

//Get Order by User ID:/api/order/user

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createAt: -1 });
    console.log("Orders found:", orders);
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get All Order (for seller):/api/order/seller

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product address");

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
