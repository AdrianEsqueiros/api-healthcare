const DBClient = require('../services/dbClient');
const { listToPDF } = require('../services/pdfService');

module.exports.getPacientesPDF = async (event) => {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
  const db = new DBClient(config);

  const queryParams = event.queryStringParameters || {};
  const filtro = queryParams.filtro || '';
  const pagina = parseInt(queryParams.pagina) || 1;
  const tamano = parseInt(queryParams.tamano) || 10;

  const params = [filtro, pagina, tamano];
  const spName = 'sp_listar_pacientes';
  const result = await db.callSP(spName, params);
  const list = Array.isArray(result) ? result[0] : result;
  const pdfBuffer = await listToPDF(list, 'Lista de Pacientes');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="reporte_de_pacientes.pdf"',
      'Access-Control-Allow-Origin': '*',
    },
    body: pdfBuffer.toString('base64'),
    isBase64Encoded: true,
  };
};
