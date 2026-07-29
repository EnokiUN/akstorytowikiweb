# akstorytowikiweb

A web version of [akstorytowiki](https://github.com/EnokiUN/akstorytowiki).

## Updating akstorytowiki

To update the used akstorytowiki version, simply run the following:

```sh
cargo update akstorytowiki && deno run wasmbuild && deno --allow-all build.ts
```

Then commit and push.
