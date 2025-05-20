export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);

  // Прокси на https://info-sky.blockanalitica.com + оригинальный путь и параметры
  const targetUrl = 'https://info-sky.blockanalitica.com' + url.pathname + url.search;

  const init = {
    method: req.method,
    headers: {
      ...Object.fromEntries(req.headers),
      origin: 'https://blockanalitica.com',
      referer: 'https://blockanalitica.com',
      host: 'blockanalitica.com',
    }
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
  }

  try {
    const response = await fetch(targetUrl, init);

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');
    responseHeaders.delete('transfer-encoding');

    const responseBody = await response.arrayBuffer();

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
