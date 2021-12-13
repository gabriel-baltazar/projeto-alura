module.exports = app => {
  app.get('/atendimentos', (req, res) => {
    res.send('Pagina de atendimentos');
  });

  app.post('/atendimentos', (req, res) => {
    console.log(req.body);
    res.send('Cadastro de atendimento');
  });
}