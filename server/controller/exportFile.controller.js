import PDFDocument from "pdfkit"
import fs from "fs"
import User from "../models/userModel.js"

const exportUserToPDF = async (req, res) => {
  const { userId } = req.params

  try {
    // Find the user by ID from the database
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Create a new PDF document
    const doc = new PDFDocument()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=user-data.pdf")

    // Pipe the PDF to the response
    doc.pipe(res)

    doc.fontSize(18).text("User Data Export", { align: "center" })
    doc.moveDown()

    doc.fontSize(12).text(`Full Name: ${user.fullName}`)
    doc.text(`Email: ${user.email}`)
    doc.text(`Phone Number: ${user.phoneNumber}`)
    doc.text(`Tax ID: ${user.taxId}`)
    doc.text(`Gender: ${user.gender}`)
    doc.text(`Residential Address: ${user.residentialAddress}`)
    doc.text(`Kebele: ${user.kebele}`)
    doc.text(`Wereda: ${user.wereda}`)
    doc.text(`Role: ${user.role}`)
    doc.text(`Date Created: ${user.createdAt}`)

    doc.moveDown()

    // Add any additional data to the PDF here if needed (e.g., profile photo, etc.)

    // Finalize the PDF and end the stream
    doc.end()
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: "Something went wrong while generating the PDF" })
  }
}

export { exportUserToPDF }
