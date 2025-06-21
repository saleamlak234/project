import mongoose from "mongoose";
import dotenv from "dotenv";
import MerchantAccount from "../models/MerchantAccount.js";

dotenv.config();

const seedMerchants = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/cbe-birr"
    );

    // Clear existing merchants
    await MerchantAccount.deleteMany({});

    // Create default merchant accounts
    const merchants = [
      {
        bankName: "Commercial Bank of Ethiopia (CBE)",
        accountNumber: "1000634860006",
        accountHolder: "CBE Birr Merchant",
        branch: "Addis Ababa Main Branch",
        description: "Primary merchant account for CBE Birr deposits",
      },
      {
        bankName: "Commercial Bank of Ethiopia (CBE)",
        accountNumber: "1000634860007",
        accountHolder: "CBE Birr Secondary",
        branch: "Bole Branch",
        description: "Secondary merchant account for high volume transactions",
      },
    ];

    await MerchantAccount.insertMany(merchants);
    console.log("✅ Merchant accounts seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding merchants:", error);
    process.exit(1);
  }
};

seedMerchants();
