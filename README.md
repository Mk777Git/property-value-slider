# property-value-slider
Creates a HTML custom element. In the Element is a slider. With this slider you can change a propery value of an HTMLElement. I use it to explore some aspects of CSS.

## params
### destId (string)
Id of the HTMLElement with the property to be changed. Element has to be in normal DOM not shadow
### destPropName (string)
Name of the property to be changed. 
### destPropUnit (string)
The unit of the property value. It is added to the destPropName. If the unit is 'contentLength', the slider adds random word. In this case the slider value is the count of chars.

### hideNr
Without this Parameter two numbers are insert right to the slider. The first shows the current value. The second the max value.
A click on this numbers open an Dialog zu change the value. If "hideNr" is set, then the numbers are not apear and you can't change the min/max values on the fly. This parameter is new in 1.0.5. Before the parameter "showNr" exists.  

### min (integer)
The min value the slider returns
Standard: 1

### max (integer)
The max value the slider returns
Standard: 100

### startValue (integer)
The start value for the property. This value is set once at the beginning.

### newContent 
Is only relevant, if the parameter destPropUnit = "contentLength".
Without this parameter a fix LOREM text ist created at startup. 
If the parameter "newContent" is set, every time you change the size of the content a new random LOREM is created to fill the content. 
So every time you change the lenght you get a new Text.

### hideLabel
Without this Parameter a label is draw on the left side of the slider. It will show the "destId"."destPropName" ("destPropUnit").

## Example
```html
<content-slider 
    id="range-div-test" 
    destId="div-test" 
    destPropertyName="style.fontSize" 
    destPropertyUnit="px"
    min="1" 
    max="40" 
    startValue="14">
</content-slider>
<div id="div-test">The font size of this div is controled by the slider</div>
```