# Background

I created this site because Amtrak makes the process of viewing fares
over a period of time incredibly tedious. Unlike virtually every other
major transportation company, Amtrak does not provide a calendar view
of fares to compare prices across a range of dates. Online, you can
find countless threads discussing this same limitation of Amtrak's
website. This problem was the catalyst for Amsnag&mdash;a now defunct
Amtrak scraping service. The service stopped working after Amtrak
updated their website to the more complex, Javascript-heavy site it is
today. My goal when developing this site was to restore as much of
Amsnag's original functionality as possible.

# Development

In order to understand what made the development of this site so
difficult, you need to understand how the internet has changed since
the days of Amsnag. Websites used to be mostly-static pages with
hardcoded HTML and CSS returned from an HTTP request. A service like
Amsnag worked so well because information could be scraped simply by
mimicking a browser with manual HTTP requests; all the information you
needed was right there in the returned HTML.

Now, the overwhelming majority of modern websites generate content
dynamically (including this site). A simple HTTP request is no longer
sufficient for scraping these heavy sites, as Javascript code must run
asynchronously to load the page contents. Therefore, the only reliable
way to navigate and scrape these websites is through a browser. I
chose the browser automation package Selenium for this project.

I quickly learned why Amsnag had not yet been replaced&mdash;Amtrak
utilizes an advanced bot-detection algorithm that makes automated fare
scraping exceedingly difficult. In addition to the Javascript running
to load the page, Amtrak runs code that monitors your mouse movements
and interaction patterns to filter out suspected automated activity. I
tried for weeks to get around this algorithm to no avail. No matter
how random and human-like I programmed my script to act, with a large
enough dataset Amtrak could successfully flag my activity as
automated.

![](https://github.com/tikkisean/rail-for-less/blob/main/client/public/images/reCAPTCHA.png)

I realized short of developing an AI-trained algorithm, there was no
way to reliably scrape this data from Amtrak's site. I shifted focus
from programming a human-like script to anonymizing my requests. This
website exploits the weakness that Amtrak needs at least a few
requests to develop a pattern of automated activity. Using a paid
proxy service, I can mask the IP of incoming requests at a regular
interval. **Running a real browser and funneling requests through a proxy slows
down the scraping process considerably, but is the only way to get
fares at scale without detection**.

![](https://github.com/tikkisean/rail-for-less/blob/main/client/public/images/demo.gif)

# About me

My name is [Sean Eddy](https://seaneddy.com/)—I am currently a sophomore at
the University of Arizona pursuing a B.S. and ultimately a M.S. in Computer
Science with a minor in entrepreneurship and innovation. This project is my
first dynamic website; reach out to me at sean@railforless.us to report any
bugs or feature requests. Like the site? Donate on my [Buy Me a Coffee](https://www.buymeacoffee.com/seaneddy)
page. Proxies, web hosting, and domain
registration don't pay for themselves!
