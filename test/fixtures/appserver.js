const url = require('url');

class AppServer {
  constructor(app) {
    this.host = app.get('host') || 'localhost';
    this.port = app.get('port') || 3030;
    this.server = app.listen(this.port);

    this.connections = [];
    this.server.on('connection', socket => this.connections.push(socket));
  }

  static create(app) {
    const appServer = new AppServer(app);

    return new Promise(resolve => {
      appServer.server.once('listening', () => {
        app.get('mongoClient').then(() => {
          resolve(appServer);
        });
      });
    });
  }

  stop() {
    return new Promise(resolve => {
      this.connections.forEach(socket => socket.destroy());
      this.server.close(resolve);
    });
  }

  getUrl(pathname) {
    return url.format({
      hostname: this.host,
      protocol: 'http',
      port: this.port,
      pathname
    });
  }
}

module.exports = AppServer;
