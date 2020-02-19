import http from 'http';

const server = http.createServer((req, res) => {
    console.log(req.url);
    if( req.method === "GET" &&
        req.url === "/main.css" ) {
            res.writeHead(200, { 'Content-Type' : 'text/css'});
            res.end(`
                h1 {
                    color : green;
                }
                p {
                    color : purple;
                }
            `);
        } else {
    res.writeHead(200, { 'Content-Type' : "text/html"});
    res.end(`
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="main.css" />
            </head>
            <body>
                <h1>Hello!</h1>
                <p>This is from our server!</p>
            </body>
        </html>
    `);
        }
});
server.listen(8000, "127.0.0.1")