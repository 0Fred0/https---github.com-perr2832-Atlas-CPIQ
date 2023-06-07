
var http = require('http');
var server = http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
    a = [1,2,3,4];
	res.end('Helfdslodsa World', a);
    res.end(a);
    
});
server.on('listening', function(){
    console.log("ok, server is running");
});
server.listen(8080);
import fetch from "node-fetch";
fetch("CYUL 2011_EN.json") 
  .then((response) => response.json())
  .then((data) => console.log(data));
  
