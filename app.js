var express = require('express')
  , cors = require('cors')
  , app = express()
  , request = require('request')
  , extend = require('node.extend')
  , mustache = require("mustache")
  ,fs = require('fs')
  ,swig = require('swig')
  ,ejs = require('ejs')
  ,Firebase = require('firebase')
  ,activity = require('./routes/activity')
  ,formidable = require("formidable")
  , url = require("url");

app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(cors());
app.use(app.router);
app.set('views', __dirname + '/views');

app.post('/a', function(req, res){
  console.info(req.body.name);
})
// app.post('/activity', function(req, res) {
//   var activity = {};
//   var files = req.body.files;
//   for (var i = files.length - 1; i >= 0; i--) {
//     if(files[i].name == "data.js"){
//       var path = files[i].path;
//       fs.readFile(path, function (err, data) {
//         if (err) throw err;
//         console.log(data);

//       });
//     }
//   };
//   // var form = new formidable.IncomingForm();
//   // form.parse(request, function(error, fields, files) {
//   //   console.log("parsing done");
//   //   // fs.renameSync(files.upload.path, "/tmp/test.png");
//   //   // response.writeHead(200, {"Content-Type": "text/html"});
//   //   // response.write("received image:<br/>");
//   //   // response.write("<img src='/show' />");
//   //   // response.end();
//   // });
//     // var pathActivity = "";
//     // var activity = {};
//     // // console.log('Adding activity: ' + JSON.stringify(activity));
//     // var template = fs.readFileSync(__dirname+'/views/activities/template.html','utf8');
//     // var output = ejs.render(template, activity);
//     // var date = activity.date;
//     // console.log(output);
//     // var dirActivity = "C:/Program Files/Apache Software Foundation/Tomcat 8.0/webapps/tmp/"+date;
//     // fs.mkdir(dirActivity, function(error) {
//     //     if(error){
//     //           res.json({msg: error});
//     //           return;
//     //     }
//     //     fs.writeFile(dirActivity+"/index.html", output, function(err) {
//     //         if(err) {
//     //           res.json({msg: err});
//     //         } else {
//     //           res.json({msg: "The file was saved!"});
//     //         }
//     //     });
//     //     fs.writeFile(dirActivity+"/data.json", JSON.stringify(activity), function(err) {
//     //         if(err) {
//     //           res.json({msg: err});
//     //         }
//     //     });
//     // });
// });
app.get('/activity', function(req, res) {
    var pathActivity = "";
    var activity = req.query;
    // console.log('Adding activity: ' + JSON.stringify(activity));
    var template = fs.readFileSync(__dirname+'/views/activities/template.html','utf8');
    var output = ejs.render(template, activity);
    var date = activity.date;
    console.log(output);
    var dirActivity = "C:/Program Files/Apache Software Foundation/Tomcat 8.0/webapps/tmp/"+date;
    fs.mkdir(dirActivity, function(error) {
        fs.writeFile(dirActivity+"/index.html", output, function(err) {
            if(err) {
              res.json({msg: err});
            } else {
              res.json({msg: "The file was saved!"});
            }
        });
        fs.writeFile(dirActivity+"/data.json", JSON.stringify(activity), function(err) {
            if(err) {
              res.json({msg: err});
            }
        });
    });
});
app.get('/api', function(req, res, next){
  var query = url.parse(req.url,true).query;
  var api = query["api"];
  if(query && api){
      var parse = url.parse(api,true);
      delete query["api"];
      extend(parse.query,query);
      delete parse.search;
      var newApi = url.format(parse);
      console.log(newApi);
	  	request(newApi, function (error, response, body) {
		  	try{
          if(error){
            res.json({msg: error});
          }else if(response.statusCode == 200) {
  			    res.json(JSON.parse(body));
  			  }
		  	}catch(err){
		  	  res.json({msg: err});
		  	}
		  })
  }else{
  	res.json({msg: 'api为空,例：“api?api=http://192.168.1.123:3000/v1/merchants/shop/search?city_id=88&mall_id=150”'});
  }
});
app.listen(8889, function(){
  console.log('CORS-enabled web server listening on port 8889');
});

ejs.filters.or = function (arg, sub) {
  return arg || sub;
};
ejs.filters.escape = function (arg) {
  return escape(arg);
};
ejs.filters.unicode = function(str){
  var trim=function(s){return s.replace(/^\s+/,'').replace(/\s+$/,'')};
  var preStr='\\u';
  var value=trim(str);
  var cnReg=/[\u0391-\uFFE5]/gm;
  if(cnReg.test(value)){
    var ret=value.replace(cnReg,function(str){
      return preStr+str.charCodeAt(0).toString(16)
    });
    return ret;
  }
  return str; };