# property-value-slider
Creates a HTML custom element. In the Element is a slider. With this slider you can change a propery value of an HTMLElement. I use it to explore some aspects of CSS.

## params
### destId (string)
Id of the HTMLElement with the property to be changed. Element has to be in normal DOM not shadow
### destPropertyName (string)
Name of the property to be changed. 
### destPropertyUnit (string)
The unit of the property value. It is added to the destPropertyName. If the unit is 'contentLength', the slider adds random word. In this case the slider value is the count of chars.

### showNr
If exists two numbers are insert right to the slider. The first shows the current value. The second the max value.

### min (integer)
The min value the slider returns

### max (integer)
The max value the slider returns

### startValue (integer)
The start value for the property. This value is set once at the beginning.

## Example
```html
<content-slider 
    id="range-div-test" 
    destId="div-test" 
    destPropertyName="style.fontSize" 
    destPropertyUnit="px"
    showNr min="1" 
    max="40" 
    startValue="14">
</content-slider>
<div id="div-test">The font size of this div is controled by the slider</div>
```