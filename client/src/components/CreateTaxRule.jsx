import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiPencil, HiSearch } from "react-icons/hi"
import { FileText, Landmark, TrashIcon } from "lucide-react"

// Main Tax Management Component
export default function ManageTax() {
  const [activeTab, setActiveTab] = useState("view")
  const [taxRules, setTaxRules] = useState([
    {
      id: 1,
      name: "VAT",
      type: "Percentage",
      rate: "15%",
      status: "active",
      modifiedDate: "2023-05-15",
      history: [],
    },
    {
      id: 2,
      name: "Income Tax",
      type: "Progressive",
      rate: "10-35%",
      status: "active",
      modifiedDate: "2023-04-10",
      history: [],
    },
    {
      id: 3,
      name: "Property Tax",
      type: "Fixed",
      rate: "$1,200",
      status: "archived",
      modifiedDate: "2022-11-30",
      history: [],
    },
  ])
  const [scheduledChanges, setScheduledChanges] = useState([
    {
      id: 1,
      taxName: "VAT",
      currentRate: "15%",
      newRate: "17%",
      effectiveDate: "2024-01-01",
    },
    {
      id: 2,
      taxName: "Luxury Tax",
      currentRate: "10%",
      newRate: "12%",
      effectiveDate: "2023-10-01",
    },
  ])
  const [selectedRule, setSelectedRule] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState(null)

  // Form state for creating/editing rules
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    rate: "",
    entities: [],
    startDate: "",
    endDate: "",
    purpose: "",
    status: "active",
  })

  const handleCreateRule = () => {
    const newRule = {
      id: taxRules.length + 1,
      name: formData.name,
      type: formData.type,
      rate: formData.rate,
      status: formData.status,
      modifiedDate: new Date().toISOString().split("T")[0],
      history: [],
    }
    setTaxRules([...taxRules, newRule])
    setFormData({
      name: "",
      type: "",
      rate: "",
      entities: [],
      startDate: "",
      endDate: "",
      purpose: "",
      status: "active",
    })
    setActiveTab("view")
  }

  const handleUpdateRule = () => {
    const updatedRules = taxRules.map((rule) => {
      if (rule.id === selectedRule.id) {
        return {
          ...rule,
          name: formData.name,
          type: formData.type,
          rate: formData.rate,
          status: formData.status,
          modifiedDate: new Date().toISOString().split("T")[0],
          history: [
            ...rule.history,
            {
              version: `v${rule.history.length + 1}`,
              date: new Date().toLocaleDateString(),
              user: "Admin User",
            },
          ],
        }
      }
      return rule
    })
    setTaxRules(updatedRules)
    setSelectedRule(null)
  }

  const handleDeleteRule = (id) => {
    setTaxRules(taxRules.filter((rule) => rule.id !== id))
    setShowDeleteConfirm(false)
  }

  const handleArchiveRule = (id) => {
    const updatedRules = taxRules.map((rule) => {
      if (rule.id === id) {
        return { ...rule, status: "archived" }
      }
      return rule
    })
    setTaxRules(updatedRules)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto pt-5"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Tax Management System
        </h1>
        <p className="text-gray-600 mb-8">
          Admin dashboard for managing tax rules and schedules
        </p>

        {/* Tab Navigation */}
        <motion.div className="flex border-b border-gray-200 mb-8">
          {["view", "create", "schedule"].map((tab) => (
            <motion.button
              key={tab}
              className={`px-6 py-3 font-medium relative cursor-pointer ${
                activeTab === tab
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Rules
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                  layoutId="underline"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* View Tax Rules */}
        {activeTab === "view" && (
          <TaxRulesTable
            rules={taxRules}
            onEdit={(rule) => {
              setSelectedRule(rule)
              setFormData({
                name: rule.name,
                type: rule.type,
                rate: rule.rate,
                status: rule.status,
                entities: [],
                startDate: "",
                endDate: "",
                purpose: "",
              })
            }}
            onDelete={(id) => {
              setRuleToDelete(id)
              setShowDeleteConfirm(true)
            }}
          />
        )}

        {/* Create New Tax Rule */}
        {activeTab === "create" && (
          <CreateTaxRule
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateRule}
          />
        )}

        {/* Schedule Tax Updates */}
        {activeTab === "schedule" && (
          <TaxScheduleTimeline
            scheduledChanges={scheduledChanges}
            onAddNew={() => console.log("Add new schedule")}
          />
        )}

        {/* Edit Tax Rule Modal */}
        {selectedRule && (
          <EditTaxRuleModal
            rule={selectedRule}
            formData={formData}
            setFormData={setFormData}
            onClose={() => setSelectedRule(null)}
            onSave={handleUpdateRule}
          />
        )}

        {/* Delete/Archive Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmation
            ruleName={taxRules.find((r) => r.id === ruleToDelete)?.name || ""}
            onConfirm={() => handleArchiveRule(ruleToDelete)}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </motion.div>
    </div>
  )
}

// Component for viewing tax rules in a table
function TaxRulesTable({ rules, onEdit, onDelete }) {
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(filter.toLowerCase()) &&
      (statusFilter === "all" || rule.status === statusFilter)
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <motion.div className="flex-1">
          <div className="relative">
            <motion.input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by tax name..."
              className="w-[90%] px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <HiSearch size={20} />
            </div>
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.01 }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </motion.div>
      </div>

      <motion.div
        className="bg-white rounded-xl shadow overflow-hidden"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="grid grid-cols-12 bg-gray-200 p-4 font-medium border-b border-gray-200">
          <div className="col-span-4 text-gray-800">Tax Name</div>
          <div className="col-span-2 text-gray-800">Type</div>
          <div className="col-span-2 text-gray-800">Rate/Amount</div>
          <div className="col-span-2 text-gray-800">Status</div>
          <div className="col-span-2 text-gray-800">Actions</div>
        </div>

        {filteredRules.length > 0 ? (
          filteredRules.map((rule, i) => (
            <motion.div
              key={rule.id}
              className="grid grid-cols-12 p-4 border-b border-gray-200 hover:bg-blue-50 items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="col-span-4 font-medium">{rule.name}</div>
              <div className="col-span-2">{rule.type}</div>
              <div className="col-span-2">{rule.rate}</div>
              <div className="col-span-2">
                <StatusBadge status={rule.status} />
              </div>
              <div className="col-span-2 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={() => onEdit(rule)}
                >
                  <HiPencil size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => onDelete(rule.id)}
                >
                  <TrashIcon size={20} />
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="p-8 text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No tax rules found matching your criteria
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

// Component for creating new tax rules
function CreateTaxRule({ formData, setFormData, onSubmit }) {
  const [step, setStep] = useState(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex mb-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`flex-1 h-2 mx-1 rounded-full ${
              i <= step ? "bg-blue-500" : "bg-gray-200"
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}
      </div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 mb-6"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
      >
        Create New Tax Rule
      </motion.h2>

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4">
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText size={20} />{" "}
              <span className="font-semibold text-gray-800">Tax Name</span>
            </label>
            <motion.input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., VAT, Income Tax"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            />
          </div>
          <div className="mb-4">
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Landmark size={20} />{" "}
              <span className="font-semibold text-gray-800">Tax Type</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            >
              <option value="">Select tax type</option>
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
              <option value="Progressive">Progressive</option>
            </select>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🧮 Applicable Rate/Formula
            </label>
            <motion.input
              type="text"
              value={formData.rate}
              onChange={(e) =>
                setFormData({ ...formData, rate: e.target.value })
              }
              placeholder="e.g., 15% or complex formula"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🏛️ Applicable Entities
            </label>
            <select
              multiple
              value={formData.entities}
              onChange={(e) => {
                const options = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                )
                setFormData({ ...formData, entities: options })
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            >
              <option value="Individuals">Individuals</option>
              <option value="Businesses">Businesses</option>
              <option value="Non-Profits">Non-Profits</option>
              <option value="Government">Government</option>
            </select>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📅 Effective Date
              </label>
              <motion.input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📅 Expiry Date
              </label>
              <motion.input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                }}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              💡 Purpose
            </label>
            <motion.textarea
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              placeholder="Define how and when this tax should be applied"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              whileFocus={{
                scale: 1.01,
                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
              }}
            />
          </div>
        </motion.div>
      )}

      <motion.div className="flex justify-between mt-8" layout>
        {step > 1 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-2 bg-gray-200 border border-gray-300 rounded-lg cursor-pointer"
            onClick={() => setStep(step - 1)}
          >
            Back
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-10 py-2 rounded-lg ml-auto cursor-pointer ${
            step < 3 ? "bg-blue-500 text-white" : "bg-green-500 text-white"
          }`}
          onClick={() => (step < 3 ? setStep(step + 1) : onSubmit())}
        >
          {step < 3 ? "Continue" : "Create Tax Rule"}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// Component for editing tax rules
function EditTaxRuleModal({ rule, formData, setFormData, onClose, onSave }) {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <motion.h3
              className="text-2xl font-bold"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
            >
              Edit Tax Rule
            </motion.h3>
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              ✕
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Name
              </label>
              <motion.input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Fixed">Fixed</option>
                <option value="Percentage">Percentage</option>
                <option value="Progressive">Progressive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate/Formula
              </label>
              <motion.input
                type="text"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({ ...formData, rate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex items-center">
                <motion.div
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer mr-2 ${
                    formData.status === "active"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      status:
                        formData.status === "active" ? "inactive" : "active",
                    })
                  }
                  animate={{
                    backgroundColor:
                      formData.status === "active" ? "#10B981" : "#D1D5DB",
                  }}
                >
                  <motion.div
                    className="bg-white w-4 h-4 rounded-full shadow-md"
                    animate={{
                      x: formData.status === "active" ? 24 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                  />
                </motion.div>
                <span>
                  {formData.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <motion.div className="mb-6" layout>
            <motion.button
              className="flex items-center text-blue-500 mb-2"
              onClick={() => setShowHistory(!showHistory)}
              whileHover={{ x: 5 }}
            >
              {showHistory ? "▼" : "▶"} Version History
            </motion.button>

            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gray-50 rounded-lg p-4 overflow-hidden"
              >
                {rule.history.length > 0 ? (
                  rule.history.map((version, i) => (
                    <div
                      key={i}
                      className="mb-2 last:mb-0 pb-2 border-b border-gray-200"
                    >
                      <div className="font-medium">
                        {version.version} - {version.date}
                      </div>
                      <div className="text-sm text-gray-600">
                        Changed by: {version.user}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No version history yet</div>
                )}
              </motion.div>
            )}
          </motion.div>

          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gray-200 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
              onClick={onSave}
            >
              Save Changes
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Component for delete/archive confirmation
function DeleteConfirmation({ ruleName, onConfirm, onCancel }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <motion.div
          className="flex justify-center mb-4"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ repeat: 2, duration: 0.3 }}
        >
          <div className="text-4xl">⚠️</div>
        </motion.div>

        <h3 className="text-xl font-bold text-center mb-4">Confirm Archive</h3>
        <p className="text-center mb-6">
          Are you sure you want to archive{" "}
          <span className="font-medium">{ruleName}</span>? This action can be
          undone later.
        </p>

        <div className="grid grid-cols-1 gap-3 mb-4">
          <motion.textarea
            placeholder="Reason for archiving (optional)"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            whileFocus={{
              scale: 1.01,
              boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
            }}
          />
        </div>

        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gray-200 rounded-lg"
            onClick={onCancel}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-red-500 text-white rounded-lg"
            onClick={onConfirm}
          >
            Archive Rule
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Component for scheduled tax updates timeline
function TaxScheduleTimeline({ scheduledChanges, onAddNew }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Scheduled Tax Updates</h2>

      <div className="relative">
        {/* Timeline line */}
        <motion.div
          className="absolute left-4 top-0 bottom-0 w-1 bg-blue-100"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5 }}
        />

        <div className="space-y-8">
          {scheduledChanges.map((change, i) => (
            <motion.div
              key={i}
              className="flex"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="relative z-10">
                <motion.div
                  className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
                  whileHover={{ scale: 1.2 }}
                >
                  {i + 1}
                </motion.div>
              </div>

              <motion.div
                className="flex-1 ml-4 p-4 bg-gray-50 rounded-lg shadow-sm"
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{change.taxName}</h3>
                    <p className="text-gray-600">
                      Current: {change.currentRate} → New: {change.newRate}
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {change.effectiveDate}
                  </div>
                </div>

                <div className="mt-2 flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm px-3 py-1 bg-gray-200 rounded"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg flex items-center mx-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddNew}
      >
        <span className="mr-2">+</span> Schedule New Update
      </motion.button>
    </motion.div>
  )
}

// Status badge component
function StatusBadge({ status }) {
  const variants = {
    active: {
      backgroundColor: "#DCFCE7",
      color: "#166534",
      scale: 1,
    },
    archived: {
      backgroundColor: "#FEE2E2",
      color: "#991B1B",
      scale: 1,
    },
    inactive: {
      backgroundColor: "#FEF9C3",
      color: "#854D0E",
      scale: 1,
    },
  }

  return (
    <motion.span
      className="inline-block px-5 py-1 rounded-full text-[14px] font-semibold"
      animate={status}
      variants={variants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </motion.span>
  )
}
