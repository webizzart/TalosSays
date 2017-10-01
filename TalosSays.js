// vim: set tabstop=3:
// Set this to your web/email server hostname
var hostname = 'myhost.example.com';

// No changes needed beyond this point
var host = 'https://www.talosintelligence.com';
var doc  = 'reputation_center/lookup?search=' + hostname;
var page = require('webpage').create();

// Error handler - log errros not caught by any page handler.
// See: http://phantomjs.org/api/phantom/handler/on-error.html
page.onError = function(msg, trace) {
	console.log(msg);
	trace.forEach(function(item) {
		console.log('  ', item.file, ':', item.line);
	});
	phantom.exit();
};

// Begin
page.open(host + '/' + doc, function(status) {
	if (status !== 'success') {
		console.log('Unable to connect to Talos');
	} else {
		var ua = page.evaluate(function() {
			var content = [];
			// Forward/Reverse DNS item
			elem = document.getElementsByClassName('dns-cell');
			if (elem.length > 0) {
				content.push(elem[0].textContent);
			} else {
				content.push('n/a');
			}
			// Blackisted item
			elem = document.getElementsByClassName('tl-bl');
			if (elem.length > 0) {
				content.push(elem[0].textContent);
			} else {
				content.push('n/a');
			}
			// Email reputation item
			['Poor', 'Neutral', 'Good'].forEach(function(item) {
				elem = document.getElementsByClassName('rep-' + item);
				if (elem.length > 0) {content.push(elem[0].textContent);}
			});
			while (content.length < 3) {
				content.push('n/a');
			}
			return content;
		});
		console.log('Hostname:             ' + hostname);
		console.log('Forward/Reverse DNS:  ' + ua[0]);
		console.log('Blacklisted:          ' + ua[1]);
		console.log('Email Reputation:     ' + ua[2]);
	}
	phantom.exit();
});
