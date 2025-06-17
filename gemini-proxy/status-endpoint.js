// Add a status endpoint to the server
function addStatusEndpoint(app) {
  app.get('/api/chatbot/status', (req, res) => {
    res.json({
      initialized: true,
      available: true,
      model_id: 'qala-lwazi',
      note: 'Qala-Lwazi medical chatbot is running'
    });
  });
}

module.exports = addStatusEndpoint;
