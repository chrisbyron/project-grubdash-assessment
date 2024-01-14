const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");
const { stat } = require("fs");

// TODO: Implement the /orders handlers needed to make the tests pass
// Validation Middleware
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Order must include a ${propertyName}` });
  };
}

function dishesPropertyIsValid(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (Array.isArray(dishes) && dishes.length > 0) {
    const index = dishes.findIndex(
      (dish) =>
        dish.quantity === undefined ||
        dish.quantity <= 0 ||
        !Number.isInteger(dish.quantity)
    );
    if (index < 0) {
      next();
    }
    next({
      status: 400,
      message: `Dish ${index} must have a quantity that is an integer greater than 0`,
    });
  }
  next({ status: 400, message: "Order must include at least one dish" });
}

function orderExists(req, res, next) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  return next({
    status: 404,
    message: `Order does not exist: ${orderId}.`,
  });
}

function bodyIdMatchesRouteId(req, res, next) {
  const orderId = req.params.orderId;
  const id = req.body.data.id;
  if (!id || orderId === id) {
    return next();
  }
  return next({
    status: 400,
    message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
  });
}

function statusPropertyIsValid(req, res, next) {
  const { data: { status } = {} } = req.body;
  const validStatus = ["pending", "preparing", "out-for-delivery"];
  if (res.locals.order.status != "delivered") {
    if (status && validStatus.includes(status)) {
      return next();
    }
    return next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
  }
  return next({
    status: 400,
    message: "A delivered order cannot be changed",
  });
}

function statusIsPending(req, res, next) {
  if (res.locals.order.status === "pending") {
    return next();
  }
  return next({
    status: 400,
    message: "An order cannot be deleted unless it is pending.",
  });
}

// List
function list(req, res) {
  res.json({ data: orders });
}

// Create
function create(req, res) {
  const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

// Read
function read(req, res) {
  res.json({ data: res.locals.order });
}

// Update
function update(req, res) {
  const order = res.locals.order;
  const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.dishes = dishes;
  order.status = status;
  res.status(200).json({ data: order });
}

// Delete
function destroy(req, res, next) {
  const index = orders.findIndex((order) => order.id === res.locals.order.id);
  orders.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  create: [
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    dishesPropertyIsValid,
    create,
  ],
  read: [orderExists, read],
  update: [
    orderExists,
    bodyIdMatchesRouteId,
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    dishesPropertyIsValid,
    statusPropertyIsValid,
    update,
  ],
  delete: [orderExists, statusIsPending, destroy],
  list,
};
