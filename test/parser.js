var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;

var parser = require('..');

function asset (filename) {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
}

describe('parser', function () {
  describe('format content', function () {
    describe('one hostname in one line', function () {
      it('shoule be ok', function () {
        expect(parser('127.0.0.1 www.example.com'))
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
        expect(parser('127.0.0.1 www.example.com www.foobar.com'))
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
          expect(parser('#127.0.0.1 www.example.com'))
            .to.be.deep.equal([]);
        });
      });
      describe('hash at half of the line', function () {
        it('shoule be one group', function () {
          expect(parser('127.0.0.1 www.example.com #comments'))
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
        expect(parser('127.0.0.1 www.example.com'))
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
        expect(parser('127.0.0.1  www.example.com'))
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
        expect(parser('127.0.0.1\twww.example.com'))
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
        expect(parser('127.0.0.1\t\twww.example.com'))
          .to.be.deep.equal([
            {
              ip: '127.0.0.1',
              hostname: 'www.example.com'
            }
          ]);
      });
    });
  });
  describe('file', function () {
    describe('example hosts file', function () {
      it('should be ok', function () {
        expect(parser(asset('./assets/hosts')))
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