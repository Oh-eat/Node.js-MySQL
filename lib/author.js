var path = require('path');
var qs = require('querystring');
var url = require('url');
var db = require('./db.js');
var template = require('./template.js');

exports.home = (request, response) => {
  db.query('select id, title from topic', (error1, posts, fields) => {
    if (error1){
      throw error1;
    };
    db.query('select * from author', (error2, authors, fields) => {
      if (error2){
        throw error2;
      };
      var title = 'Author';
      var list = template.list(posts);
      var author_table = template.author_table(authors);
      var author_create =
      `
        <form action="/author/create_process" method="post">
          <p>
            <input type="text" name="name" placeholder="name">
          </p>
          <p>
            <textarea name="profile" placeholder="profile"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `;
      var description =
      `
        <h2>Author List</h2>
        ${author_table}
        ${author_create}
      `;
      var html = template.HTML(title, list, description, '');
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = (request, response) => {
  var author_data = ''
  request.on('data', (data) => {
    author_data += data;
  });
  request.on('end', () => {
    var author = qs.parse(author_data);
    var name = author.name;
    var profile = author.profile;
    db.query('insert into author (name, profile) values (?, ?)', [name, profile], (error, author, fields) => {
      if (error){
        throw error;
      };
      response.writeHead(302, {Location: '/author'});
      response.end();
    });
  });
};

exports.update = (request, response) => {
  var id = url.parse(request.url, true).query.id;
  db.query('select id, title from topic', (error1, posts, fields) => {
    if (error1){
      throw error1;
    }
    db.query('select * from author where id = ?', [id], (error2, author, fields) => {
      if (error2){
        throw error2;
      };
      var title = 'New Author';
      var list = template.list(posts);
      var name = author[0].name;
      var profile = author[0].profile;
      var author_create =
      `
        <form action="/author/update_process" method="post">
          <input type="hidden" name="id" value="${id}"
          <p>
            <input type="text" name="name" placeholder="name" value="${name}">
          </p>
          <p>
            <textarea name="profile" placeholder="profile">${profile}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `;
      var description =
      `
        <h2>Update ${name}</h2>
        ${author_create}
      `;
      var html = template.HTML(title, list, description, '');
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.update_process = (request, response) => {
  var author_data = ''
  request.on('data', (data) => {
    author_data += data;
  });
  request.on('end', () => {
    var author = qs.parse(author_data);
    var id = author.id
    var name = author.name;
    var profile = author.profile;
    db.query('update author set name = ?, profile = ? where id = ?', [name, profile, id], (error, author, fields) => {
      if (error){
        throw error;
      };
      response.writeHead(302, {Location: '/author'});
      response.end();
    });
  });
};

exports.delete_process = (request, response) => {
  var author_data = ''
  request.on('data', (data) => {
    author_data += data;
  });
  request.on('end', () => {
    var author = qs.parse(author_data);
    var id = author.id
    db.query('delete from author where id = ?', [id], (error, author, fields) => {
      if (error){
        throw error;
      };
      response.writeHead(302, {Location: '/author'});
      response.end();
    });
  });
};

exports.topics = (request, response) => {
  var id = url.parse(request.url, true).query.id;
  db.query('select id, title from topic', (error1, posts, fields) => {
    if (error1){
      throw error1;
    }
    db.query('select name from author where id = ?', [id], (error2, author, fields) => {
      if (error2){
        throw error2;
      }
      db.query('select * from topic where author_id = ?', [id], (error3, topics, fields) => {
        if (error3){
          throw error3;
        };
        var title = 'Topics';
        var list = template.list(posts);
        var name = author[0].name;
        var author_topics = template.author_topics(topics);
        var description =
        `
        <h2>Topics of ${name}</h2>
        ${author_topics}
        `;
        var html = template.HTML(title, list, description, '');
        response.writeHead(200);
        response.end(html);
    })
    });
  });
}
