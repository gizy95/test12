const http = require("http");

http.createServer(function (req,res){
  res.write("on my way ro become a full stack");
  res.end();
}

).listen(3000);

console.log("Server is running");
