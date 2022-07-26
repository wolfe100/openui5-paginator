# openui5-paginator

openui5-paginator is a SAPUI5 Custom Control that allow you to handle large data in a Table. Navigation is done via paging.

![Pagiantor preview](https://raw.githubusercontent.com/StErMi/openui5-pagianator/master/preview.PNG)

## Demo

You can checkout a demo with different configuration parameter here: https://stermi.github.io/openui5-qrcode/test/demo/

## Usage

### Configure manifest.json

Add the library to sap.ui5 dependencies list and configure the resourceRoots to point where you uploaded the custom library.
In this case it is the "thirdparty" folder in your project. This folder must be in the webapp root location.

```json
"sap.ui5": {
    ...
	"dependencies": {
		"minUI5Version": "1.102.2",
		"libs": {
    		...
			"syshub.controls": {}
		}
	},
	"resourceRoots": {
		"syshub.controls": "./thirdparty/syshub/controls/"
	}
}
```

### Add the custom control inside an XML View

First of all add the namespace to the View

```xml
xmlns:lab="syshub.controls"
xmlns:t="sap.ui.table"

```

And then you can simply add the Paginator custom control to your "sap.ui.table"

```xml
<t:Table ...>
    <t:footer>
        <lab:Paginator id="idPaginator"
                       currentPage="{modelEntriesMetadata>/currentPage}"
                       entriesAbsolute="{modelEntriesMetadata>/entriesAbsolute}"
                       entriesPerPage="{modelEntriesMetadata>/entriesPerPage}"
                       numberOfVisiblePages="10"
                       showGoto="true"
                       entriesPerPageVisible = "true"
                       showSpinner="{modelEntriesMetadata>/showSpinner}"
                       page="onPage"
                       entriesPerPageChanged = "onEntriesPerPageChanged">
        </lab:Paginator>
    <t:footer>
    <t:columns>
        ...
    </t:columns>
</t:Table>
```

## Parameters

| Name                 | Type   | Default | Description
|:---------------------|:-------|:--------| :---------  |
| currentPage          | number | 0       | The current selected page or the page to set
| entriesAbsolute      | number | 0       | The absolute count of the entires given by the query
| showGoto             | bool   | false   | Shows the direct GOTO input field
| entriesPerPage       | int    | 10      | How much entries should shown of each page
| numberOfVisiblePages | number | 10      | How much pages shown which are directly selectable
| showSpinner          | bool   | false   | Shows a spinner to give the user information to get data from the server

## Events

| Name                 | Type   | Default | Description
|:---------------------|:-------|:--------| :---------  |
| currentPage          | number | 0       | The current selected page or the page to set
| entriesAbsolute      | number | 0       | The absolute count of the entires given by the query
| showGoto             | bool   | false   | Shows the direct GOTO input field
| entriesPerPage       | int    | 10      | How much entries should shown of each page
| numberOfVisiblePages | number | 10      | How much pages shown which are directly selectable
| showSpinner          | bool   | false   | Shows a spinner to give the user information to get data from the server

## Methods

| Name |  Description
| :---- | :------------------- |
| reDraw | Draw the QRCode. If the QR Code does not exist it creates a new one, if it already exist it just refresh it
| clear | Clear the QR Code
| getText | Return the text of the QR Code
| setText | Set a new text of the QR Code
| getWidth | Return the width of the QR Code
| setWidth | Set the width of the QR Code
| getHeight | Return the text of the QR Code
| setHeight | Set the height of the QR Code
| getColorDark | Return the RGB dark color of the QR Code
| setColorDark | Set the RGB dark color of the QR Code
| getText | Return the text of the QR Code
| getColorLight | Return the RGB light color of the QR Code
| setColorLight | Set the RGB light color of the QR Code
| getCorrectLevel | Return the Error Correction Level of the QR Code
| setCorrectLevel | Set the Error Correction Level of the QR Code

## Build

If you would like to extend and customize the control, you can easily do that but re-building the code with just a simple Grunt command:

```
npm install
grunt build
```

## Credits

Emanuele Ricci

 - Email: [stermi@gmail.com](stermi@gmail.com)
 - Twitter: [@StErMi](https://twitter.com/StErMi)

## License
This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details
