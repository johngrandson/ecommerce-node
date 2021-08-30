const { model } = require("mongoose");

const Customer = model("Customer");
const User = model("User");

class Controller {
  async index(req, res, next) {
    try {
      const { offset = 0, limit = 30, store } = req.query;
      const customers = await Customer.paginate(
        { store },
        { offset, limit, populate: "user" }
      );

      res.send({ customers });
    } catch (error) {
      next(error);
    }
  }

  async searchOrders(req, res, next) {
    try {
      res.status(400).send({ error: "In development" });
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const { offset = 0, limit = 30, store } = req.query;
      const search = new RegExp(req.params.search, "i");
      const customers = await Customer.paginate(
        { store, name: { $regex: search } },
        { offset, limit, populate: { path: "user", select: "-salt -hash" } }
      );

      res.send({ customers });
    } catch (error) {
      next(error);
    }
  }

  async showAdmin(req, res, next) {
    try {
      const customer = await Customer.findOne({
        _id: req.params.id,
        store: req.query.store,
      }).populate({ path: "user", select: "-salt -hash" });

      res.send({ customer });
    } catch (error) {
      next(error);
    }
  }

  async showCustomerOrders(req, res, next) {
    try {
      const customer = await Customer.findOne({
        _id: req.params.id,
        store: req.query.store,
      }).populate({ path: "user", select: "-salt -hash" });

      res.send({ customer });
    } catch (error) {
      next(error);
    }
  }

  async updateAdmin(req, res, next) {
    try {
      const { name, cpf, email, phones, address, birthDate } = req.body;

      const customer = await Customer.findById(req.params.id).populate("user");

      if (!customer) {
        return res.status(401).json({
          errors: "Store not found",
        });
      }

      if (name) {
        customer.User.name = name;
        customer.name = name;
      }

      if (cpf) customer.cpf = cpf;
      if (email) customer.user.email = email;
      if (phones) customer.phones = phones;
      if (address) customer.address = address;
      if (birthDate) customer.birthDate = birthDate;

      await customer.save();

      res.send({ customer });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const store = await Store.findById(req.query.store);

      if (!store) {
        return res.status(401).json({
          errors: "Store not found",
        });
      }

      await store.remove();

      res.send({ removed: true });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
