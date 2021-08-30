const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const CustomerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    birthDate: { type: Date, required: true },
    cpf: { type: String, required: true },
    phones: {
      type: [
        {
          type: String,
        },
      ],
    },
    deleted: { type: Boolean, default: false },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
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

CustomerSchema.plugin(mongoosePaginate);

module.exports = model("Customer", CustomerSchema);
