module.exports = function parseHosts(hosts) {
  var parsed = [];
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
      parsed.push({
        ip: ip,
        hostname: hostname
      });
    });
  });
  return parsed;
}