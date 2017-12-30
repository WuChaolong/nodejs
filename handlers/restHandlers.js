var extend = require('node.extend')
  , url = require("url")
  , requestMikeal = require('request')
  , formidable = require("formidable")
  ,fs = require('fs')
  ,mustache = require('mustache')
  ,querystring = require('querystring')
  ,iconv  = require('iconv-lite')
  ,nodeFetcher = require('node-fetch')
  ,ampify = require('ampify')
;

var httpProxy = require('http-proxy');

const zlib = require('zlib');
var Client = require('node-rest-client').Client;
  var browser = require('browser-x');
exports.cross = cross;
exports.activity = activity;
exports.fetch = fetch;
// exports.getRedirectsUrl = getRedirectsUrl;
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
  response.setHeader("access-control-allow-origin",origin);
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
          try{
            var data=JSON.parse(requestBodyBuffer.join( "" ));
          }catch(e){
            var data = requestBodyBuffer.join( "" );
          }            
          var crossContentType = data["crossContentType"]||"application/json";
          var crossUrl = data["crossUrl"];
          var crossMethod = data["crossMethod"]||"GET";

          
          if(!crossUrl){
            response.writeHead(200, {"Content-Type": crossContentType,"access-control-allow-origin": origin});
            response.end("crossUrl为空"+JSON.stringify(data));
            
          }else{
            delete data["crossUrl"];
            delete data["crossMethod"];
            delete data["crossContentType"];

            var options = {
                url: crossUrl,
                method:crossMethod,
                body:JSON.stringify(data),
                'content-type': 'application/json'
            };
            console.log(JSON.stringify(options));

            requestApi(options,response);
          }
        }
      );
      break;
    case 'PUT':
      var query = url.parse(request.url,true).query;
      var api = query["api"];
      if(query && api){
          var parse = url.parse(api,true);
          delete query["api"];
          extend(parse.query,query);
          delete parse.search;
          var newApi = url.format(parse);
          console.log(newApi);
//           requestApi(newApi,response);
          browserX(newApi,response);
//           phantom(newApi,response)
      }else{
        sendErr(response,"api为空,例：“api?api=http://192.168.1.123:3000/v1/merchants/shop/search?city_id=88&mall_id=150”");
      }
      break;
    default:
      var query = url.parse(request.url,true).query;
      var api = query["api"];
      if(query && api){
          var parse = url.parse(api,true);
          delete query["api"];
          extend(parse.query,query);
          delete parse.search;
          var newApi = url.format(parse);
          console.log(newApi);

//           var proxy = httpProxy.createProxyServer({}); // See (†)
//           proxy.web(request, response, { target: newApi });

//           var client = new Client();
//           // registering remote methods
//           client.registerMethod("jsonMethod", newApi, "GET");

//           client.methods.jsonMethod(function (data, res) {
//               // parsed response body as js object
//               console.log(data);
//               // raw response
//               console.log(res);
//               var headers = {
//                   "Content-Type": res.headers["content-type"]
//                   ,"content-encoding":res.headers['content-encoding']
//               };
// //               response.writeHead(200,headers);
// //               response.end(JSON.stringify(data));
              
//           });
          requestApi({url: newApi,encoding: null,gzip: true},response);
//           browserX(newApi,response);
//           phantom(newApi,response)
      }else{
        sendErr(response,"api为空,例：“api?api=http://192.168.1.123:3000/v1/merchants/shop/search?city_id=88&mall_id=150”");
      }
  }
}
function requestApi(newApi,response){
    requestMikeal(newApi, function (error, res, body) {
      try{
        if(error){
          sendErr(response,error);
        }else if(response.statusCode == 200) {
//           console.log(body);
//           var headers = {
//               "Content-Type": res.headers["content-type"]
//               ,"content-encoding":res.headers['content-encoding']
//           };
//           if(res.headers["content-type"]=="text/html; charset=GBK"){
//             body = iconv.decode(body, 'GBK');
//             headers["Content-Type"] = "text/html;charset=UTF-8";
//           }
//           response.writeHead(200,headers);
//           zlib.gzip(body, function (_, result) {  // The callback will give you the 
//             response.end(result);                     // result, so just send it.

//             res = body = response = null;
//           });
          endGzip(body,response,res);
          
//           if(res.headers['content-encoding']=="gzip"){
//               zlib.gzip(body, function (_, result) {  // The callback will give you the 
//                 response.end(result);                     // result, so just send it.
                
//                 res = body = response = null;
//               });
//           }else{

//             response.end(body);
//             res = body = response = null;
//           }

              
        }
      }catch(err){
        sendErr(response,err);
      }
    })
}
function endGzip(data,response,res){
  if(!isBuffer(data)){
    data = new Buffer(data, 'utf-8');
  } 

  var headers = {
      "Content-Type": "text/html"
      ,"content-encoding":"gzip"
  };
  if(res){
//     console.log(res.headers);
    headers["Content-Type"] = res.headers["content-type"];
    if(res.headers["content-type"]=="text/html; charset=GBK"){
      data = iconv.decode(data, 'GBK');
      headers["Content-Type"] = "text/html;charset=UTF-8";
    }
  }
  response.writeHead(200,headers);
  zlib.gzip(data, function (_, result) {  // The callback will give you the 
    response.end(result);                     // result, so just send it.

    res = data = response = null;
  });
  function isBuffer(arg) {
    return arg instanceof Buffer;
  }
}

