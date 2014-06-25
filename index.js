var express = require("express");
var app = express();

app.engine("jade", require("jade").__express);
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.render("index.jade", {
    articles: articles(0, 5),
    next: 5,
    t: Number(req.query.t)
  });
});

app.get("/content", function (req, res) {
  setTimeout(function () {
    var start = Number(req.query.start) || 0;
    var limit = Number(req.query.limit) || 5;
    res.render("articles.jade", {
      articles: articles(start, limit),
      next: start + limit,
      t: Number(req.query.t)
    });
  }, Number(req.query.t));
});

app.get("/articles/:id", function (req, res) {
  res.render("article.jade", article(Number(req.params.id)));
});

function articles(start, limit) {
  var articles = [];
  for (var i = start; i < start + limit; i++) {
    articles.push(article(i));
  }
  return articles;
}

function article(i) {
  return {
    id: i,
    headline: "Artikel " + i
  };
}

app.listen(1337, function () {
  console.log("Listening on 1337");
});
