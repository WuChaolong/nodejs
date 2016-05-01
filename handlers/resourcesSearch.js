var 
    util = require("util"),
    http = require("http"), 
    requestF = require('request');
//     jsdom = require("node-jsdom");

exports.byGoogle = byGoogle;
function byGoogle(response,request){
    var origin = (request.headers.origin || "*");

    var url = "http://charon-node.herokuapp.com/api?api=https://www.google.com.hk/search?q=site%3Ayun.baidu.com+活死人黎明";

    var contents = []; 
    response.writeHead(200, {"Content-Type": "application/json","access-control-allow-origin": origin});
    fetch(url,contents);
    response.write(contents.toString());
    response.end(); 
}

function fetch(url,contents){ 
    
    requestF(url, function(error, response, chunk) {

      if (!error && response.statusCode == 200) {
        util.log(chunk);
        googleSearchListPath(chunk,url,contents);
        baiduYunPath(chunk,contents);
      }
    });
}


function googleSearchListPath(chunk,url,contents){
//     var myRe = /(https?:\/\/yun.baidu.com[^\s|^\"]+)/g
//     var myArray = myRe.exec(chunk);

//     jsdom.env(
//       chunk,
//       function (errors, window) {
//         var as = window.document.querySelector("a");

//         as.forEach(function (element, index, array) {
//             console.log("a[" + index + "] = " + element);
//             var index = element.href.indexOf("http://yun.baidu.com/wap/link?");
//             if(index === 0){
//                 fetch(element.href,contents);
//             }
//         });
//       }
//     );

}
function baiduYunPath(chunk,contents){
    var content = {};//
    if(content){
        contents.push(content);
    }
}