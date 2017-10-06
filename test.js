// import fetch from 'node-fetch';
// or
const fetch = require('node-fetch');

// if you are using your own Promise library, set it through fetch.Promise. Eg.

// import Bluebird from 'bluebird';
// fetch.Promise = Bluebird;

// plain text or html

fetch('http://www.diaosisou.org/list/%E7%BE%9E%E7%BE%9E%E7%9A%84%E9%93%81%E6%8B%B3/1')
	.then(res => res.text())
	.then(body => console.log(body));