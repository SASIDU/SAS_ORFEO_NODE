var http = require('http')
var express = require('express')
var app = express()
var fs = require('fs');

const path = require('path');
const toPdf = require('mso-pdf');


/*
const doc = require('docx-pdf');
const CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');const libre = require('libreoffice-convert');
const { promisify } = require('bluebird');
let lib_convert = promisify(libre.convert)*/

try {

  app.use(express.static('public'));

  app.get('/file_download', function (req, res) {

    let url_file = req.query.url_file;
    let name_file = req.query.name_file;
    let extencion_file = req.query.extencion_file;
    let save = req.query.save;

    if (url_file != '' && name_file != '' && extencion_file == '.docx' || extencion_file == 'docx') {

      var file = fs.createWriteStream("tmp.docx");

      var request = http.get(url_file, function (response) {
        if (response.statusCode === 200) {
          
          response.pipe(file);

          const enterPath = path.join(__dirname, `/tmp.docx`);
          const outputPath = path.join(__dirname, `/public/` + name_file + `.pdf`);

          toPdf.convert(enterPath, outputPath, function (errors) {

            if (errors) {
              res.end(JSON.stringify({ info: 'faild' }, null, 3));
            }

            var file_return = __dirname + `/public/` + name_file + `.pdf`;

            file.on('finish', function() {
              file.close();  // close() is async, call cb after close completes.
            });

            var data = fs.readFileSync(file_return);
            res.contentType("application/pdf");
            res.send(data);

          });

        }else{
          file.close();
          //fs.unlink('./tmp.docx', () => {}); 
          res.end(JSON.stringify({ info: 'File no found' }, null, 3));
        }
        // Add timeout.
        request.setTimeout(12000, function () {
          request.abort();
        });

      }).on('error', function(err) { // Handle errors
		file.close();
        //fs.unlink('tmp.docx'); // Delete the file async. (But we don't check the result)
        res.end(JSON.stringify({ info: 'Archivo no encontrando' }, null, 3));
      });

    } else {

      res.end(JSON.stringify({ info: 'faild' }, null, 3));

    }

  });

  http.createServer(app).listen(8001, '192.168.253.104', () => {
    console.log('Server started at http://apps.grupotci.com.co:8001');
  });


} catch (error) {

  res.end(JSON.stringify({ info: 'faild' }, null, 3));

}
