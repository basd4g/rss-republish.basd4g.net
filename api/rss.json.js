`use strict`
const Parser = require('rss-parser')
const parser = new Parser()

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
}

const handler = async (req, res) => {
  await (async ()=> {
    const feedQiita = await parser.parseURL('https://qiita.com/basd4g/feed.atom')
    const feedHugo = await parser.parseURL('https://memo.basd4g.net/posts/index.xml')
    const feedHatena = await parser.parseURL('https://basd4g.hatenablog.com/rss')
    const feeds = [...feedQiita.items, ...feedHugo.items, ...feedHatena.items].sort( (a,b) => (a.isoDate >= b.isoDate ? -1:1));

    res.status(200).json({feeds});
  })().catch(() =>  {
    res.status(500).json({feeds: [], error:e.toString()});
  });
}

module.exports = allowCors(handler);
