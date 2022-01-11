const { Schema, model } = require('mongoose');

const AdminSchema = new Schema(
  {
    userId: { type: String, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

AdminSchema.options.toJSON = {
  transform(doc, ret) {
    delete ret.password;
    delete ret.__v;
  }
};

const Admin = model('admin', AdminSchema);

module.exports = { Admin };
