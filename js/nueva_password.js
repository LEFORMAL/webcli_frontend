// Ruta para solicitar restablecimiento de contraseña
app.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;

    try {
        const connection = await connectMySQL();
        const sql = 'SELECT * FROM USUARIOS WHERE email = ?';
        const [rows] = await connection.execute(sql, [email]);

        if (rows.length === 0) {
            await connection.end();
            return res.status(404).send('Usuario no encontrado');
        }

        // Generar token de restablecimiento
        const token = crypto.randomBytes(20).toString('hex');
        const expiration = new Date(Date.now() + 15 * 60 * 1000); // Expira en 15 minutos

        console.log('Token generado:', token);
        console.log('Fecha de expiración:', expiration);

        // Guardar token en la base de datos
        await connection.execute(
            `UPDATE USUARIOS SET reset_token = ?, reset_token_expiration = ? WHERE email = ?`,
            [token, expiration, email]
        );

        // Enviar el enlace de restablecimiento por correo
        const resetLink = `https://leformal.github.io/webcli_frontend/nueva_password.html?token=${token}&email=${email}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Restablecimiento de Contraseña',
            text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('Enlace de restablecimiento enviado');
    } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        res.status(500).send('Error en el servidor');
    }
});