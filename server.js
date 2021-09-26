'use strict';

const express = require('express');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');


const app = express();
app.use(compression());

//----------------------------------------------------------------------------------------------
//Routes

//Swagger
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }'
};
const swaggerDocument = require('./routes/swagger/swagger.json');
app.use('/', swaggerUi.serveFiles(swaggerDocument, swaggerOptions));
const swaggerhtml = swaggerUi.generateHTML(swaggerDocument, swaggerOptions);
app.get('/', (req, res) => { res.send(swaggerhtml) });
app.get('/index.html', (req, res) => { res.send(swaggerhtml) });

//PDF
app.use('/generatepdf', require('./routes/pdf'));


//-----------------------------------------------------------------------------------------
app.set('port', process.env.SERVER_PORT || 80);

const server = app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + server.address().port);
});