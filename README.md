# lightning

> Lightning fast URL shortener

## Installation

```sh
git clone https://github.com/ShaunLWM/lightning
cd lightning
yarn/npm install
```

## Configuration
```
db.json is the file where all the data resides
Port used is 8081
```

## Usage
```
http://<ip>:8081/s/<url>  - sets a new url to shorten. Returns the shortened id
http://<ip>:8081/g/<id>  - expand the id and gets redirected to url
http://<ip>:8081/i/<id>  - shows analytics about the shortened id
```

## Credits
- [thedevs-network/kutt](https://github.com/thedevs-network/kutt) for [analytics](https://github.com/thedevs-network/kutt/blob/develop/server/controllers/urlController.js#L108) component

## License

MIT - [ShaunLWM](https://github.com/ShaunLWM)