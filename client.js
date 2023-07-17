 var express = require('express');
 var bodyParser = require('body-parser');
 var app = express();
 const prom = require('prom-client');

 const collectDefaultMetrics = prom.collectDefaultMetrics;
 collectDefaultMetrics({ prefix: 'forethought' });

 app.get('/metrics', function (req, res) {
   res.set('Content-Type', prom.register.contentType);
   res.end(prom.register.metrics());
 });

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});
