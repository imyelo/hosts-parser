var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;

var Hosts = require('..').Hosts;

function asset (filename) {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
}

describe('parser', function () {
  describe('format content', function () {
    describe('one hostname in one line', function () {
      it('shoule be ok', function () {
        expect((new Hosts('127.0.0.1 www.example.com')).toJSON())
          .to.be.deep.equal([
            {
              ip: '127.0.0.1',
              hostname: 'www.example.com'
            }
          ]);
      });
    });
    describe('multiple hostname in one line', function () {
      it('shoule be ok', function () {
        expect((new Hosts('127.0.0.1 www.example.com www.foobar.com')).toJSON())
          .to.be.deep.equal([
            {
              ip: '127.0.0.1',
              hostname: 'www.example.com'
            },
            {
              ip: '127.0.0.1',
              hostname: 'www.foobar.com'
            }
          ]);
      });
    });
    describe('ingore comments', function () {
      describe('hash at the begin of the line', function () {
        it('shoule be nothing', function () {
          expect((new Hosts('#127.0.0.1 www.example.com')).toJSON())
            .to.be.deep.equal([]);
        });
      });
      describe('hash at half of the line', function () {
        it('shoule be one group', function () {
          expect((new Hosts('127.0.0.1 www.example.com #comments')).toJSON())
            .to.be.deep.equal([
              {
                ip: '127.0.0.1',
                hostname: 'www.example.com'
              }
            ]);
        });
      });
    });
  });
  describe('separator', function () {
    describe('one space', function () {
      it('shoule be ok', function () {
        expect((new Hosts('127.0.0.1 www.example.com')).toJSON())
          .to.be.deep.equal([
            {
              ip: '127.0.0.1',
              hostname: 'www.example.com'
            }
          ]);
      });
    });
    describe('multi space', function () {
      it('shoule be ok', function () {
        expect((new Hosts('127.0.0.1  www.example.com')).toJSON())
          .to.be.deep.equal([
            {
              ip: '127.0.0.1',
              hostname: 'www.example.com'
            }
          ]);
      });
    });
    describe('one \\t', function () {
      it('shoule be ok', function () {
        expect((new Hosts('127.0.0.1\twww.example.com')).toJSON())
          .to.be.deep.equal([
            {
              ip: '127.0.0.1',
              hostname: 'www.example.com'
            }
          ]);
      });
    });
    describe('multi \\t', function () {
      it('shoule be ok', function () {
        expect((new Hosts('127.0.0.1\t\twww.example.com')).toJSON())
          .to.be.deep.equal([
            {
              ip: '127.0.0.1',
              hostname: 'www.example.com'
            }
          ]);
      });
    });
  });
  describe('resolve', function () {
    describe('repetition hostname', function () {
      it('should be the last one', function () {
        var hosts = '\
          127.0.0.1 www.example.com \n\
          192.168.1.1 www.example.com\
          ';
        expect((new Hosts(hosts)).resolve('www.example.com'))
          .to.be.equal('192.168.1.1');
      });
    });
    describe('mismatching hostname', function () {
      it('should return an undefined', function () {
        var hosts = '\
          127.0.0.1 www.example.com\
          ';
        expect((new Hosts(hosts)).resolve('mismatching.com'))
          .to.be.an.undefined;
      });
    });
  });
  describe('reverse', function () {
    describe('find hostname', function () {
      it('should be found', function () {
        var hosts = '\
          192.168.1.1 www.example1.com \n\
          192.168.1.2 www.example2.com\
          ';
        expect((new Hosts(hosts)).reverse('192.168.1.2'))
          .to.be.equal('www.example2.com');
      });
    });
    describe('non-existing ip', function () {
      it('should return an undefined', function () {
        var hosts = '\
          127.0.0.1 www.example.com\
          ';
        expect((new Hosts(hosts)).reverse('192.168.1.1'))
          .to.be.an.undefined;
      });
    });
    describe('find async',function () {
      it('should fire the callback', function (done) {
        var hosts = '\
          192.168.1.1 www.example1.com \n\
          192.168.1.2 www.example2.com\
          ';
        expect((new Hosts(hosts)).reverse('192.168.1.2', function (err, result) {
          expect(result).to.equal('www.example2.com');
          done();
        }))
      });
    })
  });
  describe('file', function () {
    describe('example hosts file', function () {
      it('should be ok', function () {
        var hosts = asset('./assets/hosts');
        expect((new Hosts(hosts)).toJSON())
          .to.be.deep.equal([
            {
              ip: '127.0.0.1',
              hostname: 'www.example.com'
            },
            {
              ip: '192.168.1.1',
              hostname: 'gateway'
            }
          ]);
      });
    });
  });
});