const http = require("http")

const fs = require("fs").promises

const host = process.env["HOST"] || "localhost"
const port = 3000

const extensionsContentTypes = {
  js: "text/javascript",
  html: "text/html",
}

const listener = (req, res) => {
  const urlElements = req.url.split("/")

  const file = urlElements[urlElements.length - 1] || "index.html"

  const extensionSeparatorIndex = file.lastIndexOf(".")

  const extension = extensionSeparatorIndex
    ? file.slice(extensionSeparatorIndex + 1)
    : "html"

  fs.readFile(`${__dirname}/${file}`)
    .then((contents) => {
      res.setHeader("Content-Type", extensionsContentTypes[extension])
      res.writeHead(200)
      res.end(contents)
    })
    .catch((e) => {
      console.log(e)
      res.writeHead(500)

      res.end()
      return
    })
}

const server = http.createServer(listener)

server.listen(port, host, (e) => {
  console.log(`server listening: ${e}`)
})
