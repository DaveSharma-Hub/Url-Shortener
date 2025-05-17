# URL-Shortener

## Requirements

1) Able to input a long URL and shorten to a unique URL
2) Redrict shortened URL to the initial URL
3) Analytics to track information about the URLs

## Endpoints

POST: /api/urls/shorten
    body:
    {shortUrl: "shortUrl" }

GET: /api/urls/{shortUrl}
    redirects to longUrl


