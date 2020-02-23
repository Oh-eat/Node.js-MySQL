var http = require('http');
var path = require('path');
var qs = require('querystring');
var url = require('url');
var author = require('./lib/author.js')
var topic = require('./lib/topic.js')

var app = http.createServer((request, response) => {
    var _url = request.url;
    var pathname = url.parse(_url, true).pathname;
    var queryData = url.parse(_url, true).query;
    if (pathname === '/'){
      if (queryData.id === undefined){
        topic.home(request, response);
      } else {
        topic.detail(request, response);
      };
    } else if (pathname === '/create'){
      topic.create(request, response);
    } else if (pathname === '/create_process'){
      topic.create_process(request, response);
    } else if (pathname === '/update'){
      topic.update(request, response);
    } else if (pathname === '/update_process'){
      topic.update_process(request, response);
    } else if (pathname === '/delete_process'){
      topic.delete_process(request, response);
    } else if (pathname === '/author'){
      author.home(request, response);
    } else if (pathname === '/author/create_process'){
      author.create_process(request, response);
    } else if (pathname === '/author/update'){
      author.update(request, response);
    } else if (pathname === '/author/update_process'){
      author.update_process(request, response);
    } else if (pathname === '/author/delete_process'){
      author.delete_process(request, response);
    } else if (pathname === '/author/topics'){
      author.topics(request, response);
    } else {
      topic.not_found();
    };
});
app.listen(3000);
