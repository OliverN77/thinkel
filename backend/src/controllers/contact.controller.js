const nodemailer = require('nodemailer');

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

    // ✅ Verificar si las credenciales de email están configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Credenciales de email no configuradas');
      
      // Guardar en logs pero devolver éxito
      console.log('📧 Mensaje de contacto recibido:');
      console.log(`Nombre: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Mensaje: ${message}`);
      
      return res.status(200).json({
        success: true,
        message: 'Mensaje recibido correctamente',
      });
    }

    // Configurar transporter solo si hay credenciales
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 5000, // ✅ Timeout de 5 segundos
      greetingTimeout: 5000,
    });

    // Configurar el correo
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
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

    // Intentar enviar correo con timeout
    try {
      await transporter.sendMail(mailOptions);
      
      console.log('✅ Email enviado correctamente');
      return res.status(200).json({
        success: true,
        message: 'Mensaje enviado exitosamente',
      });
    } catch (emailError) {
      // ✅ Si falla el envío, guardar en logs pero devolver éxito
      console.error('Error al enviar email:', emailError.message);
      console.log('📧 Mensaje guardado en logs:');
      console.log(`Nombre: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Mensaje: ${message}`);
      
      // ✅ IMPORTANTE: Devolver 200 aunque falle el email
      return res.status(200).json({
        success: true,
        message: 'Mensaje recibido correctamente',
      });
    }
  } catch (error) {
    // ✅ Error general del controlador
    console.error('Error en sendContactEmail:', error);
    
    // Devolver error 500 solo si es un error crítico
    return res.status(500).json({
      success: false,
      message: 'Error al procesar el mensaje',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { sendContactEmail };
