
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'galeria_arte'
});

// Conectar a MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');
});

// ==================== RUTAS DE USUARIOS ====================

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length > 0) {
      res.json({ 
        success: true, 
        usuario: {
          id: results[0].id,
          nombre: results[0].nombre,
          email: results[0].email,
          rol: results[0].rol
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
});

//ARTISTAS

// Obtener todos los artistas
app.get('/api/artistas', (req, res) => {
  const query = 'SELECT * FROM artistas ORDER BY nombre';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener un artista por ID
app.get('/api/artistas/:id', (req, res) => {
  const query = 'SELECT * FROM artistas WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Artista no encontrado' });
    }
    res.json(results[0]);
  });
});

// Crear nuevo artista
app.post('/api/artistas', (req, res) => {
  const { nombre, apellido, nacionalidad, fecha_nacimiento, biografia, imagen, email, telefono } = req.body;
  
  const query = `INSERT INTO artistas (nombre, apellido, nacionalidad, fecha_nacimiento, biografia, imagen, email, telefono) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [nombre, apellido, nacionalidad, fecha_nacimiento, biografia, imagen, email, telefono], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, id: result.insertId, message: 'Artista creado exitosamente' });
  });
});

// Actualizar artista
app.put('/api/artistas/:id', (req, res) => {
  const { nombre, apellido, nacionalidad, fecha_nacimiento, biografia, imagen, email, telefono } = req.body;
  
  const query = `UPDATE artistas SET nombre = ?, apellido = ?, nacionalidad = ?, fecha_nacimiento = ?, 
                 biografia = ?, imagen = ?, email = ?, telefono = ? WHERE id = ?`;
  
  db.query(query, [nombre, apellido, nacionalidad, fecha_nacimiento, biografia, imagen, email, telefono, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Artista actualizado exitosamente' });
  });
});

// Eliminar artista
app.delete('/api/artistas/:id', (req, res) => {
  const query = 'DELETE FROM artistas WHERE id = ?';
  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Artista eliminado exitosamente' });
  });
});

// OBRAS

// Obtener todas las obras 
app.get('/api/obras', (req, res) => {
  const query = `
    SELECT o.*, CONCAT(a.nombre, ' ', a.apellido) as nombre_artista
    FROM obras o
    LEFT JOIN artistas a ON o.artista_id = a.id
    ORDER BY o.fecha_ingreso DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener una obra por ID
app.get('/api/obras/:id', (req, res) => {
  const query = `
    SELECT o.*, CONCAT(a.nombre, ' ', a.apellido) as nombre_artista, a.nacionalidad
    FROM obras o
    LEFT JOIN artistas a ON o.artista_id = a.id
    WHERE o.id = ?
  `;
  
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }
    res.json(results[0]);
  });
});

// Crear nueva obra
app.post('/api/obras', (req, res) => {
  const { titulo, artista_id, descripcion, tecnica, dimensiones, anio, precio, estado, imagen } = req.body;
  
  const query = `INSERT INTO obras (titulo, artista_id, descripcion, tecnica, dimensiones, anio, precio, estado, imagen) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [titulo, artista_id, descripcion, tecnica, dimensiones, anio, precio, estado, imagen], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, id: result.insertId, message: 'Obra creada exitosamente' });
  });
});

// Actualizar obra
app.put('/api/obras/:id', (req, res) => {
  const { titulo, artista_id, descripcion, tecnica, dimensiones, anio, precio, estado, imagen } = req.body;
  
  const query = `UPDATE obras SET titulo = ?, artista_id = ?, descripcion = ?, tecnica = ?, 
                 dimensiones = ?, anio = ?, precio = ?, estado = ?, imagen = ? WHERE id = ?`;
  
  db.query(query, [titulo, artista_id, descripcion, tecnica, dimensiones, anio, precio, estado, imagen, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Obra actualizada exitosamente' });
  });
});

// Eliminar obra
app.delete('/api/obras/:id', (req, res) => {
  const query = 'DELETE FROM obras WHERE id = ?';
  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Obra eliminada exitosamente' });
  });
});

// EXPOSICIONES

// Obtener todas las exposiciones
app.get('/api/exposiciones', (req, res) => {
  const query = 'SELECT * FROM exposiciones ORDER BY fecha_inicio DESC';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener una exposición con sus obras
app.get('/api/exposiciones/:id', (req, res) => {
  const query = `
    SELECT e.*, 
           GROUP_CONCAT(o.titulo SEPARATOR ', ') as obras
    FROM exposiciones e
    LEFT JOIN obras_exposiciones oe ON e.id = oe.exposicion_id
    LEFT JOIN obras o ON oe.obra_id = o.id
    WHERE e.id = ?
    GROUP BY e.id
  `;
  
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Exposición no encontrada' });
    }
    res.json(results[0]);
  });
});

// Crear nueva exposición
app.post('/api/exposiciones', (req, res) => {
  const { titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, curador, imagen, estado } = req.body;
  
  const query = `INSERT INTO exposiciones (titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, curador, imagen, estado) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, curador, imagen, estado], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, id: result.insertId, message: 'Exposición creada exitosamente' });
  });
});

// CLIENTES 

// Obtener todos los clientes
app.get('/api/clientes', (req, res) => {
  const query = 'SELECT * FROM clientes ORDER BY nombre';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener un cliente por ID
app.get('/api/clientes/:id', (req, res) => {
  const query = 'SELECT * FROM clientes WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(results[0]);
  });
});

// Crear nuevo cliente
app.post('/api/clientes', (req, res) => {
  const { nombre, apellido, email, telefono, direccion, ciudad, pais } = req.body;
  
  const query = `INSERT INTO clientes (nombre, apellido, email, telefono, direccion, ciudad, pais) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [nombre, apellido, email, telefono, direccion, ciudad, pais], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, id: result.insertId, message: 'Cliente creado exitosamente' });
  });
});

// 🆕 Actualizar cliente
app.put('/api/clientes/:id', (req, res) => {
  const { nombre, apellido, email, telefono, direccion, ciudad, pais } = req.body;
  
  const query = `UPDATE clientes SET nombre = ?, apellido = ?, email = ?, telefono = ?, 
                 direccion = ?, ciudad = ?, pais = ? WHERE id = ?`;
  
  db.query(query, [nombre, apellido, email, telefono, direccion, ciudad, pais, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Cliente actualizado exitosamente' });
  });
});

// 🆕 Eliminar cliente
app.delete('/api/clientes/:id', (req, res) => {
  // Primero verificar si el cliente tiene ventas
  const checkQuery = 'SELECT COUNT(*) as ventas FROM ventas WHERE cliente_id = ?';
  
  db.query(checkQuery, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (results[0].ventas > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el cliente porque tiene ventas asociadas',
        message: 'Este cliente tiene ventas registradas. Elimina primero sus ventas.'
      });
    }
    
    // Si no tiene ventas, eliminar
    const deleteQuery = 'DELETE FROM clientes WHERE id = ?';
    db.query(deleteQuery, [req.params.id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, message: 'Cliente eliminado exitosamente' });
    });
  });
});

// VENTAS 

// Obtener todas las ventas
app.get('/api/ventas', (req, res) => {
  const query = `
    SELECT v.*, o.titulo as obra_titulo, 
           CONCAT(c.nombre, ' ', c.apellido) as cliente_nombre
    FROM ventas v
    JOIN obras o ON v.obra_id = o.id
    JOIN clientes c ON v.cliente_id = c.id
    ORDER BY v.fecha_venta DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener una venta por ID
app.get('/api/ventas/:id', (req, res) => {
  const query = `
    SELECT v.*, o.titulo as obra_titulo, 
           CONCAT(c.nombre, ' ', c.apellido) as cliente_nombre
    FROM ventas v
    JOIN obras o ON v.obra_id = o.id
    JOIN clientes c ON v.cliente_id = c.id
    WHERE v.id = ?
  `;
  
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(results[0]);
  });
});

// Crear nueva venta
app.post('/api/ventas', (req, res) => {
  const { obra_id, cliente_id, precio_venta, fecha_venta, metodo_pago, notas } = req.body;
  
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Insertar venta
    const queryVenta = `INSERT INTO ventas (obra_id, cliente_id, precio_venta, fecha_venta, metodo_pago, notas) 
                        VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.query(queryVenta, [obra_id, cliente_id, precio_venta, fecha_venta, metodo_pago, notas], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }
      
      // Actualizar estado de la obra a 'vendida'
      const queryObra = 'UPDATE obras SET estado = "vendida" WHERE id = ?';
      db.query(queryObra, [obra_id], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }
        
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }
          res.json({ success: true, id: result.insertId, message: 'Venta registrada exitosamente' });
        });
      });
    });
  });
});

// Actualizar venta
app.put('/api/ventas/:id', (req, res) => {
  const { precio_venta, fecha_venta, metodo_pago, notas } = req.body;
  
  const query = `UPDATE ventas SET precio_venta = ?, fecha_venta = ?, metodo_pago = ?, notas = ? 
                 WHERE id = ?`;
  
  db.query(query, [precio_venta, fecha_venta, metodo_pago, notas, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Venta actualizada exitosamente' });
  });
});

// Eliminar venta 
app.delete('/api/ventas/:id', (req, res) => {
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Obtener la obra_id de la venta antes de eliminarla
    const getObraQuery = 'SELECT obra_id FROM ventas WHERE id = ?';
    
    db.query(getObraQuery, [req.params.id], (err, results) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }
      
      if (results.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ message: 'Venta no encontrada' });
        });
      }
      
      const obra_id = results[0].obra_id;
      
      // Eliminar la venta
      const deleteQuery = 'DELETE FROM ventas WHERE id = ?';
      db.query(deleteQuery, [req.params.id], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }
        
        // 3. Actualizar el estado de la obra a 'disponible'
        const updateObraQuery = 'UPDATE obras SET estado = "disponible" WHERE id = ?';
        db.query(updateObraQuery, [obra_id], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }
          
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }
            res.json({ 
              success: true, 
              message: 'Venta eliminada exitosamente. La obra está nuevamente disponible.' 
            });
          });
        });
      });
    });
  });
});

//ESTADÍSTICAS 
app.get('/api/estadisticas', (req, res) => {
  const queries = {
    totalObras: 'SELECT COUNT(*) as total FROM obras',
    totalArtistas: 'SELECT COUNT(*) as total FROM artistas',
    totalVentas: 'SELECT COUNT(*) as total, SUM(precio_venta) as monto_total FROM ventas',
    obrasDisponibles: 'SELECT COUNT(*) as total FROM obras WHERE estado = "disponible"',
    exposicionesActivas: 'SELECT COUNT(*) as total FROM exposiciones WHERE estado = "activa"'
  };
  
  const estadisticas = {};
  let completadas = 0;
  
  Object.keys(queries).forEach(key => {
    db.query(queries[key], (err, results) => {
      if (!err) {
        estadisticas[key] = results[0];
      }
      completadas++;
      
      if (completadas === Object.keys(queries).length) {
        res.json(estadisticas);
      }
    });
  });
});

//  SERVIDOR

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📋 API disponible en http://localhost:${port}/api`);
});

process.on('SIGINT', () => {
  db.end((err) => {
    if (err) {
      console.error('Error cerrando conexión:', err);
    }
    console.log('Conexión a MySQL cerrada');
    process.exit(0);
  });
});