const router = require("express").Router({mergeParams: true});
const controller = require("./orders.controller.js");
const methodNotAllowed = require("../errors/methodNotAllowed.js");

// TODO: Implement the /orders routes needed to make the tests pass

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/:orderId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.deleteOrder)
  .all(methodNotAllowed);


module.exports = router;
