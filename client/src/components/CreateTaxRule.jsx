import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiPencil, HiSearch } from "react-icons/hi"
import { FileText, Landmark, Loader, Loader2, TrashIcon } from "lucide-react"
import { FaPlus, FaTrash } from "react-icons/fa"
import toast from "react-hot-toast"
import {
  createTaxRule,
  deleteTaxRule,
  getAllTaxRules,
  updateTaxRule,
} from "@/services/Tax"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Spinner from "@/ui/Spinner"

export default function ManageTax() {
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ["tax-rule"],
    queryFn: getAllTaxRules,
  })

  const [activeTab, setActiveTab] = useState("view")
  const [selectedRule, setSelectedRule] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state for creating/editing rules
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    purpose: "",
    category: "",
    fixed: 0,
    percentage: 0,
    bracket: [],
    year: "",
    isActive: false,
    penaltyRate: 0,
    penaltyCap: 0,
    taxType: "",
  })

  // Add a new bracket
  const addBracket = (newBracket) => {
    setFormData((prev) => ({
      ...prev,
      bracket: [...prev.bracket, newBracket],
    }))
  }

  // Remove a bracket by index
  const removeBracket = (index) => {
    setFormData((prev) => ({
      ...prev,
      bracket: prev.bracket.filter((_, i) => i !== index),
    }))
  }

  const handleCreateRule = async () => {
    if (
      !formData.penaltyCap ||
      !formData.penaltyRate ||
      !formData.year ||
      !formData.taxType ||
      !formData.type
    ) {
      toast.error("Fill all the necessary fields")
      return
    }
    if (formData.penaltyRate < 0 || formData.penaltyRate > 25) {
      toast.error("Penalty rate must be between 0%- 25%")
      return
    }
    if (formData.penaltyCap <= 0) {
      toast.error("Set a correct penalty capacity amount")
      return
    }
    if (formData.type === "Fixed" && !formData.fixed) {
      toast.error("All fields are required. Make sure you put them")
      return
    }
    if (formData.type === "Progressive" && formData.bracket.length === 0) {
      toast.error("All fields are required. Make sure you put them 11")
      return
    }
    if (formData.type === "Percentage" && !formData.percentage) {
      toast.error("All fields are required. Make sure you put them 11")
      return
    }

    try {
      setIsLoading(true)
      const res = await createTaxRule(formData)

      if (res.success) {
        toast.success(res.message)
        queryClient.invalidateQueries(["tax-rule"])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

    setFormData({
      name: "",
      type: "",
      purpose: "",
      category: "",
      fixed: 0,
      percentage: 0,
      bracket: [],
      year: "",
    })
    setActiveTab("view")
  }

  const handleArchiveRule = (id) => {}

  useEffect(() => {
    document.title = "Manage and create tax"
  }, [])

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
          {["view", "create"].map((tab) => (
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
            rules={data || []}
            onEdit={(rule) => {
              setSelectedRule(rule)
              setFormData({
                name: rule.name,
                type: rule.type,
                status: rule.isActive,
                year: rule.year,
                purpose: rule.purpose,
                category: rule.category,
                fixed: rule.fixed || 0,
                percentage: rule.percentage || 0,
                bracket: rule.bracket.length > 0 ? rule.bracket : [],
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
            addBracket={addBracket}
            removeBracket={removeBracket}
            isLoading={isLoading}
          />
        )}

        {/* Edit Tax Rule Modal */}
        {selectedRule && (
          <EditTaxRuleModal
            rule={selectedRule}
            onClose={() => setSelectedRule(null)}
          />
        )}

        {/* Delete/Archive Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmation
            rule={selectedRule}
            ruleToDelete={ruleToDelete}
            ruleName={data.find((r) => r.id === ruleToDelete)?.name || ""}
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
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredRules = rules?.filter((rule) => {
    const matchesSearch = rule.name.toLowerCase().includes(filter.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || rule.isActive === (statusFilter === "active")
    const matchesType = typeFilter === "all" || rule.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getRateDisplay = (rule) => {
    switch (rule.type) {
      case "Fixed":
        return `$${rule.fixedAmount?.toFixed(2) || "0.00"}`
      case "Percentage":
        return `${rule.percentageRate?.toFixed(2) || "0.00"}%`
      case "Progressive":
        return `${rule.brackets?.length || 0} brackets (${
          rule.brackets?.[0]?.rate || "0"
        }% - ${rule.brackets?.[rule.brackets?.length - 1]?.rate || "0"}%)`
      default:
        return "N/A"
    }
  }

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
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <HiSearch size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className="w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
          >
            <option value="all">All Types</option>
            <option value="Fixed">Fixed</option>
            <option value="Percentage">Percentage</option>
            <option value="Progressive">Progressive</option>
          </select>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className="w-full md:w-auto">
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
          <div className="col-span-3 text-gray-800">Tax Name</div>
          <div className="col-span-2 text-gray-800">Category</div>
          <div className="col-span-2 text-gray-800">Calculation Type</div>
          <div className="col-span-2 text-gray-800">Rate/Amount</div>
          <div className="col-span-1 text-gray-800">Year</div>
          <div className="col-span-1 text-gray-800">Status</div>
          <div className="col-span-1 text-gray-800">Actions</div>
        </div>

        {filteredRules?.length > 0 ? (
          filteredRules?.map((rule, i) => (
            <motion.div
              key={rule._id || rule.id}
              className="grid grid-cols-12 p-4 border-b border-gray-200 hover:bg-blue-50 items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="col-span-3 font-medium">{rule.name}</div>
              <div className="col-span-2">{rule.category}</div>
              <div className="col-span-2">{rule.type}</div>
              <div className="col-span-2">{getRateDisplay(rule)}</div>
              <div className="col-span-1">
                {rule.year ? new Date(rule.year).getFullYear() : "N/A"}
              </div>
              <div className="col-span-1">
                <StatusBadge status={rule.isActive ? "active" : "archived"} />
              </div>
              <div className="col-span-1 flex gap-2">
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
                  onClick={() => onDelete(rule._id || rule.id)}
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
function CreateTaxRule({
  formData,
  setFormData,
  onSubmit,
  removeBracket,
  addBracket,
  isLoading,
}) {
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
              placeholder="Standard Income Rule 2017"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            />
          </div>
          <div className="mb-4">
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Landmark size={20} />{" "}
              <span className="font-semibold text-gray-800">Tax Category</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            >
              <option
                value=""
                disabled={true}
                className="text-[15px] cursor-pointer"
              >
                Select tax category
              </option>
              <option value="Personal" className="text-[15px] cursor-pointer">
                Personal
              </option>
              <option value="Property" className="text-[15px] cursor-pointer">
                Property
              </option>
              <option value="VAT" className="text-[15px] cursor-pointer">
                VAT
              </option>
              <option value="Business" className="text-[15px] cursor-pointer">
                Business
              </option>
            </select>
          </div>
          <div className="mb-4">
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Landmark size={20} />{" "}
              <span className="font-semibold text-gray-800">
                Calculation Method
              </span>
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full  px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            >
              <option
                value=""
                disabled={true}
                className="text-[15px] cursor-pointer"
              >
                Select calculation Method
              </option>
              <option value="Fixed" className="text-[15px] cursor-pointer">
                Fixed
              </option>
              <option value="Percentage" className="text-[15px] cursor-pointer">
                Percentage
              </option>
              <option
                value="Progressive"
                className="text-[15px] cursor-pointer"
              >
                Progressive
              </option>
            </select>
          </div>
          <div className="mb-4">
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Landmark size={20} />{" "}
              <span className="font-semibold text-gray-800">Tax Type</span>
            </label>
            <select
              value={formData.taxType}
              onChange={(e) =>
                setFormData({ ...formData, taxType: e.target.value })
              }
              className="w-full px-4 py-2 border cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            >
              <option
                value=""
                disabled={true}
                className="text-[15px] cursor-pointer"
              >
                Select tax type
              </option>
              <option value="direct" className="text-[15px] cursor-pointer">
                Direct
              </option>
              <option value="indirect" className="text-[15px] cursor-pointer">
                Indirect
              </option>
            </select>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {formData.type === "Fixed" && (
            <FixedTaxRuleForm
              value={formData.fixed}
              onChange={(e) =>
                setFormData({ ...formData, fixed: parseFloat(e.target.value) })
              }
            />
          )}
          {formData.type === "Percentage" && (
            <PercentageTaxRuleForm
              value={formData.percentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  percentage: parseFloat(e.target.value),
                })
              }
            />
          )}
          {formData.type === "Progressive" && (
            <ProgressiveTaxRuleForm
              brackets={formData.bracket}
              removeBracket={removeBracket}
              addBracket={addBracket}
            />
          )}
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📅 Year
              </label>
              <motion.input
                type="date"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
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
              placeholder="Define how and when this tax should be applied (optional)"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              whileFocus={{
                scale: 1.01,
                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
              }}
            />
          </div>
          <h2 className="font-semibold text-[16px] text-gray-700 py-4">
            Penalty Info
          </h2>
          <div className="mb-4">
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText size={20} />{" "}
              <span className="font-semibold text-gray-800">Penalty Rate</span>
            </label>
            <motion.input
              type="number"
              value={formData.penaltyRate}
              onChange={(e) =>
                setFormData({ ...formData, penaltyRate: e.target.value })
              }
              placeholder="rate for penalty"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
            />
          </div>
          <div className="mb-4">
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText size={20} />{" "}
              <span className="font-semibold text-gray-800">Max penalty</span>
            </label>
            <motion.input
              type="number"
              value={formData.penaltyCap}
              onChange={(e) =>
                setFormData({ ...formData, penaltyCap: e.target.value })
              }
              placeholder="maximum amount of tax "
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
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
          }
          ${
            step == 1
              ? formData.name &&
                formData.type &&
                formData.category &&
                formData.taxType
                ? ""
                : "cursor-not-allowed bg-gray-200"
              : ""
          }
         
          `}
          onClick={() => (step < 3 ? setStep(step + 1) : onSubmit())}
        >
          {step < 3 ? (
            "Continue"
          ) : isLoading ? (
            <span className="flex items-center gap-3">
              <Loader className="animate-spin"></Loader>
              <span>Creating tax rule...</span>
            </span>
          ) : (
            "Create Tax Rule"
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

function ProgressiveTaxRuleForm({ brackets = [], addBracket, removeBracket }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBracket, setNewBracket] = useState({
    minAmount: 0,
    maxAmount: 0,
    rate: 0,
  })

  const handleAddClick = () => {
    if (brackets.length == 0) {
      // For the first bracket, just show the form with empty values
      setNewBracket({
        minAmount: 0,
        maxAmount: 0,
        rate: 0,
      })
    } else {
      const lastBracket = brackets[brackets.length - 1]
      // Set minAmount to last maxAmount + 1 if last maxAmount exists and is a number
      const newMin =
        lastBracket.maxAmount && !isNaN(lastBracket.maxAmount)
          ? parseInt(lastBracket.maxAmount) + 1
          : ""

      setNewBracket({
        minAmount: newMin,
        maxAmount: 0,
        rate: 0,
      })
    }
    setShowAddForm(true)
  }

  const handleSaveNewBracket = () => {
    if (
      newBracket.minAmount !== "" &&
      newBracket.maxAmount !== "" &&
      newBracket.rate !== ""
    ) {
      addBracket(newBracket)
      setShowAddForm(false)
    } else {
      alert("Please fill in all fields before saving the bracket.")
    }
  }

  const handleCancelAdd = () => {
    setShowAddForm(false)
  }

  const handleNewBracketChange = (field, value) => {
    setNewBracket((prev) => ({
      ...prev,
      [field]: parseFloat(value),
    }))
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Progressive Brackets
      </label>

      {/* Display existing brackets */}
      <div className="space-y-2">
        {brackets && brackets.length > 0 ? (
          brackets.map((bracket, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 items-center">
              <div className="p-2 border border-gray-300 rounded-xl bg-gray-50">
                {bracket.minAmount}
              </div>
              <div className="p-2 border border-gray-300 rounded-xl bg-gray-50">
                {bracket.maxAmount}
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-full p-2 border border-gray-300 rounded-xl bg-gray-50">
                  {bracket.rate}%
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeBracket(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No brackets added yet.</p>
        )}
      </div>

      {/* Add new bracket form (shown when clicking Add button) */}
      {showAddForm && (
        <div className="space-y-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-3 gap-2 items-center">
            <input
              type="number"
              placeholder="Min Amount"
              value={newBracket.minAmount}
              disabled={true}
              onChange={(e) =>
                handleNewBracketChange("minAmount", e.target.value)
              }
              className="p-2 border border-gray-300 rounded-xl disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-blue-500 focus:ring-2"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={newBracket.maxAmount}
              onChange={(e) =>
                handleNewBracketChange("maxAmount", e.target.value)
              }
              className="p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Rate (%)"
                value={newBracket.rate}
                onChange={(e) => handleNewBracketChange("rate", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:ring-2"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={handleCancelAdd}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveNewBracket}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Add Bracket button */}
      <button
        type="button"
        onClick={handleAddClick}
        className="flex items-center gap-2 text-blue-600 font-medium hover:underline mt-2"
      >
        <FaPlus /> Add Bracket
      </button>
    </div>
  )
}

function PercentageTaxRuleForm({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Percentage Rate (%)
      </label>
      <input
        type="number"
        name="percentageRate"
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter rate e.g. 15"
        min={0}
        max={100}
      />
    </div>
  )
}

function FixedTaxRuleForm({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Fixed Amount
      </label>
      <input
        type="number"
        name="fixedAmount"
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter fixed tax amount"
      />
    </div>
  )
}

// Component for editing tax rules
function EditTaxRuleModal({ rule, onClose }) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    purpose: "",
    category: "",
    fixed: 0,
    percentage: 0,
    bracket: [],
    year: "",
    isActive: true,
  })
  const [showBrackets, setShowBrackets] = useState(false)

  const { mutate: saveTaxRule, isLoading: isSaving } = useMutation({
    mutationFn: (data) => updateTaxRule(rule?._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tax-rule"])
      toast.success("Tax Rule updated successfully")
      onClose()
    },
    onError: (error) => {
      console.log(error)
      toast.error(`Error saving tax rule: ${error.response.data.error}`)
    },
  })

  useEffect(() => {
    formData.type = rule.type
    formData.category = rule.category
    formData.year = rule.year

    if (rule.type === "Fixed") {
      formData.fixed = rule.fixedAmount
    }
    if (rule.type === "Percentage") {
      formData.percentage = rule.percentageRate
    }

    formData.isActive = rule.isActive

    if (rule.type === "Progressive") {
      setShowBrackets(true)
      formData.bracket = rule.brackets
    } else {
      setShowBrackets(false)
    }
  }, [rule.type, rule.isActive])

  const handleBracketChange = (index, field, value) => {
    const updatedBrackets = [...formData.bracket]
    updatedBrackets[index] = {
      ...updatedBrackets[index],
      [field]: field === "rate" ? parseFloat(value) || 0 : parseInt(value) || 0,
    }
    setFormData({ ...formData, bracket: updatedBrackets })
  }

  const addBracket = () => {
    const lastBracket = formData.bracket[formData.bracket.length - 1]
    const newMin = lastBracket?.maxAmount ? lastBracket.maxAmount + 1 : 0

    setFormData({
      ...formData,
      bracket: [
        ...formData.bracket,
        { minAmount: newMin, maxAmount: "", rate: "" },
      ],
    })
  }

  const removeBracket = (index) => {
    if (formData.bracket.length <= 1) return
    const updatedBrackets = formData.bracket.filter((_, i) => i !== index)
    setFormData({ ...formData, bracket: updatedBrackets })
  }

  const onSave = () => {
    if (!formData.name) {
      toast.error("Edit the name first")
      return
    }
    saveTaxRule(formData)
  }
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
            <motion.h3 className="text-2xl font-bold">
              {rule ? "Edit Tax Rule" : "Create Tax Rule"}
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
              <input
                type="text"
                value={formData.name}
                placeholder={rule.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Penalty Rate
              </label>
              <input
                type="text"
                value={rule.penaltyRate}
                disabled={true}
                className="w-full  disabled:bg-gray-200 disabled:cursor-not-allowed px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>

              <select
                value={rule.category}
                disabled={true}
                className="w-full px-4 py-2 border disabled:bg-gray-200 disabled:cursor-not-allowed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="personal">Personal</option>
                <option value="vat">VAT</option>
                <option value="business">Business</option>
                <option value="property">Property</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Type
              </label>
              <select
                value={rule.type}
                disabled={true}
                className="w-full px-4 py-2 border disabled:bg-gray-200 disabled:cursor-not-allowed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Fixed">Fixed Amount</option>
                <option value="Percentage">Percentage</option>
                <option value="Progressive">Progressive</option>
              </select>
            </div>

            {formData.type === "Fixed" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fixed Amount
                </label>
                <input
                  type="number"
                  placeholder={rule.fixed || ""}
                  value={formData.fixed || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fixed: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {formData.type === "Percentage" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percentage Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder={rule.percentageRate || ""}
                    value={formData.percentage || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        percentage: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">
                    %
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="date"
                value={formData.year || ""}
                placeholder={rule.year || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex items-center">
                <div
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer mr-2 ${
                    formData.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isActive: !formData.isActive,
                    })
                  }
                >
                  <motion.div
                    className="bg-white w-4 h-4 rounded-full shadow-md"
                    animate={{
                      x: formData.isActive ? 24 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                  />
                </div>
                <span>{formData.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>

          {showBrackets && (
            <div className="mb-6 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Progressive Tax Brackets
              </label>
              <div className="space-y-2">
                {formData.bracket.map((bracket, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-4">
                      <input
                        type="number"
                        placeholder="Min Amount"
                        value={bracket.minAmount}
                        onChange={(e) =>
                          handleBracketChange(
                            index,
                            "minAmount",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        placeholder="Max Amount"
                        value={bracket.maxAmount}
                        onChange={(e) =>
                          handleBracketChange(
                            index,
                            "maxAmount",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="col-span-3">
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Rate"
                          value={bracket.rate}
                          onChange={(e) =>
                            handleBracketChange(index, "rate", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-500">
                          %
                        </span>
                      </div>
                    </div>
                    <div className="col-span-1">
                      {index > 0 && (
                        <button
                          onClick={() => removeBracket(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addBracket}
                className="mt-2 text-blue-600 hover:underline flex items-center"
              >
                <span>+ Add Bracket</span>
              </button>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => {
                setFormData({
                  name: "",
                  type: "",
                  purpose: "",
                  category: "",
                  fixed: 0,
                  percentage: 0,
                  bracket: [],
                  year: "",
                  isActive: false,
                })
                onClose()
              }}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={onSave}
            >
              {isSaving ? (
                <span>
                  <Loader2 className="animate-spin" /> Saving ...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Component for delete/archive confirmation
function DeleteConfirmation({ ruleName, onCancel, rule, ruleToDelete }) {
  const queryClient = useQueryClient()

  const { mutate: deleteTax, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteTaxRule(ruleToDelete),
    onSuccess: () => {
      queryClient.invalidateQueries(["tax-rule"])
      toast.success("Tax Rule Deleted successfully")
      onCancel()
    },
    onError: (error) => {
      console.log(error)
      toast.error(`Error saving tax rule: ${error.response.data.error}`)
    },
  })
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
            onClick={deleteTax}
          >
            {isDeleting ? "deleting ..." : "Delete Rule"}
          </motion.button>
        </div>
      </motion.div>
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