function sendErr(response,err){
  
        console.log(err);
        response.writeHead(200, {"Content-Type":"application/json;charset=UTF-8"});
        response.end(JSON.stringify(err));
        response = err = null;
}

function fetch(response,request) {


  console.log("Request handler 'cross' was called.");
  var origin = (request.headers.origin || "*");
  response.setHeader("access-control-allow-origin",origin);
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

          var data = {};
          try{
            data=JSON.parse(requestBodyBuffer.join( "" ));
          }catch(e){
            console.log(requestBodyBuffer.join( "" ));
            
          }
          var crossContentType = data["crossContentType"]||"application/json";
          var crossUrl = data["crossUrl"];
          var crossMethod = data["crossMethod"]||"GET";

          
          if(!crossUrl){
            response.writeHead(200, {"Content-Type": crossContentType,"access-control-allow-origin": origin});
            response.end("crossUrl为空"+JSON.stringify(data));
            
          }else{
            delete data["crossUrl"];
            delete data["crossMethod"];
            delete data["crossContentType"];

            var options = {
                url: crossUrl,
                method:crossMethod,
                form:data
            };

  //           response.writeHead(100,{"Content-Type": "text/plain;charset=UTF-8"});

            browserX(options.url,response);
          }
        }
      );
      break;
    default:
      var query = url.parse(request.url,true).query;
      var api = query["api"];
      var npm = query["npm"];
      if(query && api){
          var parse = url.parse(api,true);
          delete query["api"];
          extend(parse.query,query);
          delete parse.search;
          var newApi = api;
          
          console.log(newApi);
          if(npm=="node-fetch"){
            nodeFetch(newApi,response);
          }else{
            browserX(newApi,response);
          }
//           requestApi(newApi,response);
//           phantom(newApi,response)
      }else{
        sendErr(response,"api为空,例：“api?api=http://192.168.1.123:3000/v1/merchants/shop/search?city_id=88&mall_id=150”");
      }
  }
}

function browserX(newApi,response){
  try{
    var url = encodeURI(newApi);
    browser({
        url: url
    }, function (errors, window) {

          if (errors) {
            console.log(errors);
            sendErr(response,errors);
          }else{
            var html = window.document.documentElement.innerHTML;
//           console.log(html);
//             var html = ampify(html, {cwd: 'amp'});
//             console.log(1+html);
// //               html = iconv.decode(html, 'gbk');
//             response.writeHead(200,{"Content-Type": "text/plain"});
//             response.end(html);

            endGzip(html,response);
          }
          
        window = html = null;
    });

  }catch(err){
    sendErr(response,err);
  }
}

function phantom(newApi,response){
  const Browser = require('zombie');
  const browser = new Browser();

  browser.fetch(newApi)
  .then(function(response) {
    console.log('Status code:', response.status);
    if (response.status === 200)
      return response.text();
  })
  .then(function(text) {
    console.log('Document:', text);
  })
  .catch(function(error) {
    console.log('Network error');
  });
}
function nodeFetch(newApi,response){

  newApi = encodeURI(newApi);
	
          
          console.log(newApi);
  nodeFetcher(newApi)
	.then(res => res.text())
	.then(function(body) {
// 	      response.writeHead(200,{"Content-Type": "text/plain"});
//           response.end(body);
          
            endGzip(body,response);
//         response = body = null;
    })
	.catch(function(err) {
          sendErr(response,err);
    });
}



function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};