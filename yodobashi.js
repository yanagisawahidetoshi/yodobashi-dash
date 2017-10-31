var casper = require("casper").create();
var config = require('./config/yodobashi');

var params = JSON.parse(casper.cli.args[0]);

casper.start();
casper.open("https://order.yodobashi.com/yc/login/index.html?returnUrl=http%3A%2F%2Fwww.yodobashi.com%2F&_ga=2.90360538.1383216077.1508980780-1172255256.1508980780");

casper.then(function() {
  this.evaluate(function(params) {
    document.querySelector("#memberId").value = params.mail;
    document.querySelector("#password").value = params.password;
    document.querySelector("#js_i_login0").click();
  }, params);
});

// 商品詳細
casper.then(function() {
  console.log('商品詳細');
	this.thenOpen(params.url, function(){
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
    casper.sendKeys('#receiptName', params.receipt_name);
    casper.sendKeys('.js_c_securityCode', params.security_code);
    this.click('.js_c_order');
  });
});

casper.then(function() {})

casper.run();