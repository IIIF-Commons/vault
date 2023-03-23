const { globalVault, Vault } = require('@iiif/vault');

(async () => {
  const fetch = (await import('node-fetch')).default;

  const vault1 = globalVault();
  const vault2 = new Vault({
    customFetcher: (url) => {
      return fetch(url).then((r) => r.json());
    },
  });

  try {
    await vault1.loadManifest('https://digirati-co-uk.github.io/wunder.json');
  } catch (e) {
    console.log('error loading from globalVault()', e);
  }

  try {
    await vault2.loadManifest('https://digirati-co-uk.github.io/wunder.json');
  } catch (e) {
    console.log('error loading from new Vault()', e);
  }

  console.log(vault1);
})();
