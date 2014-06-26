var express = require("express");
var app = express();
var dimsum = require("dimsum");

app.engine("jade", require("jade").__express);
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  setTimeout(function () {
    var start = Number(req.query.start) || 0;
    var end = Number(req.query.end) || 5;
    var template = req.xhr ? "articles.jade" : "index.jade";
    res.render(template, {
      articles: articles(start, end),
      next: end,
      t: Number(req.query.t)
    });
  }, Number(req.query.t));
});

app.get("/articles/:id", function (req, res) {
  res.render("article.jade", article(Number(req.params.id)));
});

function articles(start, end) {
  var articles = [];
  for (var i = start; i < end; i++) {
    articles.push(article(i));
  }
  return articles;
}

function article(i) {
  return {
    id: i,
    headline: "Artikel " + i,
    preamble: dimsum()
  };
}

app.listen(1337, function () {
  console.log("Listening on 1337");
});
