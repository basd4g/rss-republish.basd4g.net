`use strict`
const Parser = require('rss-parser')
const parser = new Parser()

module.exports = async (req, res) => {
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
