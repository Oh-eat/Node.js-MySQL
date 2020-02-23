module.exports = {
  HTML: function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  }, list: function(posts){
    var list = '<ul>';
    for (var index in posts){
      list += `<li><a href="/?id=${posts[index].id}">${posts[index].title}</a></li>\n`
    };
    list += '</ul>';
    return list;
  }, author_cmbbox: (authors, selected) => {
    var choices = '';
    for (var index in authors){
      if (authors[index].id === selected){
        choices += `<option value="${authors[index].id}" selected>${authors[index].name}</option>`
      } else{
        choices += `<option value="${authors[index].id}">${authors[index].name}</option>`
      };
    }
    return '<select name="author_id">' + choices + '</select>';
  }, author_table: (authors) => {
    var table =
    `
      <style>
      table {
        border-collapse: collapse;
      }

      td {
        border: 1px solid black;
      }
      </style>
      <tr>
        <td>name</td
        ><td>profile</td>
        <td>topics</td>
        <td>update</td>
        <td>delete</td>
      </tr>
    `;
    for (var index in authors){
      table += `<tr>`
      table += `<td>${authors[index].name}</td>`
      table += `<td>${authors[index].profile}</td>`
      table += `<td><a href="/author/topics?id=${authors[index].id}">show</a></td>`
      table += `<td><a href="/author/update?id=${authors[index].id}">update</a></td>`
      table += `<td><form action="/author/delete_process" method="post"><input type="hidden" name="id" value="${authors[index].id}"><input type="submit" value="delete"></form></td>`
      table += `</tr>`
    }
    return '<table>' + table + '</table>';
  }, author_topics: (topics) => {
    if (topics.length !== 0){
      var result = '';
      for (var index in topics){
        result += `<li><a href="/?id=${topics[index].id}">${topics[index].title}</a><p>${topics[index].created}</p></li>`;
      }
      return '<ol>' + result + '</ol>'
    } else {
      return '<ul><li>No Topics</li></ul>'
    };
  }
};
