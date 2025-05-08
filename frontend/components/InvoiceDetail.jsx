import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const InvoiceDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`/api/invoices/${id}`)
        setInvoice(response.data)
        setFormData(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch invoice details")
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handlePOChange = (index, field, value) => {
    const newPOs = [...formData.pos]
    newPOs[index] = { ...newPOs[index], [field]: value }
    setFormData((prev) => ({
      ...prev,
      pos: newPOs,
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
    try {
      await axios.put(`/api/invoices/${id}`, formData)
      setIsEditing(false)
      const response = await axios.get(`/api/invoices/${id}`)
      setInvoice(response.data)
      setFormData(response.data)
    } catch (err) {
      setError("Failed to update invoice")
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(`/api/invoices/${id}`)
        navigate("/invoices")
      } catch (err) {
        setError("Failed to delete invoice")
      }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Invoice" : "Invoice Details"}
        </h1>
        <div className="space-x-4">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Invoice
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Invoice
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={formData.date.split("T")[0]}
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
                  value={formData.dueDate.split("T")[0]}
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
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
                      value={po.poDate.split("T")[0]}
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
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-start"
                >
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
        </form>
      ) : (
        <div className="space-y-6">
          {/* Invoice Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Invoice Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Invoice Number
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {invoice.invoiceNumber}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span
                  className={`mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "overdue"
                      ? "bg-red-100 text-red-800"
                      : invoice.status === "sent"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {invoice.status.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(invoice.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Client Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Client Name
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {invoice.client.clientName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">GSTIN</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {invoice.client.gstin}
                </p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Billing Address
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {invoice.client.billingAddress}
                </p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Shipping Address
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {invoice.client.shippingAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Purchase Orders */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Purchase Orders
            </h2>
            <div className="space-y-4">
              {invoice.pos.map((po, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      PO Number
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">{po.poNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      PO Date
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(po.poDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Rate
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{item.rate.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-right text-sm font-medium text-gray-500"
                    >
                      Subtotal
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{invoice.subtotal.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-right text-sm font-medium text-gray-500"
                    >
                      Tax ({invoice.taxRate}%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{invoice.taxAmount.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-right text-sm font-medium text-gray-900"
                    >
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{invoice.total.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
              <p className="text-sm text-gray-900">{invoice.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default InvoiceDetail
