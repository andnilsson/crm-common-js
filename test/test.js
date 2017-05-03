var assert = require('assert');
var lib = require('../index')
var common = lib.common;

describe('common', () => {
    describe('setFormNotification', () => {
        it('should be a function', () => {
            assert.equal('function', typeof(common.setFormNotification));
        });
    });

    describe('addFieldValidationRule', () => {
        it('should not change a field value when entering a value that doesnt validate', () => {
            var fieldname = 'name';
            var valid = 'test';
            var notvalid = 123;

            common.fields.addFieldValidationRule(fieldname, (value) => { return isNaN(value) });            

            common.getField(fieldname).setValue(valid);
            assert.equal(common.getField(fieldname).getValue(), valid);

            common.getField(fieldname).setValue(notvalid);
            assert.notEqual(common.getField(fieldname).getValue(), notvalid);
        })
    });
});

