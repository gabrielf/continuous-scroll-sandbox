window.onscroll = loadMore;
window.onload = loadMore;
window.onresize = loadMore;

function loadMore() {
  var autoLoadingElements = document.querySelectorAll("*[data-more-url]");
  for (var i = 0; i < autoLoadingElements.length; i++) {
    if (nearWindowEdge(autoLoadingElements[i])) {
      loadMoreContent(autoLoadingElements[i]);
    }
  }
}

var NEAR_DISTANCE = 0;

function nearWindowEdge(element) {
  var windowBottom = window.pageYOffset + window.innerHeight - 500;
  var loadAtY = element.offsetTop - NEAR_DISTANCE;

  return windowBottom > loadAtY;
}

function loadMoreContent(element) {
  var loader = document.createElement("img");
  loader.src = "/img/ajax-loader.gif";

  var moreUrl = element.getAttribute("data-more-url");
  element.removeAttribute("data-more-url");
  element.appendChild(loader);
  get(moreUrl, function (data) {
    element.innerHTML = data;
  });
}

function get(url, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onload = function () {
    if (this.status === 200) {
      callback(this.response);
    } else {
      console.error("non 200 response", this);
    }
  };
  request.onerror = function (e) {
    console.error(e);
  };
  request.send();
}