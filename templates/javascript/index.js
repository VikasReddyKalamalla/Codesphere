const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CodeSphere Web Practice</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; border: 1px solid #334155; }
          h1 { color: #38bdf8; margin-bottom: 0.5rem; }
          p { color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>⚡ CodeSphere Live Preview Working!</h1>
          <p>Your web application is running on port ${PORT}.</p>
        </div>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
