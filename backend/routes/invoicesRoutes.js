import express from "express"
import {
  getInvoices,
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoicesController.js"

const router = express.Router()

// GET all invoices and POST new invoice
router.route("/api/invoices").get(getInvoices).post(createInvoice)

// GET, PUT, and DELETE single invoice
router
  .route("/api/invoices/:id")
  .get(getInvoice)
  .put(updateInvoice)
  .delete(deleteInvoice)

export default router
