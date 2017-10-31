const sqlite = require('./modules/db.js'),
    db       = sqlite.init('./db/yodobashi.sqlite3')
    crypto   = require('./modules/crypto.js');
    
let parameters = process.argv.filter(argv => {
    return argv.indexOf('=') >= 0;
}).reduce((o, c) => {
    if(typeof o === "string") {
        o = o.replace(/^--/g , "").split("=");
        o = {[o[0]]: o[1]};
    }
    c = c.replace(/^--/g , "").split("=");
    c = {[c[0]]: c[1]};

    return Object.assign(o, c);
});

db.serialize(function() {
    db.run("CREATE TABLE users (id integer primary key, mail text, password text, security_code text, receipt_name text, site text)");

    db.run("INSERT INTO users (id, mail, password, security_code, receipt_name, site) VALUES ($i, $m, $p, $s, $r, $st)", 
    {
        $i:1,
        $m: parameters.mail,
        $p: crypto.encrypt(parameters.password),
        $s: crypto.encrypt(parameters.securityCode),
        $r: parameters.receiptName,
        $st: parameters.site
    });
});

db.close();
