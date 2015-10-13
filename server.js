var http = require('http'),
    fs = require('fs');


fs.readFile('real.html', function (err, html) {
    if (err) {
        throw err;
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200);  
        response.write(html);  
        response.end();  
    }).listen(8000);
});
