//update user cartdata :api/cart/update

import User from "../models/user.js";

export const updateCart = async (req, res) => {
  try {
    //const { userId, cartItems } = req.body;
     const userId = req.userId; 
    const { cartItems } = req.body;

    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, message: "cart update" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
