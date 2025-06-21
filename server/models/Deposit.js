const mongoose = require('mongoose');
const depositSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1000
  },
  package: {
    type: String,
    required: true,
    enum: ['7th Stock Package', '6th Stock Package', '5th Stock Package', '4th Stock Package','3rd Stock package','2nd Stock package','1st Stock package']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['chapa_cbe', 'chapa_telebirr']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending'
  },
  receiptUrl: {
    type: String,
    default: null
  },
  chapaReference: {
    type: String,
    default: null
  },
  chapaTransactionId: {
    type: String,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  processedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Calculate monthly return based on package
depositSchema.methods.getMonthlyReturn = function() {
  const returnRates = {
    '7th Stock Package': 192000,
    '6th Stock Package': 96000,
    '5th Stock Package': 48000,
    '4th Stock Package': 24000,
    '3rd Stock Package': 12000,
    '2nd Stock Package': 6000,
    '1st Stock Package': 3000
  };
  return returnRates[this.package] || 0;
};

module.exports = mongoose.model('Deposit', depositSchema);