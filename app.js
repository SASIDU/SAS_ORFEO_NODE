var http = require('http')
var express = require('express')
var app = express()
var fs = require('fs');

const path = require('path');
var opn = require('opn');
const toPdf = require('mso-pdf')

try{

    app.get('/file_download', function(req, res) {

        let url_file = req.query.url_file;
        let name_file = req.query.name_file;
        let extencion_file = req.query.extencion_file;

        if(url_file != '' && name_file != '' && extencion_file == '.docx' || extencion_file == 'docx'){

            var request = http.get(url_file, function(response) {
                if (response.statusCode === 200) {
        
                    var file = fs.createWriteStream("tmp.docx");
                    response.pipe(file);
        
                    const enterPath = path.join(__dirname, `/tmp.docx`);
                    const outputPath = path.join(__dirname, `/pdf-files/`+name_file+`.pdf`);
        
                    toPdf.convert(enterPath,outputPath,function(errors){
                        if(errors){
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ info: 'faild' }, null, 3));
                        }
    
                        var file_return = __dirname+`/pdf-files/`+name_file+`.pdf`;

                        opn(file_return, {app: 'chrome'});
    
                        /*res.download(file_return, req.params.url_file, function(err){
    
                            if(err){
                                res.end(JSON.stringify({ info: 'fail download' }, null, 3));
                            }
    
                            res.end(JSON.stringify({ info: 'download' }, null, 3));
    
                        });*/
    
                    })
        
        
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
    
    http.createServer(app).listen(8001, () => {
        console.log('Server started at http://localhost:8001');
    });
    

}catch(error){

    console.log('Server Faild at http://localhost:8001');

}
