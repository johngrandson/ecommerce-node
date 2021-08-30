const { model } = require("mongoose");
const Store = model("Store");

class Controller {
  async index(req, res, next) {
    try {
      const stores = await Store.find({}).select(
        "_id name cnpj email phones address"
      );

      res.send({ stores });
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const store = await Store.findById(req.params.id).select(
        "_id name cnpj email phones address"
      );

      if (!store) {
        return res.status(401).json({
          errors: "Store not found",
        });
      }

      res.send({ store });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { name, cnpj, email, phones, address } = req.body;

      const store = new Store({
        name,
        cnpj,
        email,
        phones,
        address,
      });

      await store.save();

      res.send({ store });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { name, cnpj, email, phones, address } = req.body;

      const store = await Store.findById(req.query.store);

      if (!store) {
        return res.status(401).json({
          errors: "Store not found",
        });
      }

      if (name) store.name = name;
      if (cnpj) store.cnpj = cnpj;
      if (email) store.email = email;
      if (phones) store.phones = phones;
      if (address) store.address = address;

      await store.save();

      res.send({ store });
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
