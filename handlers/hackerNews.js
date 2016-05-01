var path = require('path')
  ,swig = require('swig')
  ,request = require('request');

exports.index = index;
function index(res,req){
    var url = 'https://news.ycombinator.com/';
    var json_data = {
      "title": "title",
      "logo": "a[href='http://www.ycombinator.com'] img",
      "paragraphs": [{ "elem": ".title> a:first-of-type", "title": "text", "location": "href"}]
    };
    request.post('http://www.jamapi.xyz/', {form: {url: url, json_data: JSON.stringify(json_data)}}, function(err, response, body) {
      
        var dir = path.resolve(__dirname,'../views/hackerNews/list.html')
        
        try{
           var data = JSON.parse(body);
           var output=data?swig.renderFile(dir, data):body;
        }catch(e){
           var output = body;
        }

        res.writeHead(200, {"Content-Type": "text/html","access-control-allow-origin": "*"});
        res.write(output);
        res.end();
    });
}

