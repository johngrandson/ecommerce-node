const router = require("express").Router();

router.use("/user", require("./user.route"));
router.use("/store", require("./store.route"));
router.use("/customer", require("./customer.route"));

module.exports = router;
