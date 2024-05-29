const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 25,
  },
  role: {
    type: String,
    enum: ["Student", "Instructor"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//instance methods
userSchema.methods.isStudent = function () {
  return this.role === "Student";
};
userSchema.methods.isInstructor = function () {
  return this.role === "Instructor";
};
userSchema.methods.comparePassword = async function (password, callBackFn) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return callBackFn(null, result);
  } catch (e) {
    return callBackFn(e, result);
  }
};

//mongoose middleware
//if there is a new user or someone is changing the password ,and we will hash the password
userSchema.pre("save", async function (next) {
  //"this" represent the document inside the mongoDB
  if (this.isNew || this.isModified("password")) {
    const hsahValue = await bcrypt.hash(this.password, 10);
    this.password = hsahValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
