const mongoose = require('mongoose');
const snowflake = require('@theinternetfolks/snowflake');

const roleSchema = new mongoose.Schema({
  id: String,
  name: { type: String, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
