/**
* User tests
*
* Author: Bianca Mihai <bubu.slubu@gmail.com>
*/

'use strict';

var crypto = require('crypto');

/**
 * Create a random hex string of specific length and
 * @todo consider taking out to a common unit testing javascript helper
 * @return string
 */
function getRandomString(len) {
  if (!len)
    len = 16;
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

/**
 * Module dependencies.
 */

var expect = require('expect.js'), mongoose = require('mongoose');
mongoose.model('User', new mongoose.Schema());
var User = mongoose.model('User');

/**
 * Globals
 */
var user1, user2;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model User:', function() {
    // before any test create user objects to work with
    before(function(done) {
      user1 = {
        name: 'Full name',
        email: 'test' + getRandomString() + '@test.com',
        username: getRandomString(),
        password: 'password',
        provider: 'local'
      };

      user2 = {
        name: 'Full name',
        email: 'test' + getRandomString() + '@test.com',
        username: getRandomString(),
        password: 'password',
        provider: 'local'
      };

      done();
    });
    // oon save, test all cases
    describe('Method Save', function() {
      it('should begin without the test user', function(done) { // find a user
        User.find({
          email: user1.email
        }, function(err, users) {
          expect(users.length).to.equal(0);

          User.find({
            email: user2.email
          }, function(err, users) {
            expect(users.length).to.equal(0);
            done();
          });

        });
      });

      it('should be able to save without problems', function(done) { // this should be a success case

        var _user = new User(user1);
        _user.save(function(err) {
          expect(err).to.be(null);
          _user.remove();
          done();
        });

      });

      it('should be able to create user and save user for updates without problems', function(done) { // test the user update, should return success

        var _user = new User(user1);
        _user.save(function(err) {
          expect(err).to.be(null);

          _user.name = 'Full name2';
          _user.save(function(err) {
            expect(err).to.be(null);
            expect(_user.name).to.equal('Full name2');
            _user.remove(function() {
              done();
            });
          });

        });

      });

      it('should fail to save an existing user with the same values', function(done) { // test should fail for the same values

        var _user1 = new User(user1);
        _user1.save();

        var _user2 = new User(user1);

        return _user2.save(function(err) {
          expect(err).to.not.be(null);
          _user1.remove(function() {

            if (!err) {
              _user2.remove(function() {
                done();
              });
            }

            done();

          });

        });
      });

      it('should show an error when try to save without name', function(done) { // name is required, test this

        var _user = new User(user1);
        _user.name = '';

        return _user.save(function(err) {
          expect(err).to.not.be(null);
          done();
        });
      });

      it('should show an error when try to save without password and provider set to local', function(done) { // local = local sign in

        var _user = new User(user1);
        _user.password = '';
        _user.provider = 'local';

        return _user.save(function(err) {
          expect(err).to.not.be(null);
          done();
        });
      });

      it('should be able to to save without password and provider set to facebook', function(done) { // facebook sign in

        var _user = new User(user1);

        _user.password = '';
        _user.provider = 'facebook';

        return _user.save(function(err) {
          _user.remove(function() {
            expect(err).to.be(null);
            expect(_user.provider).to.equal('twitter');
            expect(_user.hashed_password.length).to.equal(0);
            done();
          });
        });
      });

    });

    // source: http://en.wikipedia.org/wiki/Email_address
    describe('Test Email Validations', function() {
      it('Shouldnt allow invalid emails #1', function(done) {
        var _user = new User(user1);
        _user.email = 'Abc.example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              expect(err).to.not.be(null);
              done();
            });
          } else {
            expect(err).to.not.be(null);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #2', function(done) {
        var _user = new User(user1);
        _user.email = 'A@b@c@example.com';
        _user.save(function(err) {
          if (err) {
            expect(err).to.not.be(null);
            done();
          } else {
            _user.remove(function(err2) {
              expect(err).to.not.be(null);
              done();
            });
          }
        });
      });

      it('Shouldnt allow invalid emails #3', function(done) {
        var _user = new User(user1);
        _user.email = 'a"b(c)d,e:f;g<h>i[j\\k]l@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              expect(err).to.not.be(null);
              done();
            });
          } else {
            expect(err).to.not.be(null);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #4', function(done) {
        var _user = new User(user1);
        _user.email = 'just"not"right@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              expect(err).to.not.be(null);
              done();
            });
          } else {
            expect(err).to.not.be(null);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #5', function(done) {
        var _user = new User(user1);
        _user.email = 'this is"not\\allowed@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              expect(err).to.not.be(null);
              done();
            });
          } else {
            expect(err).to.not.be(null);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #6', function(done) {
        var _user = new User(user1);
        _user.email = 'this\\ still\\"not\\allowed@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              expect(err).to.not.be(null);
              done();
            });
          } else {
            expect(err).to.not.be(null);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #7', function(done) {
        var _user = new User(user1);
        _user.email = 'john..doe@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              expect(err).to.not.be(null);
              done();
            });
          } else {
            expect(err).to.not.be(null);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #8', function(done) {
        var _user = new User(user1);
        _user.email = 'john.doe@example..com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              expect(err).to.not.be(null);
              done();
            });
          } else {
            expect(err).to.not.be(null);
            done();
          }
        });
      });

      it('Should save with valid email #1', function(done) {
        var _user = new User(user1);
        _user.email = 'john.doe@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              expect(err).to.be(null);
              done();
            });
          } else {
            expect(err).to.be(null);
            done();
          }
        });
      });

      it('Should save with valid email #2', function(done) {
        var _user = new User(user1);
        _user.email = 'disposable.style.email.with+symbol@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              expect(err).to.be(null);
              done();
            });
          } else {
            expect(err).to.be(null);
            done();
          }
        });
      });

      it('Should save with valid email #3', function(done) {
        var _user = new User(user1);
        _user.email = 'other.email-with-dash@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              expect(err).to.be(null);
              done();
            });
          } else {
            expect(err).to.be(null);
            done();
          }
        });
      });

      it('name should be escaped from xss', function(done) {

        var _user = new User(user1);
        _user.name = '</script><script>alert(1)</script>';

        return _user.save(function(err) {
          expect(_user.name).to.be('&lt;/script&gt;&lt;script&gt;alert(1)&lt;/script&gt;');
          done();
        });
      });

      it('username should be escaped from xss', function(done) {

        var _user = new User(user1);
        _user.name = '<b>xss</b>';

        return _user.save(function(err) {
          expect(_user.name).to.be('&lt;b&gt;xss&lt;/b&gt;');
          done();
        });
      });

    });

    after(function(done) {

      /** Clean up user objects
       * un-necessary as they are cleaned up in each test but kept here
       * for educational purposes
       *
       *  var _user1 = new User(user1);
       *  var _user2 = new User(user2);
       *
       *  _user1.remove();
       *  _user2.remove();
       */

      done();
    });
  });
});
