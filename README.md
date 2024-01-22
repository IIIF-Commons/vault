# [Vault has moved to IIIF Helpers → ](https://github.com/iiif-commons/iiif-helpers)

Installation:
```bash
npm i @iiif/helpers
```

Usage:
```js
import { Vault } from '@iiif/helpers/vault';

const vault = new Vault();

const manifest = await vault.load('https://example.org/manifest')
```
