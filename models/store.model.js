const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const StoreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cnpj: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    phones: {
      type: [
        {
          type: String,
        },
      ],
    },
    address: {
      type: {
        place: { type: String, required: true },
        number: { type: String, required: true },
        complement: { type: String },
        neighborhood: { type: String, required: true },
        city: { type: String, required: true },
        zip: { type: String, required: true },
      },
      required: true,
    },
  },
  { timestamps: true }
);

StoreSchema.plugin(uniqueValidator, { message: "Store already being used" });

module.exports = model("Store", StoreSchema);
