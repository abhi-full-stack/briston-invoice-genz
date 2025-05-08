import mongoose from "mongoose"

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    pos: [
      {
        poNumber: {
          type: String,
          required: true,
          trim: true,
        },
        poDate: {
          type: Date,
          required: true,
        },
      },
    ],
    items: [
      {
        description: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        rate: {
          type: Number,
          required: true,
          min: 0,
        },
        amount: {
          type: Number,

          min: 0,
        },
      },
    ],
    subtotal: {
      type: Number,

      min: 0,
    },
    taxRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    taxAmount: {
      type: Number,

      min: 0,
    },
    total: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Calculate amounts before saving
invoiceSchema.pre("save", function (next) {
  // Calculate item amounts
  this.items.forEach((item) => {
    item.amount = item.quantity * item.rate
  })

  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0)

  // Calculate tax amount
  this.taxAmount = (this.subtotal * this.taxRate) / 100

  // Calculate total
  this.total = this.subtotal + this.taxAmount

  next()
})

export default mongoose.model("Invoice", invoiceSchema)
