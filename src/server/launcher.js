var config,
    packageInfo = require('../package.json');

try {
    config = require('../config.json');
} catch (error) {
    config = {
        port: 8080,
        inspector: { enabled: false },
        bots: 0
    };
}

var server = new Server({ port: config.port, bots: config.bots });

if (config.inspector.enabled) {
    try {
      new Inspector(server, config.inspector);
    } catch (error) {
        console.error('Inspector error:', error);
    }
}

module.exports = server;
