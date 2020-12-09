# Shrug
<p align="center">
<a href="http://shrug.ir"><img src="./client/public/images/shrug-ir.png" alt="shrug.ir"/></a>
</p>

Shrug is a fast & open source link shortner writen with Golang and React.JS. For demo check [shrug.ir](http://shrug.ir)

## Installation

Copy `.env.example` to `.env` fill dbs credentials

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

### Deployment
By `docker-compose up -d` the project will be up on port `80` which you can change it on `docker-compose.yml`.

### Screnshots
<p align="center">
<img style="max-width:500px; display: block;" src="./screenshots/1.png" alt="shrug.ir"/>
<br/>
<img style="max-width:500px; display: block;" src="./screenshots/2.png" alt="shrug.ir"/>
</p> 


## License

This software is released under the [MIT](https://github.com/TheYahya/shrug/blob/master/LICENSE) License.
