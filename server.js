const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000; 

const db = mysql.createConnection({
    host: 'localhost',   
    user: 'root',        
    password: '', 
    database: 'monicakes' 
});

db.connect(err => {
    if (err) {
        console.error('❌ Error fatal al conectar a MySQL:', err.stack);
        return; 
    }
    console.log('✅ Base de Datos y Servidor listos en http://localhost:3000');
});

app.use(cors()); 
app.use(express.json()); 

app.post('/api/pedido', (req, res) => {
    
    const {
        cliente_nombre,
        whatsapp,
        total_pedido,
        personalizacion,
        lugar_entrega,
        horario_entrega,
        forma_pago
    } = req.body;

    // 🚨 CONSULTA SQL LIMPIA Y ESTRICTA: SIN ESPACIOS ANTES DE INSERT
    const sql = `INSERT INTO pedidos 
(cliente_nombre, whatsapp, total_pedido, personalizacion, lugar_entrega, horario_entrega, forma_pago)
VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [cliente_nombre, whatsapp, total_pedido, personalizacion, lugar_entrega, horario_entrega, forma_pago], (err, result) => {
        if (err) {
            console.error('❌ Error fatal al insertar el pedido (MySQL):', err);
            return res.status(500).json({ 
                error: 'Error al guardar el pedido en la DB. Verifique la consola del servidor.' 
            });
        }
        
        const pedidoId = result.insertId;
        res.json({ 
            mensaje: 'Pedido guardado y listo para WhatsApp.',
            pedido_id: pedidoId
        });
    });
});

// 👂 Iniciar el servidor de Express
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});