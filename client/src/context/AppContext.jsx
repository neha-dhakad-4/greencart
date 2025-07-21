import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { dummyProducts } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";
axios.defaults.withCredentials=true;
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {

  const currency=import.meta.env.VITE_CURRENCY;
  const navigate=useNavigate();
  const [user,setUser]=useState(null);
  const [isSeller,setIsSeller]=useState(false);
  const [showUserLogin,setShowUserLogin]=useState(false);
  const [products,setProducts]=useState([]);
 const [cartItems,setCartItem]=useState({});
  const[searchQuery,setSearchQuery]=useState({});

  //fetch seller status
const fetchSeller=async ()=>{
  try {
    const {data}=await axios.get('/api/seller/is-auth');
    if(data.success){
      setIsSeller(true);
    }
    else{
      setIsSeller(false);
    }
  } catch (error) {
    console.log(error.message)
    setIsSeller(false);
  }
}
//fetch user auth status,user Data and cart item
const fetchUser=async ()=>{
  try {
    const {data} =await axios.get('api/user/is-auth');
if(data.success){
  setUser(data.user)
  setCartItem(data.user.cartItems)
}
  } catch (error) {
    setUser(null)
    console.log(error)
  }


}

 //fetch All Products
  const fetchProduct=async()=>{
   try {
    const{data}=await axios.get('/api/product/list')
    if(data.success){
      setProducts(data.products)
    }
    else{
      toast.error(data.message)
    }
   } catch (error) {
    toast.error(error.message)
   }
  }


  //Add Products to cart
const addToCart=(itemId)=>{
let cartData=structuredClone(cartItems);

if(cartData[itemId]){
  cartData[itemId] +=1;
}
else{
  cartData[itemId] =1;
}
setCartItem(cartData);
toast.success("Added to Cart");
}

//Update Cart Item Quantity
const updateCartItem=(itemId,quantity)=>{
let cartData=structuredClone(cartItems);
cartData[itemId]=quantity;
setCartItem(cartData);
toast.success("Cart Update");
}

//Remove Product From Cart
const removeFromCart=(itemId)=>{
let cartData=structuredClone(cartItems);

if(cartData[itemId]){
  cartData[itemId] -=1;
  if(cartData[itemId]===0)
  {
    delete cartData[itemId];
  }
}
toast.success("Remove  From Cart");
setCartItem(cartData);

}
//get cart item count
const getCartCount=()=>{

  let totaolCount=0;
  for(const item in cartItems){
    totaolCount +=cartItems[item];
  }
  return totaolCount;
}
//get cart total amount
const getCartAmount=()=>{
let totaloAmount=0;
for (const items in cartItems){
  let itemInfo=products.find((product)=>product._id===items);
  if(cartItems[items]>0){
    totaloAmount+=itemInfo.offerPrice * cartItems[items]
  }
}
return Math.floor(totaloAmount *100)/100;
}
  useEffect(()=>{
    fetchUser()
   fetchProduct()
   fetchSeller()
  },[])

  //update database cart items

  useEffect(()=>{
    const updateCart= async ()=>{
  try {
    
    const {data} =await axios.post('/api/cart/update',{cartItems})
    if(!data.success){
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
    }

    if(user){
      updateCart()
    }
  },[cartItems])
  const value = {navigate,user,setUser,isSeller,setIsSeller,showUserLogin,setShowUserLogin,products,currency,addToCart,updateCartItem,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartAmount,getCartCount,axios,fetchProduct,setCartItem};


  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;

};
export const useAppContext = () => {
  return useContext(AppContext);
};
