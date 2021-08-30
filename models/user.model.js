const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");

const ONE_DAY = 24 * 60 * 60 * 1000;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Required field"],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Required field"],
      index: true,
      match: [/\S+@\S+\.\S+/, "Invalid email"],
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Required field"],
    },
    role: {
      type: Array,
      default: ["customer"],
    },
    hash: String,
    salt: String,
    recovery: {
      type: {
        token: String,
        date: Date,
      },
      default: {},
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "User already exists" });

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");

  return hash === this.hash;
};

UserSchema.methods.generateToken = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 15);

  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      exp: parseFloat(exp.getTime() / 1000, 10),
    },
    secret
  );
};

UserSchema.methods.sendAuthJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    store: this.store,
    role: this.role,
    token: this.generateToken(),
  };
};

UserSchema.methods.createTokenPasswordRecovery = function () {
  this.recovery = {};
  this.recovery.token = crypto.randomBytes(16).toString("hex");
  this.recovery.date = new Date(new Date().getTime() + ONE_DAY);
  return this.recovery;
};

UserSchema.methods.finalizeTokenPasswordRecovery = function () {
  this.recovery = { token: null, date: null };
  return this.recovery;
};

module.exports = model("User", UserSchema);
