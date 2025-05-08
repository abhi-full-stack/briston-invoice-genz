import express from "express"
import {
  createClient,
  getAllClients,
  updateClient,
  getClientById,
  deleteClient,
} from "../controllers/clientsController.js"

const router = express.Router()

// Route to create clients
router.post("/create-client", createClient)

// Route to get all clients
router.get("/api/clients", getAllClients)

// Route to get a single client
router.get("/api/clients/:id", getClientById)

// Route to update client details
router.put("/edit-client/:id", updateClient)

// Route to delete a client
router.delete("/api/clients/:id", deleteClient)

export default router
