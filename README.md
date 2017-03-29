#crm-common-js
Common library för att skriva javascript mot crm
Fungerar med es5/es6/es7 och typescript

##npm
npm install crm-common-js --save

##uppbyggnad
Är konstruerad i ett antal moduler:
*Xrm
*webapi
*optionset
*fields
*form
*general
*user
*adaljs
*events

###Xrm
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




