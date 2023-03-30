import {Request, Response} from "express";

export async function healthcheck(req: Request, res: Response)
{

    res.send("<!DOCTYPE html>\n" +
        "<html>\n" +
        "  <head>\n" +
        "    <title>Google Search</title>\n" +
        "    <style>\n" +
        "      body {\n" +
        "        background-color: #f0f0f0;\n" +
        "        font-family: Arial, sans-serif;\n" +
        "        text-align: center;\n" +
        "        margin-top: 50px;\n" +
        "      }\n" +
        "\n" +
        "      #logo {\n" +
        "        margin-bottom: 50px;\n" +
        "      }\n" +
        "\n" +
        "      form {\n" +
        "        display: inline-block;\n" +
        "        margin-bottom: 20px;\n" +
        "      }\n" +
        "\n" +
        "      input[type=\"text\"] {\n" +
        "        padding: 12px 20px;\n" +
        "        margin-right: 10px;\n" +
        "        border: none;\n" +
        "        border-radius: 24px;\n" +
        "        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);\n" +
        "        width: 400px;\n" +
        "      }\n" +
        "\n" +
        "      input[type=\"submit\"] {\n" +
        "        background-color: #4285f4;\n" +
        "        color: #fff;\n" +
        "        border: none;\n" +
        "        padding: 16px 32px;\n" +
        "        border-radius: 50px;\n" +
        "        font-size: 24px;\n" +
        "        font-weight: bold;\n" +
        "        cursor: pointer;\n" +
        "        transition: all 0.2s ease-in-out;\n" +
        "        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);\n" +
        "      }\n" +
        "\n" +
        "      input[type=\"submit\"]:hover {\n" +
        "        background-color: #3367d6;\n" +
        "      }\n" +
        "\n" +
        "      input[type=\"submit\"]:active {\n" +
        "        background-color: #1a5cb5;\n" +
        "        transform: translateY(-1px);\n" +
        "      }\n" +
        "\n" +
        "      #search-result {\n" +
        "        margin-top: 50px;\n" +
        "      }\n" +
        "    </style>\n" +
        "  </head>\n" +
        "  <body>\n" + "<script async src=\"https://cse.google.com/cse.js?cx=a043f4ca2e9e64856\">\n" +
        "</script>\n" +
        "<div class=\"gcse-search\"></div>" +
        "    <img id=\"logo\" src=\"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png\" alt=\"Google\">\n" +
        "    <form onsubmit=\"search(event)\">\n" +
        "      <input type=\"text\" name=\"q\" placeholder=\"Search\">\n" +
        "      <input type=\"submit\" value=\"Google Search\">\n" +
        "    </form>\n" +
        "    <div id=\"search-result\"></div>\n" +
        "    <script>\n" +
        "      function search(event) {\n" +
        "        event.preventDefault();\n" +
        "        const query = document.querySelector('input[name=\"q\"]').value;\n" +
        "        fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyCLXscYJ0lYvI3NZeQDvVUwI8aWpJ2lhJ4&cx=a043f4ca2e9e64856&q=${query}`)\n" +
        "          .then(response => response.json())\n" +
        "          .then(data => {\n" +
        "            const searchResult = document.getElementById('search-result');\n" +
        "            searchResult.innerHTML = '';\n" +
        "            data.items.forEach(item => {\n" +
        "              const div = document.createElement('div');\n" +
        "              const title = document.createElement('h3');\n" +
        "              const link = document.createElement('a');\n" +
        "              const snippet = document.createElement('p');\n" +
        "              title.innerText = item.title;\n" +
        "              link.innerText = item.link;\n" +
        "              link.href = item.link;\n" +
        "              link.target = '_blank';\n" +
        "              snippet.innerText = item.snippet;\n" +
        "              div.appendChild(title);\n" +
        "              div.appendChild(link);\n" +
        "              div.appendChild(snippet);\n" +
        "              searchResult.appendChild(div);\n" +
        "            });\n" +
        "          })\n" +
        "          .catch(error => console.error(error));\n" +
        "      }\n" +
        "    </script>\n" +
        "  </body>\n" +
        "</html>\n");
}