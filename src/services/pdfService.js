const PDFDocument = require('pdfkit');

function listToPDF(list, title = 'Reporte de Pacientes') {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  // Fecha y hora actual en la parte superior
  // Fecha y hora en formato personalizado
  const now = new Date();
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const dia = now.getDate();
  const mes = meses[now.getMonth()];
  const anio = now.getFullYear();
  const hora = now.getHours().toString().padStart(2, '0');
  const minutos = now.getMinutes().toString().padStart(2, '0');
  const segundos = now.getSeconds().toString().padStart(2, '0');
  const fechaStr = `${dia} de ${mes} del ${anio}`;
  const horaStr = `${hora}:${minutos}:${segundos}`;
    // Fecha discreta en la parte superior derecha
    doc.fillColor('#888888');
    doc.fontSize(9).font('Helvetica-Oblique');
    doc.text(`${fechaStr}, hora: ${horaStr}`, doc.page.width - doc.page.margins.right - 220, doc.page.margins.top - 5, {
      width: 220,
      align: 'right'
    });
    doc.fillColor('black');
    doc.moveDown(0.2);

  // Centrar el título manualmente
  doc.fontSize(22).font('Helvetica-Bold');
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const titleWidth = doc.widthOfString(title);
  const titleX = doc.page.margins.left + (pageWidth - titleWidth) / 2;
  doc.text(title, titleX, doc.y);
  doc.moveDown(2);

  if (list.length > 0) {
  const keys = ['id', 'nombre', 'apellido', 'sexo', 'peso', 'edad'];
  const headers = ['ID', 'NOMBRE', 'APELLIDO', 'SEXO', 'PESO (kg)', 'EDAD'];
  const colWidths = [50, 120, 140, 100, 80, 60]; // Ajustados para cuadrar mejor
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const startX = doc.page.margins.left + Math.floor((pageWidth - tableWidth) / 2);
    let y = doc.y;

    // Encabezado de tabla
    doc.fontSize(13).font('Helvetica-Bold');
    let x = startX;
    // Línea horizontal superior
    doc.moveTo(startX, y - 2).lineTo(startX + tableWidth, y - 2).stroke();
    headers.forEach((header, i) => {
      // Centrado horizontal y vertical en la celda
      const cellX = x + 5;
      const cellWidth = colWidths[i] - 10;
      const cellHeight = 18;
      const textHeight = doc.heightOfString(header, { width: cellWidth, align: 'center' });
      const cellY = y + (cellHeight - textHeight) / 2;
      doc.text(header, cellX, cellY, { width: cellWidth, align: 'center' });
      x += colWidths[i];
    });
    // Línea vertical entre columnas (encabezado)
    for (let i = 0; i <= headers.length; i++) {
      let xLine = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.moveTo(xLine, y - 2).lineTo(xLine, y + 18 + (list.length * 22)).stroke();
    }
    // Línea horizontal bajo encabezado
    doc.moveTo(startX, y + 18).lineTo(startX + tableWidth, y + 18).stroke();
    y += 22;
    doc.font('Helvetica').fontSize(12);

    // Filas de la tabla con líneas
    list.forEach(item => {
      x = startX;
      keys.forEach((k, i) => {
        doc.text(String(item[k]), x + 5, y, { width: colWidths[i] - 10, align: 'center' });
        x += colWidths[i];
      });
      // Dibujar línea horizontal
      doc.moveTo(startX, y + 18).lineTo(startX + tableWidth, y + 18).stroke();
      y += 22;
    });
  } else {
    doc.text('No hay datos.');
  }

  doc.end();
  return new Promise((resolve) => {
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });
}

module.exports = { listToPDF };
