const crypto     = require('crypto');
const algorithm  = 'aes-256-ctr';
const passphrase = "3grkyLAesVwN5Kmpg3K3yrMXkruzi22Ck3uH2B3FSR9eXNsgbhWJm6VYzjVbwNHr";

class Crypto {
    static encrypt(text) {
        const cipher = crypto.createCipher(algorithm,passphrase)
        let crypted = cipher.update(text,'utf8','base64')
        crypted += cipher.final('base64');
        return crypted;
    }
    
    static decrypt(text) {
      const decipher = crypto.createDecipher(algorithm,passphrase)
      let dec = decipher.update(text,'base64','utf8')
      dec += decipher.final('utf8');
      return dec;
    }
}

module.exports = Crypto;

