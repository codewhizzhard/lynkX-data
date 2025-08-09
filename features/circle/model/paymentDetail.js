import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    userAddress: {
        type: String,
        lowercase: true,
        required: true
    },
    productName: {
        type: String,
        default: null
    },
    orderId: {
        type: String,
        default: null
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    walletId: {
        type: String,
        required: true
    },
    senderAddress: {
        type: String,
        lowercase: true,
        default: null
    },
    transactionHash: { 
        type: String,
        default: null,
        /* index: true,
        unique: true //  */
    },
    receiverAddress: {
        type: String,
        lowercase: true,
        required: true,
    },
    status: {
        type: String,
        default: null
    },
    gasFee: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    token: {
        symbol: { type: String, default: "USDC"},    // e.g., "USDC"
        address: { type: String, default: null},   // token contract address
        decimals: { type: Number, default: 18 },     // decimals for amount conversion
        chain: { type: String, required: true } // or chainId if you prefer
        }
}, {timestamps: true})

// Make transactionHash unique only when it exists
/* PaymentSchema.index(
  { transactionHash: 1 },
  { unique: true, partialFilterExpression: { transactionHash: { $type: "string" } } }
);
 */
const Payments = mongoose.model("PaymentHistory", PaymentSchema)
export default Payments