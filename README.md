# setup-monodiff-action

GitHub action to setup [monodiff](https://github.com/orangain/monodiff).

## Example usage

```yml
uses: orangain/setup-monodiff-action@v1
```

## Inputs

### `version`

**Optional** Version of monodiff. Default `"0.0.1"`.

### `arch`

**Optional** Target architecture of monodiff binary. Default `"linux_x86_64"`.

## Develop

See: https://help.github.com/en/actions/building-actions/creating-a-javascript-action

Setup ncc.

```
npm install
```

Build distribution file.

```
npm run build
```
