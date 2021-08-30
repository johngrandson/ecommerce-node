const router = require("express").Router();
const auth = require("../../../middlewares/auth.middleware");
const Controller = require("../../../controllers/customer.controller");
const { Validator } = require("../../../middlewares/validator.middleware");
const { admin } = require("../../../validations/store.validation");

const controller = new Controller();

// Authenticated
router.get("/", auth.required, admin, controller.index);
// router.get("/search/:search/orders", auth.required, admin, controller.searchOrders);
router.get("/search/:search", auth.required, admin, controller.search);

// router.get("/admin/:id", auth.required, admin, controller.showAdmin);
// router.get("/admin/:id/:orders", auth.required, admin, controller.showCustomerOrders);

router.put("/admin/:id", auth.required, admin, controller.updateAdmin);

// Customer
router.get("/:id", auth.required, controller.show);
router.post("/", auth.required, controller.create);
router.put("/:id", auth.required, controller.update);
router.delete("/:id", auth.required, controller.remove);

module.exports = router;
