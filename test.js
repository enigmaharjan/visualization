const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


//oracle code start
var oracledb = require('oracledb');

oracledb.getConnection({
    user: "hikmat",
    password: "hikmat",
    connectString: "192.168.56.101/orcl"
}, function (err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
    connection.execute("SELECT name from emp",
        [],
        function (err, result) {
            if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
            }
            console.log(result.metaData);
            console.log(result.rows);
            doRelease(connection);
        });
});

function doRelease(connection) {
    connection.release(
        function (err) {
            if (err) { console.error(err.message); }
        }
    );
}
