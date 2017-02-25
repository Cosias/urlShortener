# Url Shortener

* User can pass a URL as a parameter and will receive a shortened URL in the JSON response.

* If a user passes an invalid URL that doesn't follow the valid ```http://www.example.com format,``` the JSON response will contain an error instead.

* When a user visits a shortened URL, it will redirect them to the original link.

## Example Usage
  ```
  https://urlbite.herokuapp.com/new/http://www.Google.com  
  ```

## Example Output

  ```
  {"url":"http://www.Google.com","shortUrl":"localhost:3000/SyhGGKpYx"}
  ```
  
### Live Site
  https://urlbite.herokuapp.com/
