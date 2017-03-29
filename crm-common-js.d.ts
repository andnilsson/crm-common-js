export module common {
    function getTab(tabname: string): any;
    function getField(fieldname: string): any;
    function getWebapiFormattedIdFromLookup(lookupfield: string): string;
    function getControl(controlname: string): any;
    function getCurrentId(): string;
    function setFormNotification(message: string, level: string): void

    export module Xrm {
        function get(): Xrm;
    }

    export module webapi {
        function updaterecord(entityid: string, entityobject: any, odatasetname: string, callback: (data: any) => void): void
        function updaterecordsingleproperty(entityid: string, propertyname: string, value: any, odatasetname: string, callback: (data: any) => void): void
        function createrecord(entityObject: any, odataSetName: string, callback: (data: any) => void, returnRepresentation?: boolean, errorcallback?: (data: any) => void): void
        function deleteRecord(entityid: string, odatasetname: string, callback: (data: any) => void): void
        function retrieverecord(entityid: string, odatasetname: string, query: string, callback: (data: any) => void): void
        function retrievemultiplerecords(odatasetname: string, query: string, callback: (data: any) => void, oncomplete?: () => void): void
    }

    export module optionset {
        function addOption(attribute: string, value: number, index: number): void;
        function removeOption(attribute: string, value: number): void;
        function clearOptions(attribute: string): void;
        function setOptionSetValues(attribute: string, currentValue: number, oAvailableArray: [number], optionalControlAttribute?: string): void;
    }
    export module fields {
        function SetLookupValue(fieldName: string, id: string, name: string, entityType: string): void;
        function forceSubmitAllDirtyAttributes(input: string): void;
        function doesControlHaveAttribute(control: string): boolean;
        function disableAllFields(): void;
        function alertTheDirtyOnes(): void;
        function hideField(fieldname: string): void;
        function showField(fieldname: string): void;
        function addFieldValidationRule(field: string, rule: (value: any) => boolean): void;
        function addNotification(field: string, text: string): void;
        function clearNofification(field: string): void;
        function addAutocomplete(field: string, values: [string], command?: () => void, commandLabel?: string): void;
    }
    export module form {
        function IsFormValidForSaving(): boolean;
        function hideTab(tabName: string): void;
        function showTab(tabName: string): void;
        function sectionDisable(sectionname: string, disablestatus: boolean): void;
        function showSection(tabName: string, sectionName: string): void;
        function hideSection(tabName: string, sectionName: string): void;
        function openEntityForm(entitytype: string, id: string): void;
    }
    export module general {
        function guidsAreEqual(guid1: string, guid2: string): boolean;
        function getODataEndPoint(): string;
        function parseDateValues(crmDatestring: string): Date;
        function getRequestObject(): any;
    }
    export module user {
        function userHasAnyOfRolesCSV(rolenamescsv: string, callback: (value: boolean) => void): void;
    }
    export module adaljs {
        function getTokenAdaljs(config: adajsconfig, success: (token: string) => void, error: (e: string) => void): void;
    }
    export module events {
        function subscribe(action: string, callback: (data: any) => void): void;
        function raise(action: string, data: any): void;
    }

}

interface adajsconfig {
    instance: string,
    tenant: string,
    clientId: string,
    postLogoutRedirectUri: string,
    endpoints: {
        orgUri: string
    },
    cacheLocation: 'localStorage' // enable this for IE, as sessionStorage does not work for localhost.
}

interface Xrm {
    isLocalhost: boolean;
    Page: any;
    Utility: any;
}