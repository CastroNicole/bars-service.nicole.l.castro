const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  address: String,
  status: String,
  date_created: Date,
  last_edited: String
}, { _id: false });

const AccountSchema = new mongoose.Schema({
  account_name: String,
  date_created: Date,
  is_active: String,
  last_edited: String,
  customer: CustomerSchema
}, { _id: false });

const BillingSchema = new mongoose.Schema({
  billing_cycle: Number,
  billing_month: String,
  amount: Number,
  start_date: Date,
  end_date: Date,
  last_edited: String,
  account: AccountSchema
});

module.exports = mongoose.model('Billing', BillingSchema);
