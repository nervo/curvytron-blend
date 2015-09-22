/**
 * Inspector
 *
 * @param {Server} server
 * @param {Object} config
 */
function Inspector (server, config)
{
    this.server = server;
    this.client = influx({
        host: config.host,
        username: config.username,
        password: config.password,
        database: config.database
    });
    this.tags = {env: 'dev'};

    this.trackers = new Collection();

    console.info('Inspector activated on %s', config.host);

    this.onClientOpen    = this.onClientOpen.bind(this);
    this.onClientClose   = this.onClientClose.bind(this);
    this.onClientLatency = this.onClientLatency.bind(this);
    this.onGameFPS       = this.onGameFPS.bind(this);
    this.onGameTickrate  = this.onGameTickrate.bind(this);
    this.onLog           = this.onLog.bind(this);
    this.logUsage        = this.logUsage.bind(this);

    this.server.on('client', this.onClientOpen);
    this.server.controller.game.fps.on('fps', this.onGameFPS);
    this.server.controller.ticker.fps.on('fps', this.onGameTickrate);

    this.set(this.CLIENTS, this.server.clients.count());

    this.logInterval = setInterval(this.onLog, this.logFrequency);
}

Inspector.prototype.CLIENTS        = 'client.total';
Inspector.prototype.CLIENT_LATENCY = 'client.latency';
Inspector.prototype.GAME_FPS       = 'game.fps';
Inspector.prototype.GAME_TICKRATE  = 'game.tickrate';
Inspector.prototype.USAGE_MEMORY   = 'usage.memory';
Inspector.prototype.USAGE_CPU      = 'usage.cpu';

/**
 * Usage log frequency
 *
 * @type {Number}
 */
Inspector.prototype.logFrequency = 1000;

/**
 * On client open
 *
 * @param {SocketClient} client
 */
Inspector.prototype.onClientOpen = function(client)
{
    var tracker = new ClientTracker(client);

    this.trackers.add(tracker);

    tracker.on('latency', this.onClientLatency);
    client.on('close', this.onClientClose);

    this.set(this.CLIENTS, this.server.clients.count());
};

/**
 * On client close
 *
 * @param {SocketClient} client
 */
Inspector.prototype.onClientClose = function(client)
{
    var tracker = this.trackers.getById(client.id);

    this.set(this.CLIENTS, this.server.clients.count());

    if (tracker) {
        client.removeListener('close', this.onClientClose);
        tracker.removeListener('latency', this.onClientLatency);
        this.set(this.CLIENT, tracker.getValues(), tracker.getTags());
        this.trackers.remove(tracker.destroy());
    }
};

/**
 * On client latency
 *
 * @param {Object} data
 */
Inspector.prototype.onClientLatency = function(data)
{
    this.set(this.CLIENT_LATENCY, data.latency, {client: data.tracker.client.id});
};

/**
 * On game FPS
 *
 * @param {Object} data
 */
Inspector.prototype.onGameFPS = function(data)
{
    this.set(this.GAME_FPS, data);
};

/**
 * On game tickrate
 *
 * @param {Object} data
 */
Inspector.prototype.onGameTickrate = function(data)
{
    this.set(this.GAME_TICKRATE, data);
};

/**
 * On every frame
 */
Inspector.prototype.onLog = function()
{
    usage.lookup(process.pid, this.logUsage);
};

/**
 * Log usage
 */
Inspector.prototype.logUsage = function (err, result)
{
    if (result) {
        this.set(this.USAGE_CPU, result.cpu);
        this.set(this.USAGE_MEMORY, result.memory);
    }
};

/**
 * Set key/value in InfluxDB
 *
 * @param {String} key
 * @param {Object|Scalar} value
 * @param {Object} tags
 */
Inspector.prototype.set = function(key, value, tags)
{
    if (typeof(tags) === 'object') {
        for (var tag in this.tags) {
            if (this.tags.hasOwnProperty(tag)) {
                tags[tag] = this.tags[tag];
            }
        }
    } else {
        tags = this.tags;
    }

    this.client.writePoint(key, value, tags, {});
};
