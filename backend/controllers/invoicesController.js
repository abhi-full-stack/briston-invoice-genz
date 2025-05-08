import Invoice from "../models/Invoice.js"
import Client from "../models/Client.js"

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({})
      .sort({ createdAt: -1 })
      .populate("client", "clientName gstin")
    res.status(200).json(invoices)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Helper function to update client POs
const updateClientPOs = async (clientId, pos) => {
  try {
    const client = await Client.findById(clientId)
    if (!client) {
      throw new Error("Client not found")
    }

    // Get existing POs
    const existingPOs = client.pos || []

    // Add new POs that don't already exist
    pos.forEach((newPO) => {
      const poExists = existingPOs.some(
        (existingPO) => existingPO.poNumber === newPO.poNumber
      )
      if (!poExists) {
        existingPOs.push(newPO)
      }
    })

    // Update client with new POs
    await Client.findByIdAndUpdate(clientId, { pos: existingPOs })
  } catch (error) {
    console.error("Error updating client POs:", error)
    throw error
  }
}

// @desc    Create an invoice
// @route   POST /api/invoices
// @access  Public
export const createInvoice = async (req, res) => {
  try {
    // Create the invoice
    const invoice = await Invoice.create(req.body)

    // Update client's PO array
    if (req.body.pos && req.body.pos.length > 0) {
      await updateClientPOs(req.body.client, req.body.pos)
    }

    res.status(201).json(invoice)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Public
export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "client",
      "clientName gstin billingAddress shippingAddress"
    )
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" })
    }
    res.status(200).json(invoice)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Public
export const updateInvoice = async (req, res) => {
  try {
    // Get the old invoice to compare POs
    const oldInvoice = await Invoice.findById(req.params.id)
    if (!oldInvoice) {
      return res.status(404).json({ message: "Invoice not found" })
    }

    // Update the invoice
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    // Update client's PO array if POs have changed
    if (req.body.pos && req.body.pos.length > 0) {
      await updateClientPOs(req.body.client, req.body.pos)
    }

    res.status(200).json(invoice)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Public
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id)
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" })
    }
    res.status(200).json({ message: "Invoice deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
