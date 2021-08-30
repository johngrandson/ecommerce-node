const router = require("express").Router();
const auth = require("../../../middlewares/auth.middleware");
const Controller = require("../../../controllers/store.controller");
const { Validator } = require("../../../middlewares/validator.middleware");
const {
  admin,
  show,
  create,
  update,
} = require("../../../validations/store.validation");

const controller = new Controller();

router.get("/", controller.index);
router.get("/:id", Validator.check(show), controller.show);

router.post("/", auth.required, Validator.check(create), controller.create);
router.put(
  "/:id",
  auth.required,
  admin,
  Validator.check(update),
  controller.update
);
router.delete("/:id", auth.required, admin, controller.remove);

module.exports = router;
