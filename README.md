# Interactive_Form
 TreeHouse FS Project 3 -- Interactive Form

HTML and CSS files remain untouched for this project.

For Exceeds Expectations:

Input validation takes place in two different instances: live-check and submit. Definitions for elements are in an array of objects (helperHints) for each input element type(input, checkbox and select), checkbox fieldset area and Credit Card select area.

Input hint text is specified in the helperHints array for both live-check validation and submit validataion as separate intities. Regexp definitions are also defined for corresopnding input elements.

In this project, successful validation on submission will return (true) thereby refreshing form mimicing submission to a server.
Any element checked with failure will return with focus to that element while any successive failed element will have visual error cues .