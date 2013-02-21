# VIPAK

jQuery powered virtual IPA keyboard to be used with text input fields

## Setup
Include <code>keyboard.js</code> and <code>keyboard.css</code>. Look at the example HTML file if you need more help.
To initialize, just include the keyboard definition you want. For IPA, include <code>keyboard_ipa.js</code>.

## API
To enable/disable, just flip this boolean switch:

    keyboard.enabled = true;
    keyboard.enabled = false;
    
If you add text fields dynamically you'll need to update the text field listener. Do that like this:

    keyboard.setupTextListeners();
    
## Creating keyboard definitions
Create a JavaScript file. Use this template:

    $(function() {
        keyboard.keyGroups = [
      	    ["a", "e", "i", "o", "u"],
    		["x", "y", "z"]
    	];
    	keyboard.init();
    });
    
Define the key groups. Each group is an array of strings. Include the .js file.
