var _ = require('lodash');

var Hosts = function (hosts) {
  if (!(this instanceof Hosts)) {
    return new Hosts(hosts);
  }
  this._origin = [];
  return this.parse(hosts);
};

Hosts.prototype.toJSON = function () {
  return this._origin;
};

Hosts.prototype.resolve = function (hostname) {
  var matching = _.findLast(this._origin, function (rule) {
    return rule.hostname === hostname;
  });
  if (matching && matching.ip) {
    return matching.ip;
  }
};

Hosts.prototype.reverse = function (ip,callback) {
  var matching = _.findLast(this._origin, function (rule) {
    return rule.ip === ip;
  });
  if (matching && matching.hostname) {
    if (typeof callback=='function'){ 
      callback(null,matching.hostname)
    } else {
      return matching.hostname;
    }
  } else {
    if (typeof callback=='function'){
      callback("Not found")
    } 
  }
};


Hosts.prototype.parse = function (hosts) {
  var self = this;
  hosts = (hosts || '').split('\n');
  hosts.forEach(function (line) {
    var hashIndex, matched, ip, hostnames;
    hashIndex = line.indexOf('#');
    if (hashIndex > -1) {
      line = line.slice(0, hashIndex);
    }

    matched = line.trim().split(/\s+/);

    if (matched.length < 2) {
      return;
    }

    ip = matched[0];
    hostnames = matched.slice(1);

    hostnames.forEach(function (hostname) {
      self._origin.push({
        ip: ip,
        hostname: hostname
      });
    });
  });
  return self;
};

exports.Hosts = Hosts;
