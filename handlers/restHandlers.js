var extend = require('node.extend')
  , url = require("url")
  , requestMikeal = require('request')
  , formidable = require("formidable")
  ,fs = require('fs')
  ,mustache = require('mustache')
  ,querystring = require('querystring')
;
exports.cross = cross;
exports.activity = activity;

var filters = {
  escape:function() {
      var result = escape(this);
      return result;
  },
  unicode:function() {
    var result = this;
    var trim=function(s){return s.replace(/^\s+/,'').replace(/\s+$/,'')};
    var preStr='\\u';
    var value=trim(result);
    var cnReg=/[\u0391-\uFFE5]/gm;
    if(cnReg.test(value)){
      var ret=value.replace(cnReg,function(text){
        return preStr+text.charCodeAt(0).toString(16)
      });
      result = ret;
    }
    return result;
  },
  bigImg:function() {
      var result =  this.split("normal_").join('large_');
      return result;
  },
  isfirst:function(){

  },
  eachIndex: function() {
    if(typeof index  == "undefined"){
      index = 0
    }else{
      index ++;
    }
    this.index = index;
    return;
  },
  resetIndex: function() {
    index =undefined;
    return;
  }
}

function activity(response,request) {
  
  console.log("Request handler 'activity' was called.");

  var baseDir = "C:/Program Files/Apache Software Foundation/Tomcat 8.0/webapps/tmp/";
  var basehtmlDir = "http://192.168.1.100:8081/tmp/";
  var origin = (request.headers.origin || "*");
  var method = request.method.toUpperCase();
  switch (method){
    case 'OPTIONS':
      // Echo back the Origin (calling domain) so that the
      // client is granted access to make subsequent requests
      // to the API.
      response.writeHead(
        "204",
        "No Content",
        {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
          "access-control-allow-headers": "content-type, accept",
          "access-control-max-age": 10, // Seconds.
          "content-length": 0
        }
      );
 
      // End the response - we're not sending back any content.
      response.end();
      break;
    case 'POST':
      var requestBodyBuffer = [];
      request.on("data",
        function( data ){
          requestBodyBuffer.push(data);
        }
      );
      request.on("end",
        function(){
          response.writeHead(200, {"Content-Type": "application/json","access-control-allow-origin": origin});
          try{
            var activity =JSON.parse(requestBodyBuffer.join( "" ));
            console.log(activity);
            var template = fs.readFileSync(__dirname+'/views/activities/template.html','utf8');
            extend(activity,filters);
            console.log(activity);
            var output = mustache.render(template,activity);
            var date = activity.date;
            var dirActivity = baseDir+date;
            var view = {htmlDir:basehtmlDir+date+"/index.html"};
            fs.mkdir(dirActivity, function(error) {
                var htmlDir = dirActivity+"/index.html";
                fs.writeFile(htmlDir, output, function(err) {
                    if(err) {
                      response.end( JSON.stringify(err) );
                    } else {
                      response.end(JSON.stringify(view));
                    }
                });
                fs.writeFile(dirActivity+"/data.json", JSON.stringify(activity), function(err) {
                    if(err) {
                      response.end( JSON.stringify(err) );
                    }
                });
            });

            var locationTemplate = fs.readFileSync(__dirname+'/views/util/location.html','utf8');
            var locationHtml = mustache.render(locationTemplate,view);
            var locationDir = baseDir+"location.html";
            console.log(locationDir);

            console.log(locationHtml);
            fs.writeFile(locationDir, locationHtml, function(err) {
                if(err) {
                  response.end( JSON.stringify(err) );
                }
            });
          }catch(err){
            response.end( JSON.stringify(err) );
          }


        }
      );
      break;
    default:
      response.writeHead(200, {"Content-Type": "application/json","access-control-allow-origin": origin});
      var query = url.parse(request.url,true).query;
      var date = query["date"];
      try{
        var dirJson = baseDir+date+"/data.json";
        var json = fs.readFileSync(dirJson,'utf8'); 
        var activity = JSON.parse(json);
        activity["htmlDir"] = basehtmlDir+date+"/index.html";
        response.end(JSON.stringify(activity));
      }catch(err){
        response.end( JSON.stringify(err) );
      }       
      break;
  }






  
    // parse a file upload
    // var form = new formidable.IncomingForm(),
    //     files = [],
    //     fields = [];

    // form.uploadDir = "/tmp";

    // form.on('file', function(field, file) {
    //   console.log(field, file);
    // });
    // form.parse(request);


  // var form = new formidable.IncomingForm();
  // form.parse(request, function(error, fields, files) {
  //   console.log(fields);
  //   console.log(files);
  //   // fs.renameSync(files.upload.path, "/tmp/test.png");
  //   response.writeHead(200, {"Content-Type": "text/html"});
  //   response.write("received image:<br/>");
  //   response.write("<img src='/show' />");
  //   response.end();
  // });
}

function cross(response,request) {


  console.log("Request handler 'cross' was called.");
  var origin = (request.headers.origin || "*");
  var method = request.method.toUpperCase();
  switch (method){
    case 'OPTIONS':
      // Echo back the Origin (calling domain) so that the
      // client is granted access to make subsequent requests
      // to the API.
      response.writeHead(
        "204",
        "No Content",
        {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
          "access-control-allow-headers": "content-type, accept",
          "access-control-max-age": 10, // Seconds.
          "content-length": 0
        }
      ); 
 
      // End the response - we're not sending back any content.
      response.end();
      break;
    case 'POST':
      var requestBodyBuffer = [];
      request.on("data",
        function( data ){
          requestBodyBuffer.push(data);
        }
      );
      request.on("end",
        function(){
          var data = querystring.parse(requestBodyBuffer.join( "" ));
            console.log(data);
          var crossContentType = data["crossContentType"]||"application/json";
          var crossUrl = data["crossUrl"];
          var crossMethod = data["crossMethod"]||"GET";

          response.writeHead(200, {"Content-Type": crossContentType,"access-control-allow-origin": origin});
          
          if(!crossUrl){
            response.end("crossUrl为空");
            return;
          }
          delete data["crossUrl"];
          delete data["crossMethod"];
          delete data["crossContentType"];

          var options = {
              url: crossUrl,
              method:crossMethod,
              form:data
          };

          requestMikeal(options,function (error, res, body) {
            try{
              if(error){
                response.end(JSON.stringify(error));
              }else if(response.statusCode == 200) {
                console.log(body);
                response.end(body);
              }
            }catch(err){
              response.end(JSON.stringify(err));
            }
          });
        }
      );
      break;
    default:
      var query = url.parse(request.url,true).query;
      var api = query["api"];
      response.writeHead(200, {"Content-Type": "application/json","access-control-allow-origin": origin});
      if(query && api){
          var parse = url.parse(api,true);
          delete query["api"];
          extend(parse.query,query);
          delete parse.search;
          var newApi = url.format(parse);
          console.log(newApi);
          requestMikeal(newApi, function (error, res, body) {
            try{
              if(error){
                response.end(JSON.stringify(error));
              }else if(response.statusCode == 200) {
                response.end(body);
              }
            }catch(err){
              response.end(JSON.stringify(err));
            }
          })
      }else{
        response.end("api为空,例：“api?api=http://192.168.1.123:3000/v1/merchants/shop/search?city_id=88&mall_id=150”");
      }
  }
}
