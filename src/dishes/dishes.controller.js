const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");


function list (req, res) {
  res.send({data: dishes});
}

function create(req, res) {
 const id = nextId();
 const name = req.body.data.name;
 const description = req.body.data.description;
 const price = Number(req.body.data.price);
 const imageUrl = req.body.data.image_url;

 if (!name) {
    return res.status(400).send({ error: "name" });
 } else if (!description) {
    return res.status(400).send({ error: "description" });
 } else if (!price || price < 0) {
    return res.status(400).send({ error: "price" });
 } else if (!imageUrl) {
    return res.status(400).send({ error: "image_url" });
 }
  

const newDish = {
    id: id,
    name: name,
    description: description,
    price: price,
    image_url: imageUrl
 };
 dishes.push(newDish);
 res.status(201).send({ data: newDish });
}

function update(req, res) {
 const dishId = req.params.dishId;
 const updatedDishData = req.body.data;

 const name = req.body.data.name;
 const description = req.body.data.description;
 const price = req.body.data.price;
 const imageUrl = req.body.data.image_url;
 let dataId = req.body.data.id; // Use let to allow reassignment

 if (dataId == null || dataId == "") {
    dataId = dishId;
 }

 const dishIndex = dishes.findIndex((dish) => dishId === dish.id);

 if (dishIndex === -1) {
    return res.status(404).send({ error: "id" });
 }

 if (!name) {
    return res.status(400).send({ error: "name" });
 } else if (!description) {
    return res.status(400).send({ error: "description" });
 } else if (!price) {
    return res.status(400).send({ error: "price" });
 } else if (typeof (price) != "number") {
    return res.status(400).send({ error: "price" });
 } else if (price < 0) {
    return res.status(400).send({ error: "price" });
 } else if (!imageUrl) {
    return res.status(400).send({ error: "image_url" });
 }

 if (dishIndex != -1 && dataId === dishId) {
    dishes[dishIndex] = { ...dishes[dishIndex], ...updatedDishData, id: dataId };
    res.send({ data: dishes[dishIndex] });
 } else {
    res.status(400).send({ error: `${dataId} id` });
 }
}

function read(req, res, next) {
 const dishId = Number(req.params.dishId);
 const foundDish = dishes.find((dish) => dishId === Number(dish.id));
  
 if (foundDish) {
    res.send({ data: foundDish });
 } else {
    res.status(404).send({ error: `Dish ${dishId} not found.` });
 }
}



module.exports = {
  list: list,
  create: create,
  update: update,
  read: read
}
