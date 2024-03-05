const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

function list (req, res) {
  res.send({data: orders});
}

function create(req, res) {
 const deliverTo = req.body.data.deliverTo;
 const mobileNumber = req.body.data.mobileNumber;
 const dishes = req.body.data.dishes;

 if (!deliverTo) {
    res.status(400).send({ error: `deliverTo` });
 } else if (!mobileNumber) {
    res.status(400).send({ error: `mobileNumber` });
 } else if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    res.status(400).send({ error: `dish` });
 } else {
    for (let i = 0; i < dishes.length; i++) {
      const dish = dishes[i];
      if (!dish.hasOwnProperty('quantity') || dish.quantity === null || dish.quantity === 0 || !Number.isInteger(dish.quantity)) {
        return res.status(400).send({ error: `Dish index ${i} has an invalid quantity.` });
      }
    }
   
   const newOrder = {
     id: nextId(),
     deliverTo: deliverTo,
     mobileNumber: mobileNumber,
     dishes: dishes
   }

   orders.push(newOrder);
   res.status(201).send({ data: newOrder });
 }
}

function read(req, res) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => orderId === order.id);
  
  if(foundOrder){
    res.send({data: foundOrder});
  } else {
    res.status(404).send({error: `order not found.`});
  }
}

function update(req, res) {
 const deliverTo = req.body.data.deliverTo;
 const mobileNumber = req.body.data.mobileNumber;
 const dishes = req.body.data.dishes;
 const status = req.body.data.status;
 const orderId = req.params.orderId;
 const dataId = req.body.data.id; 
 const updatedOrderData = req.body.data;
  
 const foundOrder = orders.find((order) => orderId === order.id);
 const orderIndex = orders.findIndex((order) => orderId === order.id);
  
  if(!foundOrder){
    res.status(404).send({error: "order does not exist"});
  }

  if (dataId && dataId !== orderId) {
    return res.status(400).send({ error: `id ${dataId} does not match.` });
 }

 if (!deliverTo) {
    res.status(400).send({ error: "deliverTo" });
 } else if (!mobileNumber) {
    res.status(400).send({ error: "mobileNumber" });
 } else if (!dishes || dishes.length === 0 || !Array.isArray(dishes)) {
    res.status(400).send({ error: "dishes" });
 } else if (!status) {
    res.status(400).send({ error: "status" });
 } else if (status === "invalid"){
   res.status(400).send({ error: "status" });
 } else {
    for (let i = 0; i < dishes.length; i++) {
      const dish = dishes[i];
      if (!dish.hasOwnProperty('quantity') || dish.quantity === null || dish.quantity === 0 || !Number.isInteger(dish.quantity)) {
        return res.status(400).send({ error: `Dish index ${i} has an invalid quantity.` });
      }
    }
 }
 if (foundOrder && orderIndex != -1) {
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updatedOrderData,
      id: orderId
    };
    res.send({ data: orders[orderIndex] });
 } else {
    res.status(404).send({ error: `order id not found.` });
 }
}

function deleteOrder(req, res) {
 const orderId = req.params.orderId;
 const orderIndex = orders.findIndex((order) => order.id === orderId);

 if (orderIndex !== -1) {
    const order = orders[orderIndex];
    if (order.status !== "pending") {
        return res.status(400).send({ error: "Order status must be 'pending' to be deleted." });
    }
    orders.splice(orderIndex, 1);
    res.status(204).send();
 } else {
    res.status(404).send({ error: `Order with id ${orderId} not found.` });
 }
}






module.exports = {
  list:list,
  create: create,
  read: read,
  update: update,
  deleteOrder: deleteOrder
}