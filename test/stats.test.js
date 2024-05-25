import { app } from "../app.js";
import supertest from "supertest";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/user.js";

before(() => {
  dotenv.config();
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log("Successfully connected to MongoDB!");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
});

describe("GET /stats/:userId", () => {
  it("should return 200 status on success", async () => {
    const token = jwt.sign(
      { userId: "test", role: "ADMIN" },
      process.env.JWT_SECRET
    );
    const user = await User.findOne();

    const { statusCode } = await supertest(app)
      .get(`/stats/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(statusCode).to.equal(200);
  });

  it("should return adsCount and totalAdsAmount or requestsCount and totalRequestsAmount", async () => {
    const token = jwt.sign(
      { userId: "test", role: "ADMIN" },
      process.env.JWT_SECRET
    );
    const user = await User.findOne();

    const { body } = await supertest(app)
      .get(`/stats/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    const result = body.data;
    expect(result).to.be.an("object");
    expect(result).to.satisfy((res) => {
      return (
        ("adsCount" in res && "totalAdsAmount" in res) ||
        ("requestsCount" in res && "totalRequestsAmount" in res)
      );
    });
  });

  it("should return user info", async () => {
    const token = jwt.sign(
      { userId: "test", role: "ADMIN" },
      process.env.JWT_SECRET
    );
    const user = await User.findOne();

    const { body } = await supertest(app)
      .get(`/stats/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    const result = body.data;
    expect(result).to.be.an("object");
    expect(result).to.have.property("name");
    expect(result).to.have.property("role");
    expect(result).to.have.property("status");
    expect(result).to.have.property("phone");
  });
});
