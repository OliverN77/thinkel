const nodemailer = require('nodemailer');

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Validación
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios',
      });
    }

    // Configurar el correo
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Tu correo donde recibirás los mensajes
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
      replyTo: email,
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Mensaje enviado exitosamente',
    });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    next(error);
  }
};

module.exports = { sendContactEmail };
