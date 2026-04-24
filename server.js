import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')
const port = Number(process.env.PORT || 3000)

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const type = mimeTypes[ext] || 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': type })
  fs.createReadStream(filePath).pipe(res)
}

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent((req.url || '/').split('?')[0])
  let filePath = path.join(distDir, pathname)

  if (pathname === '/') {
    filePath = path.join(distDir, 'index.html')
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return sendFile(res, filePath)
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const indexPath = path.join(filePath, 'index.html')
    if (fs.existsSync(indexPath)) return sendFile(res, indexPath)
  }

  return sendFile(res, path.join(distDir, 'index.html'))
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Bird migration MVP listening on http://0.0.0.0:${port}`)
})
