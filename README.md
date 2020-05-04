# setup-monodiff-action

GitHub action to setup [monodiff](https://github.com/orangain/monodiff).

## Example usage

Use latest version:

```yml
- uses: orangain/setup-monodiff-action@v1
```

Use specific version:

```yml
- uses: orangain/setup-monodiff-action@v1
  with:
    version: 0.1.0
```

## Inputs

### `version`

**Optional** Version of monodiff. Default: latest version.

## Development

See: https://help.github.com/en/actions/building-actions/creating-a-javascript-action

Setup depending libraries.

```
npm install
```

Run locally.

```
npm start
```

Build distribution file.

```
npm run build
```
