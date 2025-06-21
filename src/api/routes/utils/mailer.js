const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Request = require("../../models/requests");
const Subscriptions = require("../../models/subscriptions");
const nodemailer = require("nodemailer");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TEAMEMAIL,
    pass: process.env.EMAILACESSCODE,
  },
});

router.post("/sendemail", upload.array("files"), async (req, res) => {
  const { id, email, subject, note, role } = req.body;
  const files = req.files;
  const userData = JSON.parse(req.body.userData);

  if (!email || !subject || !note || !id || !files || files.length === 0) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const attachments = files.map((file, index) => ({
      filename: file.originalname || `file-${index}`,
      content: file.buffer,
      contentType: file.mimetype,
    }));

    const baseUrl = process.env.BASE_SERVER_URL || "http://localhost:5000";
    const linkAccept = `${baseUrl}/acceptchangerequest/${id}/${role}`;
    const linkReject = `${baseUrl}/rejectchangerequest/${id}`;

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 36px 40px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      color: #333333;
      line-height: 1.6;
      font-size: 16px;
    ">
      <p style="margin-bottom: 24px;">Шановна компанія <strong>SportLife</strong>,</p>

      <p style="margin-bottom: 24px;">
        Прошу розглянути мою заявку на зміну ролі в веб-додатку для спортивних тренувань.
      </p>

      <p style="margin-bottom: 16px;">
        <strong>Поточна роль:</strong> ${userData?.role}<br/>
        <strong>Бажана роль:</strong> ${role}
      </p>

      <div style="
        margin: 24px 0;
        padding: 20px 24px;
        background-color: #f1f5ff;
        border-left: 5px solid #2c7be5;
        border-radius: 6px;
        color: #1a1a1a;
        font-size: 16px;
        line-height: 1.5;
        white-space: pre-line;
      ">
        <strong>Причина зміни ролі:</strong><br/>
        ${note}
      </div>

      <p style="margin: 24px 0 16px 0;">
        <strong>Дані користувача:</strong><br/>
        - ПІБ: ${userData?.name} ${userData?.last_name}<br/>
        - Нікнейм: ${userData?.username}<br/>
        - Пошта: <a href="mailto:${
          userData?.email
        }" style="color:#2c7be5; text-decoration:none;">${
      userData?.email
    }</a><br/>
        - Контактний телефон: <a href="tel:${
          userData?.phone
        }" style="color:#2c7be5; text-decoration:none;">${userData?.phone}</a>
      </p>

      <p style="margin-bottom: 36px;">
        Дякую за розгляд моєї заявки.
      </p>

      <p style="margin-bottom: 0;">
        З повагою,<br/>
        <strong>${userData?.name} ${userData?.last_name}</strong><br/>
        <a href="mailto:${
          userData?.email
        }" style="color:#2c7be5; text-decoration:none;">${
      userData?.email
    }</a><br/>
        <a href="tel:${
          userData?.phone
        }" style="color:#2c7be5; text-decoration:none;">${userData?.phone}</a>
      </p>

       <div style="display: flex; gap: 10px; margin-top: 36px;">
        <a href="${linkAccept}" style="
          flex: 1;
          text-align: center;
          background-color: #28a745;
          color: white !important;
          text-decoration: none;
          padding: 14px 15px;
          font-weight: 600;
          font-size: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.5);
          display: inline-block;
          transition: background-color 0.3s ease;
          padding-inline: 15px;
          margin-right: 10px;
        " onmouseover="this.style.backgroundColor='#218838'" onmouseout="this.style.backgroundColor='#28a745'">
          ✅ Підтвердити
        </a>
        ${" "}
        <a href="${linkReject}" style="
          flex: 1;
          text-align: center;
          background-color: #dc3545;
          color: white !important;
          text-decoration: none;
          padding: 14px 15px;
          font-weight: 600;
          font-size: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.5);
          display: inline-block;
          transition: background-color 0.3s ease;
          padding-inline: 15px;
        " onmouseover="this.style.backgroundColor='#c82333'" onmouseout="this.style.backgroundColor='#dc3545'">
          ❌ Відхилити
        </a>
      </div>

      <p style="font-size: 14px; color: #999999; margin-top: 48px; text-align: center;">
        Якщо ви не надсилали цей запит, просто проігноруйте цей лист.
      </p>
    </div>
  </div>
`;

    await transporter.sendMail({
      from: `"SportLife" ${email}`,
      to: "sportlife.corporate.mail@gmail.com",
      subject: `Підтвердження`,
      text: note,
      html: htmlContent,
      replyTo: email,
      attachments,
    });

    // const findRequest = await Request.findOne({ userId: id });
    // if (!findRequest) {
    const user = await User.findById(id);
    const newRequest = new Request({
      email: email,
      userId: user._id,
      requestReason: role,
      status: "pending",
    });

    if (role === "trainer") user.trainerRequestId = newRequest._id; // Save request id to user
    await user.save(); // Save user with updated request id
    await newRequest.save();
    // }

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error sending mail" });
  }
});

router.post("/send-newsletter", async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ message: "Subject і message обов'язкові" });
  }

  try {
    const subscribers = await Subscriptions.find();
    const emails = subscribers.map((sub) => sub.email);

    for (let email of emails) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: `
      <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <h2 style="color: #1890ff;">Вітаємо!</h2>
          <p style="font-size: 16px; color: #333;">
            ${message}
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 14px; color: #888;">
            Ви отримали цього листа, тому що підписані на розсилку.
          </p>
          <p style="font-size: 12px; color: #bbb;">
            Sportlife &copy; ${new Date().getFullYear()}
          </p>
        </div>
      </div>
    `,
      });
    }

    res.status(200).json({ message: `Розіслано ${emails.length} листів` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при відправці" });
  }
});

module.exports = router;