var http = require('http')
var express = require('express')
var app = express()
var fs = require('fs');

const path = require('path');
var opn = require('opn');
const toPdf = require('mso-pdf')

try{
	
  app.use(express.static('public'));

  app.get('/file_download', function(req, res) {

    let url_file = req.query.url_file;
    let name_file = req.query.name_file;
    let extencion_file = req.query.extencion_file;
    let save = req.query.save;

    if(url_file != '' && name_file != '' && extencion_file == '.docx' || extencion_file == 'docx'){

      var request = http.get(url_file, function(response) {
        if (response.statusCode === 200) {

          var file = fs.createWriteStream("tmp.docx");
          response.pipe(file);

          const enterPath = path.join(__dirname, `/tmp.docx`);
          const outputPath = path.join(__dirname, `/public/`+name_file+`.pdf`);

          toPdf.convert(enterPath,outputPath,function(errors){

            if(errors){
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ info: 'faild' }, null, 3));
            }

            var file_return = __dirname+`/public/`+name_file+`.pdf`;
			var url_open = 'http://apps.grupotci.com.co:8001/'+ name_file +'.pdf';
			//app.use(express.static(path.join(__dirname, 'public')));
			
            /*var bitmap = fs.readFileSync(file_return);
            var file_base_64 = new Buffer(bitmap).toString('base64');*/

            //opn(url_open, {app: 'chrome'});
			
			/*res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ info: 'Open URL' }, null, 3));*/
			
			var data =fs.readFileSync(file_return);
			res.contentType("application/pdf");
			res.send(data);

            /*res.download(file_return, req.params.url_file, function(err){

                if(err){
                    res.end(JSON.stringify({ info: 'fail download' }, null, 3));
                }

                res.end(JSON.stringify({ info: 'download' }, null, 3));

            });*/

          });

        }
        // Add timeout.
        request.setTimeout(12000, function () {
            request.abort();
        });

      });

    }else{

        res.end(JSON.stringify({ info: 'faild' }, null, 3));

    }

  });

  http.createServer(app).listen(8001, '192.168.253.104', () => {
      console.log('Server started at http://localhost:8001');
  });


}catch(error){

  console.log('Server Faild at http://localhost:8001');

}
