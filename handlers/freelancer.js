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


  var browser = require('browser-x');
exports.htmlToAmp = htmlToAmp;
function htmlToAmp(response,request) {


  console.log("Request handler 'htmlToAmp' was called.");
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
    
    default:
      var query = url.parse(request.url,true).query;
      var api = query["html"];
      if(query && api){
          var parse = url.parse(api,true);
          delete query["html"];
          extend(parse.query,query);
          delete parse.search;
          var newApi = url.format(parse);
          console.log(newApi);

            nodeFetch(newApi,response);
//           requestApi({url: newApi,encoding: null},response);
//           browserX(newApi,response);
//           phantom(newApi,response)
      }else{
        sendErr(response,"api为空,例：“api?api=http://192.168.1.123:3000/v1/merchants/shop/search?city_id=88&mall_id=150”");
      }
  }
}
function nodeFetch(newApi,response){

  newApi = encodeURI(newApi);
	
          
  nodeFetcher(newApi)
	.then(res => res.text())
	.then(function(body) {
          
          console.log(body);
          var amp = ampify(html, {cwd: 'amp'});
console.log(amp);
	      response.writeHead(200,{"Content-Type": "text/plain"});
          response.end(amp);
        body = null;
    })
	.catch(function(err) {
console.log("111");
          sendErr(response,err);
    });
}

function sendErr(response,err){
        response.writeHead(200, {"Content-Type":"application/json;charset=UTF-8"});
        response.end(JSON.stringify(err));
}
