var swig  = require('swig');
var fs = require('fs');

exports.save = function(req, res) {
    var activity = req.body;
    console.log('Adding activity: ' + JSON.stringify(activity));
    // var output = swig.renderFile(__dirname+'/views/activities/template.html', activity);
 //    fs.writeFile("/tmp/test.html", "Hey there!", function(err) {
	//     if(err) {
	//         console.log(err);
	//     } else {
	//         console.log("The file was saved!");
	//     }
	// }); 
};