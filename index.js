var express = require("express");
var app = express();
var dimsum = require("dimsum");
var querystring = require("querystring");

var randomText = [];

for (var i = 0; i < 10; i++) {
  randomText[i] = dimsum();
}

app.engine("jade", require("jade").__express);
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  setTimeout(function () {
    var mainStart = Number(req.query.mainstart) || 0;
    var mainEnd = Number(req.query.mainend) || 5;
    var mainArticles = articlesSet("main", mainStart, mainEnd);

    var asideStart = Number(req.query.asidestart) || 0;
    var asideEnd = Number(req.query.asideend) || 5;
    var asideArticles = articlesSet("aside", asideStart, asideEnd);

    var template = req.xhr ? "articles.jade" : "index.jade";
    res.render(template, {
      mainArticles: mainArticles,
      asideArticles: asideArticles,
      articles: mainEnd > asideEnd ? mainArticles : asideArticles,
      t: Number(req.query.t)
    });
  }, Number(req.query.t));
});

app.get("/articles/:id", function (req, res) {
  res.render("article.jade", article(Number(req.params.id)));
});

function articlesSet(name, start, end) {
  return {
    name: name,
    articles: articles(start, end),
    end: end,
    moreUrl: moreUrl(name, start, end)
  }
}

function moreUrl(name, start, end) {
  var params = {};
  params[name + "start"] = end;
  params[name + "end"] = end + 5;
  return "/?" + querystring.stringify(params);
}

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
    preamble: preamble(i)
  };
}

function preamble(i) {
  return randomText[i % randomText.length];
}

app.listen(1337, function () {
  console.log("Listening on 1337");
});
