var APIVERSION = "8.2";
var window = window ? window : { parent: {} };

var eventModule = (function () {
    var my = {};
    var subscribers = [];
    my.subscribe = function (action, callback) {
        var events = subscribers[action];
        if (events === undefined) {
            events = [];
            subscribers[action] = events;
        }
        events.push(callback);
    }

    my.raise = function (action, data) {
        var events = subscribers[action];
        if (events === undefined)
            return;
        events.forEach(function (sub) {
            sub(data);
        });
    }

    return my;
})();
var webapiModule = (function () {
    var my = {};
    my.updaterecord = function (entityid, entityobject, odatasetname, callback) {
        if (common.Xrm.get().isLocalhost && window.location.hostname.indexOf('localhost') > -1) {
            callback();
            return;
        }
        var oDataEndpointUrl = common.general.getODataEndPoint();
        oDataEndpointUrl += "/" + odatasetname + "(" + entityid + ")";
        var service = common.general.getRequestObject();
        var jsonEntity = window.JSON.stringify(entityobject);
        if (service !== null) {
            service.open("PATCH", encodeURI(oDataEndpointUrl), true);
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.setRequestHeader("X-HTTP-Method", "MERGE");
            service.onreadystatechange = function () {
                if (this.readyState === 4) {
                    service.onreadystatechange = null;
                    if (this.status === 204 || this.status === 1223)
                        callback();
                }
            }
            service.send(jsonEntity);
        }
    }
    my.updaterecordsingleproperty = function (entityid, propertyname, value, odatasetname, callback) {
        if (common.Xrm.get().isLocalhost && window.location.hostname.indexOf('localhost') > -1) {
            callback();
            return;
        }
        var oDataEndpointUrl = common.general.getODataEndPoint();
        oDataEndpointUrl += "/" + odatasetname + "(" + entityid + ")/" + propertyname;
        var service = common.general.getRequestObject();
        var jsonEntity = window.JSON.stringify({
            "value": value
        });
        if (service !== null) {
            service.open("PUT", encodeURI(oDataEndpointUrl), true);
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.setRequestHeader("X-HTTP-Method", "MERGE");
            service.onreadystatechange = function () {
                if (this.readyState === 4) {
                    service.onreadystatechange = null;
                    if (this.status === 204 || this.status === 1223)
                        callback();
                    else
                        throw "the operation was not successful";
                }
            }
            service.send(jsonEntity);
        }
    }
    my.createrecord = function (entityObject, odataSetName, callback, returnRepresentation, errorcallback) {
        if (common.Xrm.get().isLocalhost && window.location.hostname.indexOf('localhost') > -1) {
            callback("id");
            return;
        }
        var jsonEntity = window.JSON.stringify(entityObject);
        var ODATA_ENDPOINT = common.general.getODataEndPoint();
        var createRecordReq = common.general.getRequestObject();
        createRecordReq.open('POST', ODATA_ENDPOINT + "/" + odataSetName, true);
        createRecordReq.setRequestHeader("Accept", "application/json");
        createRecordReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        if (returnRepresentation == true)
            createRecordReq.setRequestHeader("Prefer", "return=representation");
        createRecordReq.onreadystatechange = function () {
            if (this.readyState === 4) {
                createRecordReq.onreadystatechange = null;
                if (this.status === 201) {
                    callback(JSON.parse(this.responseText));
                } else if (this.status === 204) {
                    try {
                        var uri = this.getResponseHeader("OData-EntityId");
                        var guidregex = /[{]?[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}[}]?/i;
                        callback(guidregex.exec(uri)[0]);
                    } catch (e) {
                        console.log(e);
                        callback();
                    }
                } else {
                    if (errorcallback)
                        errorcallback(this.responseText)
                }
            }
        }

        createRecordReq.send(jsonEntity);
    }
    my.deleteRecord = function (entityid, odatasetname, callback) {
        if (common.Xrm.get().isLocalhost && window.location.hostname.indexOf('localhost') > -1) {
            callback();
            return;
        }
        var oDataEndpointUrl = common.general.getODataEndPoint();
        oDataEndpointUrl += "/" + odatasetname + "(" + entityid + ")";
        var service = common.general.getRequestObject();
        if (service !== null) {
            service.open("POST", encodeURI(oDataEndpointUrl), true);
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.setRequestHeader("X-HTTP-Method", "DELETE");
            service.onreadystatechange = function () {
                if (this.readyState === 4) {
                    service.onreadystatechange = null;
                    if (this.status === 201 || this.status === 1223) {
                        callback();
                    }
                }
            }
            service.send();
        }
    }
    my.retrieverecord = function (entityid, odatasetname, query, callback) {
        if (common.Xrm.get().isLocalhost && window.location.hostname.indexOf('localhost') > -1) {
            callback();
            return;
        }
        var oDataEndpointUrl = common.general.getODataEndPoint();
        oDataEndpointUrl += "/" + odatasetname + "(" + entityid + ")" + query;
        var service = common.general.getRequestObject()
        if (service !== null) {
            service.open("GET", encodeURI(oDataEndpointUrl), true);
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.onreadystatechange = function () {
                if (this.readyState === 4) {
                    service.onreadystatechange === null;
                    if (this.status === 200) {
                        callback(JSON.parse(this.responseText));
                    }
                }
            }
            service.send(null);
        }
    }
    my.retrievemultiplerecords = function (odatasetname, query, callback, oncomplete) {
        if (common.Xrm.get().isLocalhost && window.location.hostname.indexOf('localhost') > -1) {
            callback([]);
            return;
        }
        if (odatasetname === null) {
            var oDataEndpointUrl = query;
        } else {
            var oDataEndpointUrl = common.general.getODataEndPoint();
            oDataEndpointUrl += "/" + odatasetname + query;
        }

        var service = common.general.getRequestObject();
        if (service !== null) {
            service.open("GET", encodeURI(oDataEndpointUrl), true);
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.onreadystatechange = function () {
                if (this.readyState === 4) {
                    service.onreadystatechange = null;
                    if (this.status === 200) {
                        var returned = JSON.parse(this.responseText).value;
                        callback(returned);
                        if (returned.__next !== null && oncomplete !== null) {
                            common.webapi.retrievemultiplerecords(null, decodeURI(returned.__next), callback, oncomplete);
                        }
                        else { try { oncomplete(); } catch (e) { } }
                    }
                }
            }
            service.send(null);
        }
    }

    return my;
})();
var optionsetModule = (function () {
    var my = {};
    my.addOption = function (attribute, value, index) {
        my.common.getControl(attribute).addOption(value, index);
    }
    my.removeOption = function (attribute, value) {
        my.common.getControl(attribute).removeOption(option);
    }
    my.clearOptions = function (attribute) {
        my.common.getControl(attribute).clearOptions();
    }
    my.setOptionSetValues = function (attribute, currentValue, oAvailableArray, optionalControlAttribute) {

        if (optionalControlAttribute === null)
            optionalControlAttribute = attribute;

        var oSubPicklist = common.Xrm.get().Page.getControl(optionalControlAttribute);
        if (!oSubPicklist.originalPicklistValues) {
            oSubPicklist.originalPicklistValues = common.Xrm.get().Page.getAttribute(attribute).getOptions();
        }
        else {
            oSubPicklist.Options = oSubPicklist.originalPicklistValues;
        }
        oSubPicklist.clearOptions();

        if (oAvailableArray.length > 0) {
            var index = 1;
            for (var i = 0; oSubPicklist.originalPicklistValues.length > i; i++) {
                for (var j = 0; oAvailableArray.length > j; j++) {
                    if (oSubPicklist.originalPicklistValues[i] !== null && (oAvailableArray[j] === oSubPicklist.originalPicklistValues[i].value)) {
                        oSubPicklist.addOption(oSubPicklist.originalPicklistValues[i], index);
                        index++;
                        continue;
                    }
                }
            }
            oSubPicklist.setDisabled(false);
            if (currentValue !== null) {
                common.Xrm.get().Page.getAttribute(attribute).setValue(currentValue);
            }
            else {
                common.Xrm.get().Page.getAttribute(attribute).setValue(null);
            }
        }
        else {
            oSubPicklist.setDisabled(true);
            common.Xrm.get().Page.getAttribute(attribute).setValue(null);
        }
    }

    return my;
})();
var fieldsModule = (function () {
    var my = {
        oldvalues: []
    };
    my.SetLookupValue = function (fieldName, id, name, entityType) {
        if (fieldName !== null) {
            var lookupValue = new Array();
            lookupValue[0] = new Object();
            lookupValue[0].id = id;
            lookupValue[0].name = name;
            lookupValue[0].entityType = entityType;

            common.Xrm.get().Page.getAttribute(fieldName).setValue(lookupValue);
        }
    }
    my.forceSubmitAllDirtyAttributes = function (input) {
        var attributes = common.Xrm.get().Page.data.entity.attributes.get();
        var attributeList = "";
        for (var i in attributes) {
            var attribute = attributes[i];
            var res = attribute.getIsDirty();
            if (res === true) {
                common.Xrm.get().Page.getAttribute(attribute.getName()).setSubmitMode(input);
            }
        }
    }
    my.doesControlHaveAttribute = function (control) {
        var controlType = control.getControlType();
        return controlType !== "iframe" && controlType !== "webresource" && controlType !== "subgrid";
    }
    my.disableAllFields = function () {
        common.Xrm.get().Page.ui.controls.forEach(function (control, index) {
            if (doesControlHaveAttribute(control)) {
                control.setDisabled(true);
            }
        });
    }
    my.alertTheDirtyOnes = function () {
        var attributes = common.Xrm.get().Page.data.entity.attributes.get();
        var attributeList = "";
        for (var i in attributes) {
            var attribute = attributes[i];
            var res = attribute.getIsDirty();
            if (res === true) {
                attributeList = attribute.getName() + ", " + attributeList;
            }
        }
        alert("Dessa e dirty: " + attributeList);
    }
    my.hideField = function (fieldname) {
        common.Xrm.get().Page.getControl(fieldname).setVisible(false);
    }
    my.showField = function (fieldname) {
        common.Xrm.get().Page.getControl(fieldname).setVisible(false);
    }
    my.addFieldValidationRule = function (field, rule) {
        my.oldvalues[field] = common.getField(field).getValue();

        common.getField(field).addOnChange(function () {
            var oldvalue = my.oldvalues[field];
            var newvalue = common.getField(field).getValue();
            if (!rule(oldvalue)) oldvalue = null;
            if (!rule(newvalue))
                common.getField(field).setValue(oldvalue);
            else {
                my.oldvalues[field] = newvalue;
            }
        });
    }
    my.validationrules = {
        dateValidationrule: function (value) {
            var pattern = RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/);
            if (pattern.test(value))
                return true;
            else {
                alert("Not a valid date. Date should be in format dd/mm/yyyy");
                return false;
            }
        }
    };
    my.addNotification = function (field, text) {
        common.getControl(field).setNotification(text);
    };
    my.clearNofification = function (field) {
        common.getControl(field).clearNotification();
    }
    my.addAutocomplete = function (field, values, command, commandlabel) {
        var object = {
            results: []
        }
        values.forEach(function (val, index) {
            object.results.push({
                id: index,
                fields: [val]
            });
        });

        if (command) {
            object.commands = {
                id: values.length + 1,
                label: commandlabel ? commandlabel : "Funktion",
                action: command
            }
        }

        common.getControl(field).addOnKeyPress(function () {
            common.getControl(field).showAutoComplete(object);
        });

    }
    return my;
})();
var formModule = (function () {
    var my = {
        getXrmAttribute: function (name) {
            return common.Xrm.get().Page.getAttribute(name).getValue();
        },
        getXrmEntityId: function () {
            return common.Xrm.get().Page.data.entity.getId();
        },
    };
    my.IsFormValidForSaving = function () {
        var valid = true;
        common.Xrm.get().Page.data.entity.attributes.forEach(function (attribute, index) {
            if (attribute.getRequiredLevel() === "required") {
                if (attribute.getValue() === null) {
                    if (valid) {
                        var control = attribute.controls.get(0);
                        alert(control.getLabel() + " is missing a value");
                        control.setFocus();
                    }
                    valid = false;
                }
            }
        });
        return valid;
    }
    my.hideTab = function (tabName) {
        var tab = common.Xrm.get().Page.ui.tabs.get(tabName);
        if (tab !== null) {
            tab.setVisible(false);
        }
    }
    my.showTab = function (tabName) {
        var tab = common.Xrm.get().Page.ui.tabs.get(tabName);
        if (tab !== null) {
            tab.setVisible(true);
        }
    }
    my.sectionDisable = function (sectionname, disablestatus) {
        var ctrlName = common.Xrm.get().Page.ui.controls.get();
        for (var i in ctrlName) {
            var ctrl = ctrlName[i];
            var ctrlSection = ctrl.getParent().getName();
            if (ctrlSection === sectionname) {
                ctrl.setDisabled(disablestatus);
            }
        }
    }
    my.setNavigationVisible = function (relationshipname, setVisible) {
        common.Xrm.get().Page.ui.navigation.items.get(relationshipname).setVisible(setVisible);
    }
    my.showSection = function (tabName, sectionName) {
        var tab = common.Xrm.get().Page.ui.tabs.get(tabName);
        if (tab !== null) {
            tab.sections.get(sectionName).setVisible(true);
        }
    }
    my.hideSection = function (tabName, sectionName) {
        var tab = common.Xrm.get().Page.ui.tabs.get(tabName);
        if (tab !== null) {
            tab.sections.get(sectionName).setVisible(false);
        }
    }
    my.openEntityForm = function (entitytype, id) {
        common.Xrm.get().Utility.openEntityForm(entitytype, id);
    }
    return my;
})();
var generalModule = (function () {
    var my = {}
    my.guidsAreEqual = function (guid1, guid2) {
        var isEqual = false;

        if (guid1 === null || guid2 === null) {
            isEqual = false;
        }
        else {
            isEqual = guid1.replace(/[{}]/g, "").toLowerCase() === guid2.replace(/[{}]/g, "").toLowerCase();
        }

        return isEqual;
    }
    my.getODataEndPoint = function () {
        return "/api/data/v" + APIVERSION;
    }
    my.parseDateValues = function (crmDateString) {
        if (crmDateString !== null) {
            var fieldValue = crmDateString;
            var dateValue = new Date(parseInt(fieldValue.replace("/Date(", "").replace(")/", "")));
        }
        return dateValue;
    }
    my.getRequestObject = function () {
        if (XMLHttpRequest) {
            return new XMLHttpRequest();
        }
        else if (window.XMLHttpRequest) {
            return new window.XMLHttpRequest;
        }
        else {
            try {
                return new ActiveXObject("MSXML2.XMLHTTP.3.0");
            }
            catch (ex) {
                return null;
            }
        }
    }
    my.findInArrayOfObjects = function (property, searchString, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][property] === searchString) {
                return arr[i];
            }
        }
    }
    return my;
})();
var userModule = (function () {
    var my = {};
    my.userHasAnyOfRolesCSV = function (roleName, callback) {
        if (common.Xrm.get().isLocalhost) {
            callback(true);
            return;
        }
        var oDataEndpointUrl = common.general.getODataEndPoint();

        // split rolename string on commas       
        if (roleName.indexOf(',') > 0) {
            var rolelist = roleName.split(',');
            var element = null, odatastring = '';
            // build up the odata query string
            for (var i = 0; i < rolelist.length; i++) {
                odatastring += "name eq '" + rolelist[i] + "'";
                if (i < rolelist.length - 1) {
                    odatastring += ' or ';
                }
            }
        }
        else {
            // we just have one role to look for
            odatastring = "name eq '" + roleName + "'";
        }

        oDataEndpointUrl += "/roles?$filter=" + odatastring;

        var service = common.general.getRequestObject();

        if (service !== null) {
            service.open("GET", encodeURI(oDataEndpointUrl), true);
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.onreadystatechange = function () {
                if (this.readyState === 4) {
                    service.onreadystatechange === null;
                    if (this.status === 200) {
                        var requestResults = JSON.parse(this.responseText);
                        if (requestResults !== null) {
                            var currentUserRoles = common.Xrm.get().Page.context.getUserRoles();
                            for (var j = 0; j < requestResults.value.length; j++) {
                                var role = requestResults.value[j].roleid;
                                for (var i = 0; i < currentUserRoles.length; i++) {
                                    var userRole = currentUserRoles[i];
                                    if (common.general.guidsAreEqual(userRole, role)) {
                                        callback(true);
                                        return;
                                    }
                                }
                            }
                            callback(false);
                        }
                    }
                }
            }
            service.send(null);
        };
    }

    return my;
})();
var adaljs = (function () {
    return {
        getTokenAdaljs: function (config, success, error) {
            var authContext = new AuthenticationContext(config);
            var user = authContext.getCachedUser();
            var isCallback = authContext.isCallback(window.location.hash);
            if (!user && !isCallback) {
                authContext.login();
            }

            if (isCallback) {
                authContext.handleWindowCallback();
            }
            var loginError = authContext.getLoginError();

            if (isCallback) {
                window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
            }

            if (isCallback && !authContext.getLoginError()) {
                window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
            }

            if (loginError) {
                var message = "ADAL error START -----> " + "Err: " + loginError + "<-----ADAL error END" + "User: " + authContext.getCachedUser();
                if (error)
                    error(message);
                return;
            }

            authContext.acquireToken(config.endpoints.orgUri, function (e, token) {
                if (e === null)
                    success(token);
                else
                    error(e);
            });
        }
    }
})();

