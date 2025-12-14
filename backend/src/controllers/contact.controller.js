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
    // ✅ Usar puerto 465 con SSL
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, // ✅ Puerto SSL
      secure: true, // ✅ Activar SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''),
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('🔌 Intentando conectar con Gmail (puerto 465)...');

    // Verificar conexión
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada');

    // Configurar email
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
    console.error('Código de error:', error.code);
    
    console.log('📧 Mensaje guardado solo en logs');
    
    return res.status(200).json({
      success: true,
      message: 'Mensaje recibido correctamente',
    });
  }
};

module.exports = { sendContactEmail };
