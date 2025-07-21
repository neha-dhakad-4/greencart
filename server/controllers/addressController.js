import Address from "../models/Address.js";

//Add Address :/api/address/add
export const addAddreess = async (req, res) => {
  try {
    const userId = req.userId; // ✅ get from JWT, not body
    const { address } = req.body;

    if (!address) {
      return res.json({ success: false, message: "No address provided" });
    }

    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Get Address :/api/address/get

export const getAddreess = async (req, res) => {
  try {
    const userId = req.userId;
    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
