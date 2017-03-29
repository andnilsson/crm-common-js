#crm-common-js
Common library för att skriva javascript mot crm
Fungerar med es5/es6/es7 och typescript

###installation
1. Kopiera, git-clona eller intstallera via npm
2. Ladda upp till dyn365
##npm
```
npm install crm-common-js --save
```

##git
```
git clone https://tfs.stratiteq.se/tfs/Stratiteq/Internal/_git/CRM
```

###Komplett definition av alla funktioner, dess parametrar och returtyper
[Se typescript definition-filen](https://tfs.stratiteq.se/tfs/Stratiteq/Internal/_git/CRM?path=%2Fcrm-common-js.d.ts&version=GBmaster&_a=contents)

###versioner
Så småningom kommer en flik med releaser finnas tillgängligt.
Just nu gör det inte det, och senaste versionen av master kommer att passa till senaste versionen av crm om inget annat sägs


###uppbyggnad
Är konstruerad i ett antal moduler:
-common
  -Xrm
  -webapi
  -optionset
  -fields
  -form
  -general
  -user
  -adaljs
  -events

Nedan följer förklaringar på övergripande nivå för varje modul

##common
Innehåller "genvägar" till andra funktioner. Dessa är de funtioner som är mest frekvent använda. Definitionerna ser ut såhär:
```
function getTab(tabname: string): any;
function getField(fieldname: string): any;
function getWebapiFormattedIdFromLookup(lookupfield: string): string;
function getControl(controlname: string): any;
function getCurrentId(): string;
function setFormNotification(message: string, level: string): void
```

getWebapiFormattedIdFromLookup och getCurrentId "tvättar" id-strängen så att den går att använda som queryparameter eller uri i webapit

##Xrm
har egentligen bara en metod
```
common.Xrm.get()
```
Detta returnernerar Xrm objectet från crm om det finns tillgängligt.
Den kollar igenom window, window.opener och window.parent och letar efter Xrm-objectet.
Om den inte hittar objektet nånstans, kommer den att returnera en mockad instans med de vanligaste funktionerna tillgängliga.

Detta används för att underlätta att köra webbresurser i localhost eftsom man aldrig behöver bry sig om var koden körs, Xrm-funktionalitet är alltid tillgänglig (i mockad variant).

Det mockade xrm-objektet har en property för att indikera om man är i ett crm context eller inte:
```
common.Xrm.get().isLocalhost
```
__Notera att detta faktist inte anger om man är localhost eller inte, utan bara om crm-contextet är tillgängligt__
Vill man veta om man är i localhost eller rekomenderas istället
```
window.location.hostname
```

##webapi
Har metoder för alla operationer mot webapit
Används såhär för att exempelvis göra en retrieve multiple records
```
common.webapi.retrievemultiplerecords("accounts", query, (accounts) => {    
    resolve(accounts);    
});
```

Värt att notera:
*retrievemultiplerecords har inbyggd paginering. Callback kommer att kallas när alla pages är hämtade
*createrecord kommer att returnera id:t på det skapade objektet. Används propertyn 'returnRepresentation' kommer hela det skapade objektet att returneras

##optionset
Används för att manipulera optionsets på formulär

##fields
Används för fält-specifika operationer

addFieldValidationRule kan användas för validering av inmatade värden. Om valideringsregeln inte är sann kommer det förra tillåtna värdet åter att matas in

addAutocomplete är en genväg för autocomplete:
[MSDN referens](https://msdn.microsoft.com/en-us/library/mt607648.aspx)

##general
Icke form eller fält specifika funktioner 

##user
Innehåller bara en funktion som kollar om en användare har någon av de kommaseparerade namngivna roller man skickar in

##adaljs
Används för att authensiera användaren mot office365. Eftersom användaren redan är inloggad om man gör detta inne i dyn365 kommer användaren bli re-directed till nuvarande sida igen, men man har nu en access token man kan använda för att anropa web-api eller vad man nu vill göra. Config man skickar in som första parameter ser ut såhär:
```
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
```

##events
en dictionary av events, som kan raisas on demand

För events som ska triggas av fältändringar rekomenderas istället standardfunktionalitet:
``` 
common.getField("stq_fieldname").addOnChange(() => {

});
``` 



