import express from "express";
import authUser from "../middlewares/authUser.js";
import { addAddreess, getAddreess } from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post("/add", authUser, addAddreess);
addressRouter.get("/get", authUser, getAddreess);

export default addressRouter;
