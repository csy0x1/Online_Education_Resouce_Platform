var player = videojs('Video');

// When you pass text in options it just creates a control text,
// which is displayed as tooltip when hovered on 
// this button viz the span in you div,

var fullscreen = player.controlBar.getChild("FullscreenToggle")
var index = player.controlBar.children().indexOf(fullscreen)

var myButton = player.controlBar.addChild("button", {}, index);
// There are many functions available for button component 
// like below mentioned in this docs 
// https://docs.videojs.com/button. 
// You can set attributes and clasess as well.

// Getting html DOM
var myButtonDom = myButton.el();
// Since now you have the html dom element 
// you can add click events

// Now I am setting the text as you needed.
myButtonDom.innerHTML = "<span class='WideScreenToggle glyphicon glyphicon-resize-horizontal'></span>";

// Adding a click event function
myButtonDom.onclick = function(){
  $(".OnlinePreviewFileList").slideToggle(1)
  $(".Selector").slideToggle(1)
  $(".navSideBar").slideToggle(1)

  $(".mainContainer").toggleClass("WideScreen")
  $("#Video").toggleClass("WideScreenVideo")
}  