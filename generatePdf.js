const PDFDocument = require('pdfkit');

function listToPDF(list, title = 'Reporte') {
  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(18).text(title, { align: 'center' });
  doc.moveDown();

  if (list.length > 0) {
    const keys = Object.keys(list[0]);
    doc.fontSize(12).text(keys.join(' | '));
    doc.moveDown();
    list.forEach(item => {
      doc.text(keys.map(k => item[k]).join(' | '));
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
