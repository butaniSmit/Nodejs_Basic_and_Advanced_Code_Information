const mongoose = require("mongoose");
const { Schema } = mongoose;

const rolesSchema = new mongoose.Schema({
    allpermissions:[{group:String,permissionsname:[{title:String,name:String}]}],
  role: {
    type: String,
    required: [true, "A role must have a name"],
    unique: true
  },
  permissions: [{ type: String }],
});

module.exports = mongoose.model("roles", rolesSchema);
