var http = require('http')
var fs = require('fs')
var url = require('url')

http.createServer( (request, response) => {
    
    var pathname = url.parse(request.url).pathname

    console.log('pathname: ' + pathname)
	
  	// pathname으로 router 분기함 
    if (pathname == '/') {
        pathname = '/screens/index.html'
    } 
    // else if (pathname == '/about') {
    //     pathname = '/screens/about.html'
    // }

    fs.readFile(pathname.substr(1), (err, data) => {
        if (err) {
            console.log(err)
            response.writeHead(404, {'Content-Type': 'text/html'})
        } else {
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.write(data.toString())
        }
        response.end()
    })
}).listen(8081)

console.log('Server running at http://127.0.0.1:8081')