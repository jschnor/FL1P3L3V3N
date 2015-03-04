flip-bits
==========================================================================================

Javascript bit objects used to create markup all from javascript with GSAP animation integration.


Framework Logic
====================
js/lib
All framework logic is put within the 'lib' folder. This is seperated from the implementation logic.


Implementation Logic
===================
js/nameofsite.com
Currently in the 'flipeleven.com' folder, but could be a directory name of your choice. This has all the logic used to make the current views of the website.


$bitObject
====================
js/F11P/lib/bit/
This is the core object/namespace used to create elements on the page. Most linking logic is built within this object or an extension of this object. Extensions are in the (js/F11P/lib/bit/extensions) folder. An example of some linking logic is the tween extension. If you open up the (Ext_Tween.js) file you'll see we're the current implementation of the GreenSock animation library on line 14.

DOM & Custom Events
====================
js/F11P/Events.js
This is a crucial component as it's what makes everything interactive. Currently it's used as it's own object in the DOM as opposed to integrating it as part of the $bitObject.

Current 3rd Party Integrations
===================
js/F11P/lib
- Greensock animation library (http://www.greensock.com) - using TweenLite with CSS extension
- history.js (https://github.com/browserstate/history.js) - using for pushstate management
- iscroll (https://github.com/cubiq/iscroll) - may not end up using as it's too much

NOTES:
===================

– If I'm using a double underscore in front of a filename (ex: __nameoffile) that usually means I'm not currently using it, but there may be some information in that file that is useful

– The current name of the object is BIT, which I'm not sold on. Maybe we can come up with something better

– Inheritance is huge in this pattern. We're doing that by defining an Inherit function globally (js/F11P/lib/Global.js) which essentially takes all the public functions and properties of the parent and passes them to the child.
===================
Justin Schnor fixed this as a test for Sprintly integretion in GitHub