if (window.parent.common) {
    var common = window.parent.common;
} else {
    var common = (function () {
        var _xrm = null;
        var _islocalhost = false;
        var _fieldvalues = {};

        var my = {
            webapi: webapiModule,
            optionset: optionsetModule,
            fields: fieldsModule,
            form: formModule,
            general: generalModule,
            user: userModule,
            adaljs: adaljs,
            events: eventModule,
            Xrm: {
                runLocalhost: function () {
                    Xrm = {
                        isLocalhost: true,
                        Page: {
                            getAttribute: function (name) {
                                return {
                                    getValue: function () {
                                        var x = _fieldvalues[name] !== undefined ? _fieldvalues[name] : "value";
                                        return x;
                                    },
                                    setValue: function (val) {
                                        _fieldvalues[name] = val;
                                        my.events.raise(name);
                                    },
                                    addOnChange: function (e) {
                                        my.events.subscribe(name, e);
                                    },
                                    fireOnChange: function () {
                                        my.events.raise(name);
                                    }
                                };
                            },
                            getControl: function (name) {
                                return {
                                    getVisible: function () { return true; },
                                    setVisible: function (val) { },
                                    getDisabled: function () { return false },
                                    setDisabled: function (val) { }
                                };
                            },
                            data: {
                                entity: {
                                    getId: function () { return 1; },
                                    getPrimaryAttributeValue: function () { return "Name"; }
                                }
                            },
                            context: {
                                getClientUrl: function () { return "http://" + window.location.hostname + ":" + window.location.port; },
                                getUserId: function () { return "userid" }
                            },
                            ui: {
                                tabs: {
                                    get: function (tabName) { return {}; }
                                },
                                setFormNotification: function (message, level, id) { console.log(message); },
                                clearFormNotification: function (id) { return true }
                            }
                        },
                        Utility: {
                            openEntityForm: function (entity, id) {
                                console.log("navigated to " + entity + " with id '" + id + "'");
                            }
                        }
                    }
                    _islocalhost = true;
                    _xrm = Xrm;
                },
                get: function () {
                    if (_xrm !== null)
                        return _xrm;

                    if (typeof (Xrm) !== "undefined")
                        _xrm = Xrm;
                    else if (window.opener) {
                        if (typeof (window.opener.Xrm) !== "undefined")
                            _xrm = window.opener.Xrm;
                        else if (window.opener.common.Xrm.get() !== "undefined")
                            _xrm = window.opener.common.Xrm.get();
                    }
                    else if (window.parent && typeof (window.parent.Xrm) !== "undefined")
                        _xrm = window.parent.Xrm;

                    if (!_xrm)
                        this.runLocalhost();

                    return _xrm;
                },
                set: function (xrm) {
                    _xrm = xrm;
                },
            },
            getTab: function (tabname) {
                return my.Xrm.get().Page.ui.tabs.get(tabname);
            },
            getField: function (fieldname) {
                return my.Xrm.get().Page.getAttribute(fieldname);
            },
            getUserId: function () {
                var value = my.Xrm.get().Page.context.getUserId();
                if (!value || value.length < 1)
                    return null;

                var id = value.replace('{', '');
                return id.replace('}', '');
            },
            getWebapiFormattedIdFromLookup: function (lookupfield) {
                var value = common.getField(lookupfield).getValue();
                if (!value || value.length < 1)
                    return null;

                var id = value[0].id.replace('{', '');
                return id.replace('}', '');
            },
            getControl: function (controlname) {
                return my.Xrm.get().Page.getControl(controlname);
            },
            getCurrentId: function () {
                if (common.Xrm.get().isLocalhost)
                    return "1";
                var id = common.Xrm.get().Page.data.entity.getId();
                id = id.replace('{', '');
                id = id.replace('}', '');
                return id;
            },
            setFormNotification: function (message, level) {
                common.Xrm.get().Page.ui.setFormNotification(message, level);
            },
        }

        my.initSolutionAdaptions = function (callback, url) {
            if (!url)
                var url = "stq_/scripts/solutionAdaptions.js";

            my.loadScript(url, callback);
        }

        my.loadScript = function (url, callback, type) {
            if (!common.Xrm.get().isLocalhost)
                url = my.Xrm.get().Page.context.getClientUrl() + "//WebResources/" + url;

            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = type ? type : 'text/javascript';
            script.src = url;
            script.onreadystatechange = callback(script);
            script.onload = callback(script);

        }

        return my;
    })();
}

if (exports)
    exports.common = common;