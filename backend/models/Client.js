import mongoose from "mongoose"

const clientSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    billingAddress: {
      type: String,
      required: true,
      trim: true,
    },
    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },
    gstin: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    contactDetails: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    pos: [
      {
        poNumber: {
          type: String,
          trim: true,
        },
        poDate: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Client", clientSchema)
