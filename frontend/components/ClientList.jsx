import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"


const ClientList = () => {
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("https://briston-invoice-genz.onrender.com/api/clients")
        setClients(response.data)
        setFilteredClients(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch clients")
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  useEffect(() => {
    const searchTermLower = searchTerm.toLowerCase()
    const filtered = clients.filter((client) => {
      return (
        client.clientName?.toLowerCase().includes(searchTermLower) ||
        client.username?.toLowerCase().includes(searchTermLower) ||
        client.contactPerson?.toLowerCase().includes(searchTermLower) ||
        client.contactDetails?.email?.toLowerCase().includes(searchTermLower) ||
        client.contactDetails?.phone?.toLowerCase().includes(searchTermLower) ||
        client.gstin?.toLowerCase().includes(searchTermLower) ||
        client.pos?.some(
          (po) =>
            po.poNumber?.toLowerCase().includes(searchTermLower) ||
            po.poDate?.toLowerCase().includes(searchTermLower)
        )
      )
    })
    setFilteredClients(filtered)
  }, [searchTerm, clients])

  const handleDeleteClick = (client) => {
    setClientToDelete(client)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return

    setDeleteLoading(true)
    try {
      await axios.delete(`/api/clients/${clientToDelete._id}`)
      setClients((prevClients) =>
        prevClients.filter((client) => client._id !== clientToDelete._id)
      )
      setDeleteModalOpen(false)
      setClientToDelete(null)
    } catch (err) {
      setError("Failed to delete client")
    } finally {
      setDeleteLoading(false)
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Client List</h1>
        <Link
          to="/clients/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Client
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Client Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact Person
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  GSTIN
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Purchase Orders
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No clients found matching your search"
                      : "No clients found. Add your first client!"}
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {client.clientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {client.contactPerson}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {client.contactDetails.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.contactDetails.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.gstin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.pos && client.pos.length > 0 ? (
                        <div className="space-y-1">
                          {client.pos.map((po, index) => (
                            <div key={index} className="text-sm">
                              <span className="text-gray-900">
                                {po.poNumber}
                              </span>
                              <span className="text-gray-500 ml-2">
                                {new Date(po.poDate).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <Link
                          to={`/clients/edit/${client._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(client)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Client
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete {clientToDelete?.clientName}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setClientToDelete(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientList
