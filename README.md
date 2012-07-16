VIPAK
=====

jQuery virtual IPA keyboard to be used with text input fields

How to use:


1.  Include the following in the head of the page.
<code>
<head>
  <script type="text/javascript" src="jquery.js"></script>
  <script type="text/javascript" src="ipakeyboard.js"></script>
  <meta http-equiv="Content-Type" content="text/html;" charset="UTF-8" />
  <link href="vipak.css" rel="stylesheet" type="text/css" />
</head>
</code>
  It is recommended to set the charset to utf-8 so that the characters will render correctly.  This project comes encoded in utf-8.
  
2. use the following call to use the keyboard:
<code>
<script>
  vipak(/* options */);
</script>
</code>

3. options:
<code>
<script>
  vipak('.inputclass');
</script>
</code>
This will cause the vipak to be used for anything with the class 'inputclass'.

<code>
<script>
  vipak('.inputclass', dictionary);
</script>
</code>
This will give us a custom keyboard defined by the dictionary object that will operate on an input where class='inputclass'

<code>
<script>
  vipak(dictionary);
</script>
</code>
This will give us a custom keyboard that can be used on any text input.
-------------------------------------------------------------------
dictionary types

small keyboard:
A small keyboard may be defined by a string that includes the characters to be used, ie. 'qerty'.  
If a button is desired to have multiple characters, however, or if one desires to have a title for each button (which shows on hover), the following dictionary type must be used.
Example:
{foo: 'like a bar', a: 'alpha'} 
or if you desire no title hints,
{foo : null, a:null} 

Medium size keyboard:
You must use the following format in the dictionary:
{
  keystroke:
    {
      letter: 'description'
    }
}
where the first object key is the keystroke key, which is recommended to be one character long and a typable character.  The last value may be null, but must be called as: {'char':null}.

Full sized keyboard:
The following dictionary type must be used---

{
  number:
  {
    title:
    [
      {
	keystroke:
	{
	  letter: 'description'
	}
      }
    ]
  }
}
where number is a number value. If the number is 0, then it will be centered [not yet supported].  1 will be main, and any other values will be floated to the right in columns.

5. Keyboard Shortcuts.
  The shortcuts are defined by the dictionary primarily, but the keyboard will actively listen for the following:
  ctrl + shift : If you are in the text area that is activated, this will activate a vipak 'type mode'.
  esc: If you are in the activated text area, this will deactivate vipak 'type mode'.  If you are using the onscreen keyboard, it will hide the keyboard.
  ctrl + esc: if you are in the activated text area, this will hide the keyboard and deactivate 'type mode', if in use.
  
  'type mode':
    when in type mode, the onscreen keyboard contains hints defined by the dictionary on the keystroke key. if you type that character, it will cycle through the letters in that set of letters.