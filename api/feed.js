const http = require('http');
const url = require('url');

// База поставщиков EasyDrop
const FEEDS = {
  '/feed1': 'https://easydrop.one/prom-export?key=00520101781761&pid=80547932074373',
  '/feed2': 'https://easydrop.one/prom-export?key=70419283037987&pid=80547932074373',
  '/feed3': 'https://easydrop.one/prom-export?key=11341144510008&pid=80547932074373'
};

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // По умолчанию (на главном адресе /) отдаётся 1-й поставщик
    let targetUrl = FEEDS['/feed1'];

    if (FEEDS[pathname]) {
      targetUrl = FEEDS[pathname];
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      res.writeHead(response.status, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(`Ошибка EasyDrop: ${response.statusText}`);
    }

    const xmlData = await response.text();
    res.writeHead(200, {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    });
    res.end(xmlData);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Ошибка прокси: ${error.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
