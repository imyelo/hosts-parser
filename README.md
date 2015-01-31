# hosts-parser
hosts file parser

[![Build Status](https://travis-ci.org/imyelo/hosts-parser.svg?branch=master)](https://travis-ci.org/imyelo/hosts-parser)

## Usage
```javascript
var fs = require('fs');
var parser = require('hosts-parser');
console.log(parser(fs.readFileSync('/etc/hosts', 'utf8')));
/**
[
    {
        "ip": "127.0.0.1",
        "hostname": "localhost"
    }
]
**/
```

## What is Hosts file
[hosts (file)](http://en.wikipedia.org/wiki/Hosts_%28file%29)

## License
the MIT License.
