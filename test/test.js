var assert = require('assert');
var lib = require('../index')
var common = lib.common;

describe('common', () => {
    describe('setFormNotification', () => {
        it('should be a function', () => {
            assert.equal('function', typeof(common.setFormNotification));
        });
    });
});