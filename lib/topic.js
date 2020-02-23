var path = require('path');
var qs = require('querystring');
var url = require('url');
var db = require('./db.js');
var template = require('./template.js');

exports.home = (request, response) => {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query('select id, title from topic', (error, posts, fields) => {
    if (error){
      throw error;
    };
    var title = 'Welcome';
    var list = template.list(posts);
    var description = '<h2>Welcome</h2><p>Node.js & MySQL</p>'
    var html = template.HTML(title, list, description, `<a href='/create'>create</a>`)
    response.writeHead(200);
    response.end(html);
  });
};

exports.detail = (request, response) => {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`select id, title from topic`, (error1, posts, fields) => {
    if (error1){
      throw error1;
    };
    db.query(`select * from topic left join author on topic.author_id = author.id where topic.id = ?`, [queryData.id], (error2, post, fields) => {
      if (error2){
        throw error2;
      };
      var post = post[0]
      var title = post.title;
      var description = post.description;
      var list = template.list(posts);
      var author = post.name;
      var created = post.created;
      var html = template.HTML(title, list,
        `<h2>${title}</h2><p>by ${author}</p><p>${created}</p><p>${description}</p>`,
        ` <a href="/create">create</a>
        <a href="/update?id=${queryData.id}">update</a>
        <form action="delete_process" method="post">
        <input type="hidden" name="id" value="${queryData.id}">
        <input type="submit" value="delete">
        </form>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.create = (request, response) => {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query('select id, title from topic', (error, posts, fields) => {
    db.query('select * from author', (error, authors, fields) => {
      if (error){
        throw error;
      };
      var title = 'WEB - create';
      var list = template.list(posts);
      var author_cmbbox = template.author_cmbbox(authors);
      var html = template.HTML(title, list, `
        <form action="/create_process" method="post">
          <p>
            <input type="text" name="title" placeholder="title">
          </p>
          <p>
            ${author_cmbbox}
          </p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `, '');
        response.writeHead(200);
        response.end(html);
    })
  });
}

exports.create_process = (request, response) => {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var body = '';
  request.on('data', (data) => {
      body = body + data;
  });
  request.on('end', () => {
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;
    var author_id = post.author_id;
    db.query(`insert into topic (title, description, created, author_id) values (?, ?, now(), ?)`, [title, description, author_id], (error, post, fields) => {
      if (error){
        throw error;
      };
      response.writeHead(302, {Location: `/?id=${post.insertId}`});
      response.end();
    });
  });
}

exports.update = (request, response) => {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var id = queryData.id;
  db.query('select id, title from topic', (error1, posts, fields) => {
    if (error1){
      throw error1;
    };
    db.query('select * from topic where id = ?', [id], (error2, post, fields) => {
      if (error2){
        throw error2;
      };
      db.query('select * from author', (error3, authors, fields) => {
        if (error3){
          throw error3;
        }
        var title = post[0].title;
        var description = post[0].description;
        var author_id = post[0].author_id;
        var list = template.list(posts);
        var author_cmbbox = template.author_cmbbox(authors, author_id);
        var html = template.HTML(title, list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${id}">
            <p>
              <input type="text" name="title" placeholder="title" value="${title}">
            </p>
            <p>
              ${author_cmbbox}
            </p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${id}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      })
    });
  });
}

exports.update_process = (request, response) => {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    var id = post.id;
    var title = post.title;
    var description = post.description;
    var author_id = post.author_id;
    db.query('update topic set title = ?, description = ?, author_id = ? where id = ?', [title, description, author_id, id], (error, post, fields) => {
      if (error){
        throw error;
      };
      response.writeHead(302, {Location: `/?id=${id}`});
      response.end()
    });
  });
}

exports.delete_process = (request, response) => {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    var id = post.id;
    db.query('delete from topic where id = ?', [id], (error, post, fields) => {
      if (error){
        throw error;
      };
      response.writeHead(302, {Location: `/`});
      response.end()
    });
  });
}

exports.not_found = () => {
  response.writeHead(404);
  response.end('Not found');
}
