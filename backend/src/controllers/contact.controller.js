const nodemailer = require('nodemailer');

const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  // Validación
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son obligatorios',
    });
  }

  // Guardar en logs siempre
  console.log('📧 Nuevo mensaje de contacto:');
  console.log(`Nombre: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Mensaje: ${message}`);

  // Verificar configuración de email
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email no configurado - Solo guardado en logs');
    return res.status(200).json({
      success: true,
      message: 'Mensaje recibido correctamente',
    });
  }

  try {
    // Configurar transporter de Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ✅ Usar servicio predefinido
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''), // Eliminar espacios
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verificar conexión antes de enviar
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada');

    // Configurar el email
    const mailOptions = {
      from: `"Thinkel Contact" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER,
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nuevo mensaje de contacto
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;">
              <strong style="color: #555;">Nombre:</strong> ${name}
            </p>
            <p style="margin: 10px 0;">
              <strong style="color: #555;">Email:</strong> 
              <a href="mailto:${email}">${email}</a>
            </p>
          </div>
          <div style="background: white; padding: 20px; border-left: 4px solid #007bff;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #555;">Mensaje:</strong></p>
            <p style="margin: 0; line-height: 1.6; color: #333;">${message}</p>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
            <p>Este mensaje fue enviado desde el formulario de contacto de Thinkel</p>
          </div>
        </div>
      `,
      replyTo: email,
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado exitosamente:', info.messageId);
    
    return res.status(200).json({
      success: true,
      message: 'Mensaje enviado exitosamente',
    });

  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    
    // Si el error es de autenticación
    if (error.code === 'EAUTH') {
      console.error('⚠️ Error de autenticación - Verifica EMAIL_USER y EMAIL_PASS');
    }
    
    // Si es timeout
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
      console.error('⚠️ Timeout de conexión - El puerto 587 puede estar bloqueado');
    }

    console.log('📧 Mensaje guardado solo en logs');
    
    // Devolver éxito aunque falle el email
    return res.status(200).json({
      success: true,
      message: 'Mensaje recibido correctamente',
    });
  }
};

module.exports = { sendContactEmail };
