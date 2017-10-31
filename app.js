var http = require('http');
var fs   = require('fs');
var qs   = require("querystring");
var exec = require('child_process').exec;

var config = require('./config/config');
var urls   = require('./config/urls');

const sqlite = require('./modules/db.js'),
    db       = sqlite.init('./db/yodobashi.sqlite3')
    crypto   = require('./modules/crypto.js');
    

http.createServer(function (req, res) {
    if(req.url === '/' && req.method === 'GET') {
        fs.readFile(__dirname + '/index.html', {
            encoding: 'utf8'
        }, function(err, html) {
            if (err) {
                res.statusCode = 500;
                res.end('Error!');
            }else {
                res.setHeader('Content-Type', 'text/html');
                res.end(html);
            }
        });
    }else if (req.url === '/' && req.method === 'POST') {
        var body='';
        req.on('data', function (data) {
            body +=data;
        });
        req.on('end',function(){
            var post = qs.parse(body);
            
            if(config.apiKey !== post.apiKey){
                console.log('APIKEYが違います');
                return;
            }
            
            if(! urls[post.key]) {
                console.log('urlが見つかりません');
                return
            }
            
            
            db.get('select * from users where id = 1', (err, res) => {
                if (err) return;
                res.password      = crypto.decrypt(res.password);
                res.security_code = crypto.decrypt(res.security_code);
                res.url = urls[post.key];

                exec("casperjs yodobashi.js '" + JSON.stringify(res) + "'", (err, stdout, stderr) => {
                    if (err) { console.log(err); }
                    console.log(stdout);
                });
            });
            res.end();
        });
    }
}).listen(process.env.PORT || 8000);