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
// var Client = require('node-rest-client').Client;
var browser = require('browser-x');
exports.cross = cross;
exports.fetch = fetch;
// exports.getRedirectsUrl = getRedirectsUrl;

function cross(response,request) {


  console.log("Request handler 'cross' was called.");

  handler(response,request,function(newApi,response){
          requestApi({url: newApi,encoding: null,gzip: true},response);
  },function(){
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
  });
}
function fetch(response,request) {


  console.log("Request handler 'fetch' was called.");
  
  handler(response,request,function(newApi,response,query){
          var npm = query["npm"];
          if(npm=="node-fetch"){
            nodeFetch(newApi,response);
          }else{
            browserX(newApi,response);
          }
  });
}

function requestApi(newApi,response){
    requestMikeal(newApi, function (error, res, body) {
//       console.log(body);
      try{
        if(error){
          sendErr(response,error);
        }else if(response.statusCode == 200) {
          endGzip(body,response,res);
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
//     if(res.headers["content-type"]=="text/html; charset=GBK"){
//       data = iconv.decode(data, 'GBK');
//       headers["Content-Type"] = "text/html;charset=UTF-8";
//     }
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
        var err = err||"error";
        console.log(err);
        response.writeHead(200, {"Content-Type":"application/json;charset=UTF-8"});
        response.end(JSON.stringify(err));
        response = err = null;
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


function handler(response,request,request2,post) {


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
      if(post){
        post();
      }
      break;
    default:
      var query = url.parse(request.url,true).query;
      var api = query["api"];
      if(query && api){
          var parse = url.parse(api,true);
          delete query["api"];
          delete query["npm"];
          extend(parse.query,query);
          delete parse.search;
          var newApi = url.format(parse);
          console.log(newApi);
          request2(newApi,response,query);

//           browserX(newApi,response);
//           phantom(newApi,response)
      }else{
        sendErr(response);
      }
  }
}