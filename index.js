var server = require("./server");
var router = require("./router");
var requestHandlers = require("./handlers/requestHandlers");
var restHandlers = require("./handlers/restHandlers");
var resourcesSearch = require("./handlers/resourcesSearch");
var hackerNews = require("./handlers/hackerNews");
var freelancer = require("./handlers/freelancer");
var handle = {};
handle["/"] = requestHandlers.helloWorld;
// handle["/start"] = requestHandlers.start;
// handle["/upload"] = requestHandlers.upload;
// handle["/show"] = requestHandlers.show;
handle["/cross"] = restHandlers.cross;
handle["/api"] = restHandlers.cross;
// handle["/activity"] = restHandlers.activity;
// handle["/resourcesSearch"] = resourcesSearch.byGoogle;
handle["/hackerNews"] = hackerNews.index;
handle["/fetch"] = restHandlers.fetch;
// handle["/htmlToAmp"] = freelancer.htmlToAmp;

server.start(router.route, handle);

var nl = require('newrelic');