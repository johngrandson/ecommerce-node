const router = require("express").Router();
const auth = require("../../../middlewares/auth.middleware");
const Controller = require("../../../controllers/user.controller");
const { Validator } = require("../../../middlewares/validator.middleware");
const {
  show,
  login,
  register,
  update,
} = require("../../../validations/user.validation");

const controller = new Controller();

router.post("/login", Validator.check(login), controller.login);
router.post("/register", Validator.check(register), controller.register);

router.put("/", auth.required, Validator.check(update), controller.update);
router.delete("/", auth.required, controller.remove);

router.get("/recovery-password", controller.showRecovery);
router.post("/recovery-password", controller.createRecovery);

router.get("/password-recovered", controller.showCompleteRecovery);
router.post("/password-recovered", controller.completeRecovery);

router.get("/", auth.required, controller.index);
router.get("/:id", auth.required, Validator.check(show), controller.show);

module.exports = router;
