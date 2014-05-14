function route(handle, pathname, response, request) {
  	

	if (typeof handle[pathname] === 'function') {
		if (request.method.toUpperCase() === "OPTIONS"){
 
 
			// Echo back the Origin (calling domain) so that the
			// client is granted access to make subsequent requests
			// to the API.
			response.writeHead(
				"204",
				"No Content",
				{
					"access-control-allow-origin": "*",
					"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
					"access-control-allow-headers": "content-type, accept",
					"access-control-max-age": 10, // Seconds.
					"content-length": 0
				}
			);
 
			// End the response - we're not sending back any content.
			return( response.end() );
 
 
		}else{
			handle[pathname](response, request);
		}
 
	} else {
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {"Content-Type": "text/html"});
		response.write("404 Not found");
		response.end();
	}
}

exports.route = route;