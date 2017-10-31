const http = require('http'),
        fs   = require('fs'),
        qs   = require("querystring"),
        exec = require('child_process').exec,
        config = require('./config/config'),
        urls   = require('./config/urls'),
        sqlite = require('./modules/db.js'),
        db       = sqlite.init('./db/yodobashi.sqlite3'),
        crypto   = require('./modules/crypto.js');


http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'POST') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const post = qs.parse(body);
            
            new Promise((resolve, reject) => {
                if(config.apiKey !== post.apiKey){
                    reject('APIKEYが違います');
                }
                
                if(! urls[post.key]) {
                    reject('urlが見つかりません');
                }
            
                db.get('select * from users where id = 1', (err, res) => resolve(res));
            }).then(res => {
                res.password      = crypto.decrypt(res.password);
                res.security_code = crypto.decrypt(res.security_code);
                res.url = urls[post.key];
                
                return new Promise((resolve, reject) => {
                    exec("casperjs yodobashi.js '" + JSON.stringify(res) + "'", (err, stdout, stderr) => {
                        if(err) { 
                            reject(err);
                        }
                        console.log(stdout);
                    });
                });
            }).catch(err => {
                console.log(err);
            }).then(function(){
                res.end();
            });
        });
    }
}).listen(process.env.PORT || 8000);