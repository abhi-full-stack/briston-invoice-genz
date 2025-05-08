import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const InvoiceForm = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    client: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    pos: [{ poNumber: "", poDate: "" }],
    items: [{ description: "", quantity: 1, rate: 0 }],
    taxRate: 18,
    notes: "",
    status: "draft",
  })

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("/api/clients")
        setClients(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch clients")
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  const handleClientChange = (e) => {
    const clientId = e.target.value
    const client = clients.find((c) => c._id === clientId)
    setSelectedClient(client)
    setFormData((prev) => ({
      ...prev,
      client: clientId,
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePOChange = (index, field, value) => {
    const newPOs = [...formData.pos]
    newPOs[index] = { ...newPOs[index], [field]: value }
    setFormData((prev) => ({
      ...prev,
      pos: newPOs,
    }))
  }

  const addPO = () => {
    setFormData((prev) => ({
      ...prev,
      pos: [...prev.pos, { poNumber: "", poDate: "" }],
    }))
  }

  const removePO = (index) => {
    setFormData((prev) => ({
      ...prev,
      pos: prev.pos.filter((_, i) => i !== index),
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0 }],
    }))
  }

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("/api/invoices", formData)
      navigate("/invoices")
    } catch (err) {
      setError("Failed to create invoice")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Invoice
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Selection */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Client Information
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="client"
                className="block text-sm font-medium text-gray-700"
              >
                Select Client
              </label>
              <select
                id="client"
                name="client"
                value={formData.client}
                onChange={handleClientChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.clientName} ({client.username})
                  </option>
                ))}
              </select>
            </div>

            {selectedClient && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Client Details
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedClient.clientName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedClient.gstin}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Contact Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedClient.contactPerson}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedClient.contactDetails.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedClient.contactDetails.phone}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Addresses
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Billing Address
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedClient.billingAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Shipping Address
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedClient.shippingAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Invoice Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="invoiceNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Invoice Number
              </label>
              <input
                type="text"
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Invoice Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="taxRate"
                className="block text-sm font-medium text-gray-700"
              >
                Tax Rate (%)
              </label>
              <input
                type="number"
                id="taxRate"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Purchase Orders */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Purchase Orders
            </h2>
            <button
              type="button"
              onClick={addPO}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add PO
            </button>
          </div>
          <div className="space-y-4">
            {formData.pos.map((po, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    PO Number
                  </label>
                  <input
                    type="text"
                    value={po.poNumber}
                    onChange={(e) =>
                      handlePOChange(index, "poNumber", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    PO Date
                  </label>
                  <input
                    type="date"
                    value={po.poDate}
                    onChange={(e) =>
                      handlePOChange(index, "poDate", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePO(index)}
                    className="mt-6 text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Item
            </button>
          </div>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        parseInt(e.target.value)
                      )
                    }
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "rate",
                        parseFloat(e.target.value)
                      )
                    }
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    ₹{(item.quantity * item.rate).toLocaleString()}
                  </p>
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-6 text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Additional Information
          </h2>
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  )
}

export default InvoiceForm
