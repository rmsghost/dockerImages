const express = require('express');
const os = require('os')
const app = express();
const conversor = require('./convert')
const bodyParser = require('body-parser');
const config = require('./config/system-life');
const path = require('path');
const client = require('prom-client');

const register = new client.Registry();

const http_request_counter = new client.Counter({
	name: 'name_App',
	help: 'Metricas de http',
	labelNames: ['method', 'route', 'statusCode'],
});
register.registerMetric(http_request_counter);


app.use(function(req, res, next)
{
    // Increment the HTTP request counter
    http_request_counter.labels({method: req.method, route: req.originalUrl, statusCode: res.statusCode}).inc();
    next();
})



register.setDefaultLabels({ 
	app: 'your-app-name'
})
client.collectDefaultMetrics({register});

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});




app.use('/', config.routers);
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/fahrenheit/:valor/celsius', (req, res) => {
    let valor = req.params.valor;
    let celsius = conversor.fahrenheitCelsius(valor);
    res.json({ "celsius": celsius, "maquina": os.hostname() });
    res.set('Content-Type', client.register.contenType);
    res.end(client.register.metrics());
});

app.get('/celsius/:valor/fahrenheit', (req, res) => {

    let valor = req.params.valor;
    let fahrenheit = conversor.celsiusFahrenheit(valor);
    res.json({ "fahrenheit": fahrenheit, "maquina": os.hostname() });
});

app.get('/', (req, res) => {

    res.render('index',{valorConvertido: '', maquina: os.hostname()});
});

app.post('/', (req, res) => {
    let resultado = '';

    if (req.body.valorRef) {
        if (req.body.selectTemp == 1) {
            resultado = conversor.celsiusFahrenheit(req.body.valorRef)
        } else {
            resultado = conversor.fahrenheitCelsius(req.body.valorRef)
        }
    }

    res.render('index', {valorConvertido: resultado, "maquina": os.hostname()});
 });


app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});

