var casper = require("casper").create();
var config = require('./config/yodobashi');

var url = casper.cli.args[0];

casper.start();
casper.open("https://order.yodobashi.com/yc/login/index.html?returnUrl=http%3A%2F%2Fwww.yodobashi.com%2F&_ga=2.90360538.1383216077.1508980780-1172255256.1508980780");

casper.then(function() {
  this.evaluate(function(config) {
    document.querySelector("#memberId").value = config.id;
    document.querySelector("#password").value = config.password;
    document.querySelector("#js_i_login0").click();
  }, config);
});

// 商品詳細
casper.then(function() {
  console.log('商品詳細');
	this.thenOpen(url, function(){
		casper.wait(1000,function() {
			this.click('#js_m_submitRelated');
		});
	}, true); 
});

// カート画面
casper.then(function() {
  console.log('カート画面');
  this.thenOpen('https://order.yodobashi.com/yc/shoppingcart/index.html', function(){
  	this.click('#sc_i_buy');
  });
});

casper.then(function() {
	this.click('#js_i_receiptReceive');
  this.wait(1000, function() {
    casper.sendKeys('#receiptName', config.receiptName);
    casper.sendKeys('.js_c_securityCode', config.securityCode);
    this.click('.js_c_order');
  });
});

casper.then(function() {})

casper.run();