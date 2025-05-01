import nodemailer from "nodemailer"

const sendEmail = async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Set up email content
    const mailOptions = {
      from: email, // Sender's email
      to: "samitale86@gmail.com",
      subject: subject,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
    }

    // Send the email
    const info = await transporter.sendMail(mailOptions)

    console.log("Email sent: ", info.response)

    return res.status(200).json({
      success: true,
      message: "Your concern has been sent successfully.",
    })
  } catch (error) {
    console.error("Error sending email: ", error)
    return res.status(500).json({
      success: false,
      message: "There was an error sending your concern. Please try again.",
    })
  }
}

export default sendEmail
