const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(data, recipient = process.env.EMAIL_RECIPIENT) {
  // Configura o transporte de e-mail (Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });

    // Formata os dados como HTML
    let htmlContent = `
    <h2 style="font-family: Arial, sans-serif; color: #333;">Promoções do Dia - Mercado Livre</h2>
    <ul style="font-family: Arial, sans-serif; color: #333;">
    `;
    data.forEach(item => {
    htmlContent += `
        <li style="margin-bottom: 10px;">
        <strong>${item.titulo}</strong> (${item.marca})<br>
        Preço: R$ ${item.precoAtual} (Antes: R$ ${item.precoAntigo}, ${item.desconto})<br>
        <a href="${item.link}" style="color: #007bff; text-decoration: none;">Ver oferta</a>
        </li>
    `;
    });
    htmlContent += '</ul>';

    // Configura o e-mail
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'Promoções do Dia - Mercado Livre',
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso para', recipient);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error.message);
    }
}

module.exports = { sendEmail };