const request = require('request')
   ,iconv  = require('iconv-lite')

request('http://tieba.baidu.com/f/search/res?ie=utf-8&qw=%E9%BB%91%E8%89%B2%E5%AD%A4%E5%84%BF%20pan.baidu', (err, res, body) => {
  if (err) { return console.log(err); }
  
  console.log(body);

//   console.log(body.explanation);
});
