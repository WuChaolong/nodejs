var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    url = require("url");

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.helloWorld = helloWorld;


function start(response) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/activity" enctype="multipart/form-data" '+
    'method="post" >'+ 
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html","access-control-allow-origin": "*"});
    response.write(body);
    response.end(); 
}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");
 
  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    console.log("parsing done");
    fs.renameSync(files.upload.path, "/tmp/test.png");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
}

function show(response) {
  console.log("Request handler 'show' was called.");
  fs.readFile("/tmp/test.png", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}

function helloWorld(response) {
  console.log("Request handler 'helloWorld' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<h1>Hello world!</h1>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html","access-control-allow-origin": "*"});
    response.write(body);
    response.end(); 
}
