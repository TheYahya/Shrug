# Shrug
<p align="center">
<a href="http://shrug.ir"><img src="./screenshots/logo.png" alt="shrug.ir"/></a>
</p>

Shrug is a fast & open source link shortner writen with Golang and React.JS. For demo check [shrug.ir](http://shrug.ir)

## Installation

Copy `.env.example` to `.env` fill dbs credentials

Also you need download `IP2LOCATION-LITE-DB11.BIN` and copy it in `server/files/` directory; The database will be updated in monthly basis for the greater accuracy. Free LITE databases are available at https://lite.ip2location.com/ upon registration

### Develpment

```bash
# First create & up postgres and redis
# If you have docker/docker-compose installed on your machine
# You can run them simply by 
# Which will expose postgres port on: 1581 and redis port on: 6379
make dc-dbs-dev

# Runing server, By default on port 8000
make run-server

# Install client dependencies
make install-client

# Runing client, By default on port 8080
make run-client
```
Then you're development version will be up and runing on `localhost:8080`.

### Docker
By `docker-compose up -d` the project will be up on port `80` which you can change it on `docker-compose.yml`.

## Contributing
You can fork the repository, improve or fix some part of it and then send a pull requests. Or simply open and issue if there's a bug or you have a feature in mind.

## License

This software is released under the [MIT](https://github.com/TheYahya/shrug/blob/master/LICENSE) License.
