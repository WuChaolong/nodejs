var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var restHandlers = require("./restHandlers");

var handle = {};
handle["/"] = requestHandlers.helloWorld;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/api"] = restHandlers.api;
handle["/activity"] = restHandlers.activity;

server.start(router.route, handle);