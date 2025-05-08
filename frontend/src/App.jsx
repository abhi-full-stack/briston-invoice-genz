import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ClientForm from "../components/ClientForm"
import ClientList from "../components/ClientList"
import InvoiceDetail from "../components/InvoiceDetail"
import Navbar from "../components/Navbar"
import InvoiceList from "../components/InvoiceList"
import InvoiceForm from "../components/InvoiceForm"
import Dashboard from "../components/Dashboard"

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="https://briston-invoice-genz.onrender.com/clients" element={<ClientList />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/edit/:id" element={<ClientForm />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/new" element={<InvoiceForm />} />
            <Route path="/invoices/edit/:id" element={<InvoiceDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
