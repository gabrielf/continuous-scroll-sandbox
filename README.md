Continuous Scroll Sandbox
=========================

Minimal Node.js application that demonstrates continuous scroll for an old school (multi page) web app with a main page
containing multiple columns and basic back button support.

Run:

    $ npm install
    $ node .

And visit <http://localhost:1337>

Notice how more articles are loaded as you scroll and that you can click links to view articles and then go back to the
correct scroll position on the main page.


Overview
--------

Continuous scrolling can be tricky:

* How do one make the back button go back to the position that was scrolled to?
* How do one handle multiple columns?
* How do one handle when new content has been added to the columns between the asynchronous ajax requests?

This example project presents a solution to the first two problems.


Implementation notes
--------------------

The application has two routes /, which renders a complete page with data in two columns, and /articles/:id, which
renders a single article. The / route can also render just a slice of contents of a single column for ajax requests
(when the header X-Requested-With is set to XMLHttpRequest).

For example this will load article 10 of the second column:

    $ curl -H "X-Requested-With: XMLHttpRequest" "localhost:1337/?asidestart=10&asideend=11"

Each column ends with a div element that contains information in data attributes how far the column has been loaded and
an url where more content can be fetched.

A client side javascript listens for scroll events and measure the distance to this div and when some threshold is
passed, loads more content from the "data-more-url". The threshold is set to be visible on screen for demonstration 
purposes but should obviously be one or two viewport height's below the current scroll position so that the async
loading is never visible.

Once new data has arrived (the ajax request's success handler) the HTML5 history API is used to record the new current
position. This is done using history.replaceState(...) instead of history.pushState(...) since we are not interested
in being able to go back to a previous scroll position within the page.

The state object is not used. Instead the solution relies on the browser using the set, full url, and load this on
back/forward navigations. This is suitable to multi page web apps but probably not for single page applications where
the state object could be used for finer grained control back/forward support (which is out of scope for this example).


TODO
----

The main drawback to the approach in this example (in my view) is that the client side javascript has to do url
manipulation in order to get the full url used for back button support.

There are many possible solution to this problem:

1) Let the columns contain complete query string fragments that the client side script can more easily combine. This
   would push more logic to the server side and would most likely make the solution less fragile when code is changed.
2) Remember only the state for the main column and let the side column load either in its entirety or in chunks until
   it has reached the threshold. A nifty algorithm could be used to estimate how many items should be loaded at once to
   minimize the number of round-trips required to load enough of the second column to fill the user visible viewport.

In applications where there is an obvious main column I am leaning towards the second solution. For other applications
the first one could work.