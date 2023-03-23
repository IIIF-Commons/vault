const IIIFVault = require('../dist/index.umd');

(async () => {
  const fetch = (await import('node-fetch')).default;

  const vault1 = new IIIFVault.Vault({
    customFetcher: (url) => {
      return fetch(url).then((r) => r.json());
    },
  });

  try {
    const manifest = await vault1.loadManifestObject('https://digirati-co-uk.github.io/wunder.json');
    console.log(manifest.items[0].label);
  } catch (e) {
    console.log('error loading from vault', e);
  }

  console.log(vault1);
})();
