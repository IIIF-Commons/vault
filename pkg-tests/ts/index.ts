import { Vault } from '@iiif/vault';
import { BatchAction } from '@iiif/vault/actions';

const vault = new Vault();

vault.loadManifest('').then((manifest) => {
  const canvas = vault.get(manifest.items[0]);

  const label = canvas.label;
});
