// This module hashes the entity passwords if they are currently in plain text

// importing modules
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

async function hashPassword(entityModels) {
  // TODO Delete Later
  // {
  // const customer = await Customer.find().select('+password');
  // console.log(customer[0].password);

  // const testSchema = new mongoose.Schema({
  //   name: String,
  // }, { collection: 'test' });  // Explicitly define the collection name

  // const testModel = mongoose.model("test", testSchema);
  // const userData = await testModel.find();

  // console.log(userData);
  // }

  // Fetching all entity
  for (let model of entityModels) {
    const documents = await model.find({}).select("+password");

    // Now looping through the entity's. The entity's variable contains an array of entity documents fetched from MongoDB. Even though each individual element in the array is a Mongoose document, the array itself is a standard JavaScript array, which we can loop through using any of the common looping methods "for of" in this case
    for (let each of documents) {
      if (each.password.length < 30) {
        // usually bcrypt hashed pass are more than 30
        const hashedPassword = await bcrypt.hash(each.password, 10); // 10 for more complex encryption
        each.password = hashedPassword;
        await each.save();
        console.log(`Updated password for: ${each.email}`);
      }
    }
  }

  console.log("Hashing Completed...");
}

module.exports = hashPassword;