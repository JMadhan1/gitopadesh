// Local dev server: serves ./public and mounts api/*.js exactly like Vercel does.  `npm run dev`
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
if (existsSync(path.join(root, '.env'))) {
  for (const l of readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !l.trim().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json', '.css': 'text/css' };
const port = +process.env.PORT || 7860;

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith('/api/')) {
      const mod = await import(pathToFileURL(path.join(root, url.pathname + '.js')).href);
      const handler = mod[req.method];
      if (!handler) { res.writeHead(405); return res.end(); }
      const chunks = []; for await (const c of req) chunks.push(c);
      const ac = new AbortController(); res.on('close', () => ac.abort());
      const r = await handler(new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks), signal: ac.signal }));
      res.writeHead(r.status, Object.fromEntries(r.headers));
      if (r.body) for await (const c of r.body) res.write(c);
      return res.end();
    }
    let p = decodeURIComponent(url.pathname); if (p.endsWith('/')) p += 'index';
    let file = path.join(root, 'public', p);
    if (!file.startsWith(path.join(root, 'public'))) { res.writeHead(403); return res.end(); }
    if (!path.extname(file)) file += '.html';
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    res.writeHead(e.code === 'ENOENT' ? 404 : 500); res.end(e.code === 'ENOENT' ? 'Not found' : 'Error');
    if (e.code !== 'ENOENT') console.error(e.message);
  }
}).listen(port, '127.0.0.1', () => console.log(`Gitopadesh on http://localhost:${port}`));
