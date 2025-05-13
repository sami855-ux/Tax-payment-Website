import { useState } from "react"
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiFileText,
  FiEdit2,
  FiArrowLeft,
} from "react-icons/fi"

const UserProfilePage = ({ data }) => {
  const [user] = useState(data)
  const [activeTab, setActiveTab] = useState("basic")

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <FiArrowLeft className="mr-2" /> Back to Users
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.fullName}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-400 border-4 border-white flex items-center justify-center">
                    <FiUser className="text-white text-4xl" />
                  </div>
                )}
                {user.role === "official" && (
                  <span className="absolute bottom-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                    Official
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.fullName}</h1>
                <p className="flex items-center mt-1">
                  <FiMail className="mr-2" /> {user.email}
                </p>
                <p className="flex items-center mt-1">
                  <FiPhone className="mr-2" />
                  +251 {user.phone}
                </p>
                <p className="flex items-center mt-1">
                  <FiFileText className="mr-2" /> {user.taxId}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("basic")}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "basic"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Basic Information
              </button>
              <button
                onClick={() => setActiveTab("address")}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "address"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Address Details
              </button>
              <button
                onClick={() => setActiveTab("tax")}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "tax"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tax Information
              </button>
              {user.role === "taxpayer" && (
                <button
                  onClick={() => setActiveTab("official")}
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === "official"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Assigned Official
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Personal Details
                  </h3>
                  <div className="space-y-3">
                    <p>
                      <span className="text-gray-500">Full Name:</span>{" "}
                      {user.fullName}
                    </p>
                    <p>
                      <span className="text-gray-500">Gender:</span>{" "}
                      {user.gender.charAt(0).toUpperCase() +
                        user.gender.slice(1)}
                    </p>
                    <p>
                      <span className="text-gray-500">Phone:</span> {user.phone}
                    </p>
                    <p>
                      <span className="text-gray-500">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="text-gray-500">Tax ID:</span>{" "}
                      {user.taxId}
                    </p>
                    <p>
                      <span className="text-gray-500">Role:</span>{" "}
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Tax Categories
                  </h3>
                  {user.taxCategories?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.taxCategories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No tax categories assigned</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">
                  Address Information
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="text-gray-500">Residential Address:</span>{" "}
                    {user.residentialAddress || "Not provided"}
                  </p>
                  <p>
                    <span className="text-gray-500">Kebele:</span> {user.kebele}
                  </p>
                  <p>
                    <span className="text-gray-500">Wereda:</span> {user.wereda}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "tax" && (
              <div className="space-y-6">
                {user.taxCategories?.includes("personal") && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Personal Income Tax
                    </h3>
                    {user.taxDetails?.personal ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p>
                          <span className="text-gray-500">
                            Employment Type:
                          </span>{" "}
                          {user.taxDetails.personal.employmentType ||
                            "Not specified"}
                        </p>
                        <p>
                          <span className="text-gray-500">Monthly Income:</span>{" "}
                          {user.taxDetails.personal.monthlyIncome
                            ? `ETB ${user.taxDetails.personal.monthlyIncome.toLocaleString()}`
                            : "Not specified"}
                        </p>
                        <p>
                          <span className="text-gray-500">TIN Number:</span>{" "}
                          {user.taxDetails.personal.tinNumber ||
                            "Not specified"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No personal tax details available
                      </p>
                    )}
                  </div>
                )}

                {user.taxCategories?.includes("business") && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Business Tax
                    </h3>
                    {user.taxDetails?.business ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p>
                          <span className="text-gray-500">Business Type:</span>{" "}
                          {user.taxDetails.business.businessType ||
                            "Not specified"}
                        </p>
                        <p>
                          <span className="text-gray-500">Business Name:</span>{" "}
                          {user.taxDetails.business.businessName ||
                            "Not specified"}
                        </p>
                        <p>
                          <span className="text-gray-500">License Number:</span>{" "}
                          {user.taxDetails.business.businessLicenseNumber ||
                            "Not specified"}
                        </p>
                        <p>
                          <span className="text-gray-500">TIN Number:</span>{" "}
                          {user.taxDetails.business.tinNumber ||
                            "Not specified"}
                        </p>
                        <p>
                          <span className="text-gray-500">Annual Revenue:</span>{" "}
                          {user.taxDetails.business.annualRevenueEstimate
                            ? `ETB ${user.taxDetails.business.annualRevenueEstimate.toLocaleString()}`
                            : "Not specified"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No business tax details available
                      </p>
                    )}
                  </div>
                )}

                {/* Similar sections for VAT, Property, and Other tax categories */}
              </div>
            )}

            {activeTab === "official" && user.role === "taxpayer" && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">
                  Assigned Tax Official
                </h3>
                {user.assignedOfficial ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiUser className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="font-medium">{user.officialName}</p>
                      <p className="text-sm text-gray-500">
                        Assigned on:{new Date(user.assignedDate).toDateString()}
                      </p>
                      <p className="text-sm">
                        Notices sent: {user.noticesSent || 0}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">
                      No tax official assigned
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Assign Official
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
