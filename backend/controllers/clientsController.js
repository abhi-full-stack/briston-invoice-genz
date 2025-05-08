import Client from "../models/Client.js"

// create a client
export const createClient = async (req, res) => {
  try {
    const {
      username,
      clientName,
      billingAddress,
      shippingAddress,
      gstin,
      contactPerson,
      contactDetails,
    } = req.body

    // Basic validation
    if (!username || !clientName || !billingAddress) {
      return res.status(400).json({ message: "Required fields are missing" })
    }

    const newClient = new Client({
      username,
      clientName,
      billingAddress,
      shippingAddress,
      gstin,
      contactPerson,
      contactDetails,
    })

    await newClient.save()

    res.status(201).json({
      message: "Client created successfully",
      client: newClient,
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating client",
      error: error.message,
    })
  }
}

// get all  clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find()
    res.status(200).json(clients)
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients", error })
  }
}

// get a single client by ID
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
    if (!client) {
      return res.status(404).json({ message: "Client not found" })
    }
    res.json(client)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// update client details
export const updateClient = async (req, res) => {
  try {
    const clientId = req.params.id
    const updateData = req.body

    const updatedClient = await Client.findByIdAndUpdate(clientId, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" })
    }

    res.status(200).json({
      message: "Client updated successfully",
      client: updatedClient,
    })
  } catch (error) {
    res.status(500).json({
      message: "Error updating client",
      error: error.message,
    })
  }
}

// delete a client
export const deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id
    const deletedClient = await Client.findByIdAndDelete(clientId)

    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" })
    }

    res.status(200).json({
      message: "Client deleted successfully",
      client: deletedClient,
    })
  } catch (error) {
    res.status(500).json({
      message: "Error deleting client",
      error: error.message,
    })
  }
}
