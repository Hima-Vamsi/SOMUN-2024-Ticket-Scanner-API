require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;

mongoose.connect(mongoConnectionString, {
  dbName: "SOMUN",
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  school: String,
  isDelegation: Boolean,
  isHeadDelegate: Boolean,
  representingSchool: Boolean,
  schoolOrOrganization: String,
  headDelegateName: String,
  participantType: String,
  ipType: String,
  registrationType: String,
  delegationSize: String,
  firstChoice: { committee: String, country: String },
  secondChoice: { committee: String, country: String },
  thirdChoice: { committee: String, country: String },
  munExperience: String,
  previousExperiences: [String],
  additionalExperiences: String,
  ipLinks: [String],
  showAdditionalExperiences: Boolean,
  dietaryRestrictions: String,
  paymentVerified: Boolean,
  generatedPaymentId: String,
  paymentScreenshot: String,
  upiId: String,
  day1: Boolean,
  day2: Boolean,
  day3: Boolean,
  transactionId: String,
});

const User = mongoose.model("verified_registrations", UserSchema);

app.get("/user/:transactionId", async (req, res) => {
  try {
    const user = await User.findOne({
      transactionId: req.params.transactionId,
    });
    if (user) return res.json(user);
    res.status(303).send("User not found");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.put("/user/:transactionId", async (req, res) => {
  const { day } = req.body;

  try {
    const user = await User.findOne({
      transactionId: req.params.transactionId,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user[day]) {
      return res.status(200).json({ alreadyPresent: true });
    }

    user[day] = true;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
