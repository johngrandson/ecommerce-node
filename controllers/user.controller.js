const mongoose = require("mongoose");
const User = mongoose.model("User");
const sendRecoveryEmail = require("../helpers/email-recovery");

class Controller {
  async index(req, res, next) {
    try {
      const user = await User.findById(req.payload.id);

      if (!user) {
        return res.status(401).json({
          errors: "User not found",
        });
      }

      return res.json({
        user: user.sendAuthJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const user = await User.findById(req.payload.id);

      if (!user) {
        return res.status(401).json({
          errors: "User not found",
        });
      }

      return res.json({
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          store: user.store,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { name, email, password, store } = req.body;
      const user = new User({ name, email, store });

      await user.setPassword(password);
      await user.save();

      res.json({
        user: user.sendAuthJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await User.findById(req.payload.id);

      if (!user) {
        return res.status(401).json({
          errors: "User not found",
        });
      }

      if (typeof name !== "undefined") {
        user.name = name;
      }

      if (typeof email !== "undefined") {
        user.email = email;
      }

      if (typeof password !== "undefined") {
        user.password = user.setPassword(password);
      }

      await user.save();

      res.json({
        user: user.sendAuthJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const user = await User.findById(req.payload.id);

      if (!user) {
        return res.status(401).json({
          errors: "User not found",
        });
      }

      await user.remove();

      res.json({
        removed: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          errors: "User not found",
        });
      }

      if (!user.validatePassword(password)) {
        return res.status(401).json({
          errors: "Invalid password",
        });
      }

      res.json({
        user: user.sendAuthJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  async showRecovery(req, res, next) {
    try {
      return res.render("recovery", { error: null, success: null });
    } catch (error) {
      next(error);
    }
  }

  async createRecovery(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.render("recovery", {
          error: "Fill up with your email",
          success: null,
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.render("recovery", {
          error: "User not found",
          success: null,
        });
      }

      const recovery = user.createTokenPasswordRecovery();
      await user.save();

      sendRecoveryEmail({ user, recovery }, (error = null, success = null) => {
        return res.render("recovery", { error, success });
      });
    } catch (error) {
      next(error);
    }
  }

  async showCompleteRecovery(req, res, next) {
    try {
      if (!req.query.token) {
        return res.render("recovery", {
          error: "Token not found",
          success: null,
        });
      }

      const user = await User.findOne({ "recovery.token": req.query.token });

      if (!user) {
        return res.render("recovery", {
          error: "User with the current token don't exists",
          success: null,
        });
      }

      if (new Date(user.recovery.date) < new Date()) {
        return res.render("recovery", {
          error: "Token expired. Try again",
          success: null,
        });
      }

      return res.render("recovery/store", {
        error: null,
        success: null,
        token: req.query.token,
      });
    } catch (error) {
      next(error);
    }
  }

  async completeRecovery(req, res, next) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.render("recovery/store", {
          error: "Fill the input with your new password",
          success: null,
          token,
        });
      }

      const user = await User.findOne({ "recovery.token": token });

      if (!user) {
        return res.render("recovery", {
          error: "User with the current token don't exists",
          success: null,
        });
      }

      await user.finalizeTokenPasswordRecovery();
      await user.setPassword(password);
      await user.save();

      return res.render("recovery/store", {
        error: null,
        success: "Password updated with success. You can try to login again",
        token: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
