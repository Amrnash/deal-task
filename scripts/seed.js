import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { User } from "../models/user.js";
import { Ad } from "../models/ad.js";
import { Property } from "../models/property.js";
import dotenv from "dotenv";

dotenv.config();
async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Ad.deleteMany({});
    await Property.deleteMany({});

    // Create fake users
    const users = [];
    for (let i = 0; i < 20; i++) {
      const user = new User({
        name: faker.name.fullName(),
        phone: faker.phone.number("##########"),
        password: "123456",
        role: faker.helpers.arrayElement(["CLIENT", "AGENT"]),
        status: faker.helpers.arrayElement(["ACTIVE", "DELETED"]),
      });
      users.push(user);
      await user.save();
    }
    console.log("Users created");

    // Create fake ads
    const ads = [];
    for (let i = 0; i < 500; i++) {
      const ad = new Ad({
        propertyType: faker.helpers.arrayElement([
          "VILLA",
          "HOUSE",
          "LAND",
          "APARTMENT",
        ]),
        area: faker.location.state(),
        price: faker.number.int({ min: 0, max: 1000 }),
        city: faker.location.city(),
        district: faker.location.county(),
        description: faker.lorem.sentences(2),
        refreshedAt: faker.date.recent(),
        createdBy: faker.helpers.arrayElement(users)._id,
      });
      ads.push(ad);
      await ad.save();
    }
    console.log("Ads created");

    // Create fake requests
    const requests = [];
    for (let i = 0; i < 500; i++) {
      const request = new Property({
        propertyType: faker.helpers.arrayElement([
          "VILLA",
          "HOUSE",
          "LAND",
          "APARTMENT",
        ]),
        area: faker.location.state(),
        price: faker.number.int({ min: 0, max: 1000 }),
        city: faker.location.city(),
        district: faker.location.county(),
        description: faker.lorem.sentences(2),
        refreshedAt: faker.date.recent(),
        createdBy: faker.helpers.arrayElement(users)._id,
      });
      requests.push(request);
      await request.save();
    }
    console.log("Requests created");

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
}

seedDB();
