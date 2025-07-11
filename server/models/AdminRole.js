const mongoose = require("mongoose");

const adminRoleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["super_admin", "view_admin_1", "view_admin_2"],
      required: true,
    },
    permissions: [
      {
        type: String,
        enum: [
          "view_users",
          "edit_users",
          "delete_users",
          "view_transactions",
          "process_transactions",
          "view_reports",
          "manage_merchants",
          "system_settings",
          "create_admin",
        ],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminRole", adminRoleSchema);