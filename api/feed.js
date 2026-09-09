export default async function handler(req, res) {
  const targetUrl = "https://easydrop.one/prom-export?key=00520101781761&pid=80547932074373";

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(`Ошибка EasyDrop: ${response.statusText}`);
    }

    const xmlData = await response.text();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    return res.status(200).send(xmlData);
  } catch (error) {
    return res.status(500).send(`Ошибка прокси: ${error.message}`);
  }
}
