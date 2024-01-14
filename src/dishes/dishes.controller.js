const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// Validation Middleware
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Dish must include a ${propertyName}` });
  };
}

function priceIsValid(req, res, next) {
  const {
    data: { price },
  } = req.body;
  if (price > 0 && Number.isInteger(price)) {
    return next();
  }
  return next({
    status: 400,
    message: "Dish must have a price that is an integer greater than 0",
  });
}

function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  return next({
    status: 404,
    message: `Dish does not exist: ${dishId}.`,
  });
}

function bodyIdMatchesRouteId(req, res, next) {
  const dishId = req.params.dishId;
  const id = req.body.data.id;
  if (!id || dishId === id) {
    return next();
  }
  return next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
  });
}

// List
function list(req, res) {
  res.json({ data: dishes });
}

// Create
function create(req, res) {
  const {
    data: { name, description, image_url, price },
  } = req.body;
  const newDish = {
    id: nextId(),
    name: name,
    description: description,
    image_url: image_url,
    price: price,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

// Read
function read(req, res) {
  res.status(200).json({ data: res.locals.dish });
}

// Update
function update(req, res) {
  const dish = res.locals.dish;
  const {
    data: { name, description, image_url, price },
  } = req.body;
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;
  res.status(200).json({ data: dish });
}
// Delete

module.exports = {
  create: [
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("image_url"),
    bodyDataHas("price"),
    priceIsValid,
    create,
  ],
  read: [dishExists, read],
  update: [
    dishExists,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("image_url"),
    bodyDataHas("price"),
    priceIsValid,
    bodyIdMatchesRouteId,
    update,
  ],
  list,
};
