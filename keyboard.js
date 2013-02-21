// Extend jquery to change selection ranges
$.fn.selectRange = function(start, end) {
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

var keyboard = {

	// Keep track of the active text input element
	$activeElement: null,

	// Simple toggle for enabling/disable the keyboard
	enabled: true,
	
	// The keyboard jquery object. Cached for performance
	$keyboard: null,
	
	// The key groups. Each group is an array of characters.
	keyGroups: [],

	// Keep track if we are moving or not
	moving: false,
	
	// Keep track of information about the mouse for moving
	mouse: {
		position: {x: 0, y: 0},
		offset: {x: 0, y: 0},
		getOffsetPosition: function getOffsetPosition() {
			return {
				x: keyboard.mouse.position.x + keyboard.mouse.offset.x,
				y: keyboard.mouse.position.y + keyboard.mouse.offset.y
			};
		}
	},
	
	// The init function
	init: function init() {
	
		// For each key group
		for(var keyGroupIndex = 0; keyGroupIndex < keyboard.keyGroups.length; keyGroupIndex++) {
			var keyGroup = keyboard.keyGroups[keyGroupIndex];
			
			// Create the button group
			$(".keyboardContent").append("<span class='btn-group'></span>");
			var $buttonGroup = $(".keyboardContent .btn-group:last-child");
			
			// For each key
			for(var keyIndex = 0; keyIndex < keyGroup.length; keyIndex++) {
                var text = keyGroup[keyIndex],
                    key = text.replace(/&thinsp;/g, "");
                $buttonGroup.append("<button class='btn btn-small' data-key='"+key+"'>"+text+"</button>");
			}
		}
		
		// Set up functionality
		// First add a focus listener for text boxes
		keyboard.setupTextListeners();
		
		$(".keyboard button").click(function() {
			if(keyboard.$activeElement !== null) {
				var val = keyboard.$activeElement.val(),
					key = $(this).text(),
					length = val.length + key.length;
					
				// Update the text and move the cursor to the end
				keyboard.$activeElement.val(val + key).focus().selectRange(length, length);
			}
		});
	},
	
	// The move function
	move: function move() {
		var pos = keyboard.mouse.getOffsetPosition();
		keyboard.$keyboard.css("left", pos.x + "px").css("top", pos.y + "px");
		
		// Call this again in 25 ms if we are not done moving
		if (keyboard.moving)
			setTimeout(function() {
				keyboard.move();
			}, 25);
	},


    setupTextListeners: function setupTextListeners() {
        $("input[type='text'], textarea").focus(function() {
            if (keyboard.enabled) {
                keyboard.$activeElement = $(this);
                keyboard.$keyboard.show();
            }
        });
    }
};

$(function() {

	// Append the keyboard code to the document
	$("body").append('<div class="keyboard"><div class="keyboardHeader">IPA Keyboard<span class="pull-right"><a href="#">&times;<a></span></div><div class="keyboardContent"></div></div>');

	// Cache the keyboard jquery object
	keyboard.$keyboard = $(".keyboard").hide();

	// Make the keyboard dragable
	$(".keyboardHeader").mousedown(function(evt) {
		var keyboardOffset = keyboard.$keyboard.offset();
		keyboard.mouse.offset = {x: keyboardOffset.left - evt.pageX, y: keyboardOffset.top - evt.pageY};
		keyboard.moving = true;
		keyboard.move();
	});
	$(document).mouseup(function() {
		keyboard.moving = false;
	});
	$(document).mousemove(function(evt) {
		keyboard.mouse.position = {x: evt.pageX, y: evt.pageY};
	});
	
	// Add the close button functionality
	$(".keyboardHeader a").click(function() {
		keyboard.$keyboard.hide();
		return false;
	});
	
});
