import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const ClientForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    username: "",
    clientName: "",
    billingAddress: "",
    shippingAddress: "",
    gstin: "",
    contactPerson: "",
    contactDetails: {
      email: "",
      phone: "",
    },
    pos: [{ poNumber: "", poDate: "" }],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEditing) {
      const fetchClient = async () => {
        try {
          const response = await axios.get(`/api/clients/${id}`)
          setFormData(response.data)
        } catch (err) {
          setError("Failed to fetch client details")
        }
      }
      fetchClient()
    }
  }, [id, isEditing])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing) {
        await axios.put(`/api/clients/${id}`, formData)
      } else {
        await axios.post("/api/clients", formData)
      }
      navigate("/clients")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save client")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? "Edit Client" : "Add New Client"}
      </h1>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="clientName"
                className="block text-sm font-medium text-gray-700"
              >
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="gstin"
                className="block text-sm font-medium text-gray-700"
              >
                GSTIN
              </label>
              <input
                type="text"
                id="gstin"
                name="gstin"
                value={formData.gstin}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contactPerson"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Person
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contactDetails.email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="contactDetails.email"
                name="contactDetails.email"
                value={formData.contactDetails.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contactDetails.phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                type="tel"
                id="contactDetails.phone"
                name="contactDetails.phone"
                value={formData.contactDetails.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Addresses</h2>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="billingAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Billing Address
              </label>
              <textarea
                id="billingAddress"
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="shippingAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Shipping Address
              </label>
              <textarea
                id="shippingAddress"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                rows={3}
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

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Client"
              : "Create Client"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClientForm
