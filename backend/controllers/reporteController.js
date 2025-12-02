const reporteDAO = require('../dao/reporteDAO');
const productoDAO = require('../dao/productoDAO');
const db = require('../config/db');
const ReporteDTO = require('../dto/reporteDTO');
// Se importa la función para generar plantillas HTML.
const { generarPlantillaHtml } = require('../utils/template');

// Se asume que jsreport se inicializa en app.js y se pasa a través de req
const getJsreportRenderer = (req) => require('../services/jsreportService')(req.app.get('jsreport'));

// Función auxiliar para convertir a CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        // Escapar comillas y envolver en comillas si contiene comas o comillas
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
}

// Obtener datos de ventas (pedidos)
async function getVentasData() {
  const [rows] = await db.query(`
    SELECT 
      p.idPedido,
      p.fecha,
      p.estado,
      p.total,
      c.idCliente,
      u.nombres,
      u.apellidos,
      u.correo,
      (SELECT COUNT(*) FROM detallepedido dp WHERE dp.idPedido = p.idPedido) as cantidadProductos
    FROM pedido p
    LEFT JOIN cliente c ON p.idCliente = c.idCliente
    LEFT JOIN usuario u ON c.fk_idUsuario = u.idUsuario -- Corregido el JOIN
    ORDER BY p.fecha DESC
  `);
  return rows;
}

// Generar reporte de ventas
exports.generateVentasReport = async (req, res) => {
  try {
    const { formato = 'json', usuario } = req.body;
    
    // Obtener datos de ventas
    const ventas = await getVentasData();
    
    // Preparar datos del reporte
    const reportData = ventas.map(venta => ({
      'ID Pedido': venta.idPedido,
      'Fecha': venta.fecha,
      'Cliente': `${venta.nombres || ''} ${venta.apellidos || ''}`.trim() || 'Sin cliente',
      'Correo': venta.correo || 'Sin correo',
      'Estado': venta.estado,
      'Total': `S/ ${parseFloat(venta.total || 0).toFixed(2)}`,
      'Cantidad Productos': venta.cantidadProductos || 0
    }));

    // Guardar reporte en la base de datos
    const totalMonto = ventas.reduce((sum, v) => sum + parseFloat(v.total || 0), 0).toFixed(2);
    const parametros = {
      formato,
      totalVentas: ventas.length,
      totalMonto: totalMonto
    };

    const reporteId = await reporteDAO.create({
      tipo: 'ventas',
      formato,
      parametros,
      usuario: usuario || 'Sistema',
      exportado: false
    });

    // Convertir a formato solicitado
    if (formato.toLowerCase() === 'csv') {
      const csv = convertToCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } else if (formato.toLowerCase() === 'pdf') {
      // 1. Generar el contenido HTML usando la plantilla
      const htmlContent = generarPlantillaHtml('Reporte de Ventas', reportData);

      // 2. Renderizar el HTML a PDF usando jsreport
      const render = getJsreportRenderer(req);
      const report = await render({ content: htmlContent });

      // 3. Enviar el PDF al cliente
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte_ventas_${reporteId}.pdf`);
      res.send(report.content);
      await reporteDAO.updateExportado(reporteId, true);
    } else {
      res.json({
        success: true,
        idReporte: reporteId,
        tipo: 'ventas',
        formato,
        datos: reportData,
        totalVentas: ventas.length,
        totalMonto: totalMonto
      });
    }
  } catch (error) {
    console.error('Error generando reporte de ventas:', error);
    res.status(500).json({ error: 'Error al generar reporte de ventas' });
  }
};

// Generar reporte de productos
exports.generateProductosReport = async (req, res) => {
  try {
    const { formato = 'json', usuario } = req.body;
    
    // Obtener datos de productos
    const productos = await productoDAO.getAll(); // Corregido: El método es getAll, no findAll
    
    // Preparar datos del reporte
    const reportData = productos.map(producto => ({
      'ID': producto.idProducto,
      'Nombre': producto.nombre || 'Sin nombre',
      'Descripción': producto.descripcion || 'Sin descripción',
      'Categoría': producto.categoria || 'Sin categoría',
      'Subcategoría': producto.subcategoria || 'Sin subcategoría',
      'Precio': `S/ ${parseFloat(producto.precio || 0).toFixed(2)}`, // Asegúrate que productoDAO.findAll() devuelve precio
      'Stock': producto.stock || 0
    }));

    // Guardar reporte en la base de datos
    const parametros = {
      formato,
      totalProductos: productos.length,
      totalStock: productos.reduce((sum, p) => sum + parseInt(p.stock || 0), 0)
    };

    const reporteId = await reporteDAO.create({
      tipo: 'productos',
      formato,
      parametros,
      usuario: usuario || 'Sistema',
      exportado: false
    });

    // Convertir a formato solicitado
    if (formato.toLowerCase() === 'csv') {
      const csv = convertToCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=reporte_productos_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } else if (formato.toLowerCase() === 'pdf') {
        // 1. Generar el contenido HTML usando la plantilla
        const htmlContent = generarPlantillaHtml('Reporte de Productos', reportData);

        // 2. Renderizar el HTML a PDF usando jsreport
        const render = getJsreportRenderer(req);
        const report = await render({ content: htmlContent });

        // 3. Enviar el PDF al cliente
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_productos_${reporteId}.pdf`);
        res.send(report.content);
        await reporteDAO.updateExportado(reporteId, true);
    } else {
      res.json({
        success: true,
        idReporte: reporteId,
        tipo: 'productos',
        formato,
        datos: reportData,
        totalProductos: productos.length,
        totalStock: parametros.totalStock
      });
    }
  } catch (error) {
    console.error('Error generando reporte de productos:', error);
    res.status(500).json({ error: 'Error al generar reporte de productos' });
  }
};

// Generar reporte de usuarios
exports.generateUsuarioReport = async (req, res) => {
  try {
    const { formato = 'json', usuario } = req.body;
    
    // Obtener datos de usuarios
    const [usuarios] = await db.query(`
      SELECT 
        u.idUsuario,
        u.nombres,
        u.apellidos,
        u.correo,
        u.dni,
        u.telefono,
        u.rol,
        CASE WHEN c.idCliente IS NOT NULL THEN 1 ELSE 0 END as tieneCliente
      FROM usuario u
      LEFT JOIN cliente c ON u.idUsuario = c.fk_idUsuario
      ORDER BY u.idUsuario
    `);
    
    // Preparar datos del reporte
    const reportData = usuarios.map(user => ({
      'ID': user.idUsuario,
      'Nombres': user.nombres || 'Sin nombre',
      'Apellidos': user.apellidos || 'Sin apellidos',
      'Correo': user.correo || 'Sin correo',
      'DNI': user.dni || 'Sin DNI',
      'Teléfono': user.telefono || 'Sin teléfono',
      'Rol': user.rol || 'Sin rol',
      'Tiene Cliente': user.tieneCliente === 1 ? 'Sí' : 'No'
    }));

    // Guardar reporte en la base de datos
    const parametros = {
      formato,
      totalUsuarios: usuarios.length,
      totalAdministradores: usuarios.filter(u => u.rol === 'Administrador').length,
      totalClientes: usuarios.filter(u => u.rol === 'Cliente').length
    };

    const reporteId = await reporteDAO.create({
      tipo: 'usuario',
      formato,
      parametros,
      usuario: usuario || 'Sistema',
      exportado: false
    });

    // Convertir a formato solicitado
    if (formato.toLowerCase() === 'csv') {
      const csv = convertToCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=reporte_usuario_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } else if (formato.toLowerCase() === 'pdf') {
        // 1. Generar el contenido HTML usando la plantilla
        const htmlContent = generarPlantillaHtml('Reporte de Usuarios', reportData);

        // 2. Renderizar el HTML a PDF usando jsreport
        const render = getJsreportRenderer(req);
        const report = await render({ content: htmlContent });

        // 3. Enviar el PDF al cliente
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_usuarios_${reporteId}.pdf`);
        res.send(report.content);
        await reporteDAO.updateExportado(reporteId, true);
    } else {
      res.json({
        success: true,
        idReporte: reporteId,
        tipo: 'usuario',
        formato,
        datos: reportData,
        totalUsuarios: usuarios.length,
        totalAdministradores: parametros.totalAdministradores,
        totalClientes: parametros.totalClientes
      });
    }
  } catch (error) {
    console.error('Error generando reporte de usuarios:', error);
    res.status(500).json({ error: 'Error al generar reporte de usuarios' });
  }
};

// Listar todos los reportes
exports.listAll = async (req, res) => {
  try {
    const reportes = await reporteDAO.getAll();
    res.json(reportes.map(r => new ReporteDTO(r)));
  } catch (error) {
    console.error('Error listando reportes:', error);
    res.status(500).json({ error: 'Error al listar reportes' });
  }
};

// Obtener reporte por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await reporteDAO.getById(id);
    if (!reporte) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }
    res.json(new ReporteDTO(reporte));
  } catch (error) {
    console.error('Error obteniendo reporte:', error);
    res.status(500).json({ error: 'Error al obtener reporte' });
  }
};

// Obtener reportes por tipo
exports.getByTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const reportes = await reporteDAO.getByTipo(tipo);
    res.json(reportes.map(r => new ReporteDTO(r)));
  } catch (error) {
    console.error('Error obteniendo reportes por tipo:', error);
    res.status(500).json({ error: 'Error al obtener reportes por tipo' });
  }
};

// Eliminar reporte
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await reporteDAO.delete(id);
    res.json({ success: true, message: 'Reporte eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando reporte:', error);
    res.status(500).json({ error: 'Error al eliminar reporte' });
  }
};
