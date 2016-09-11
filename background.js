/*chrome.tabs.onCreated.addListener(function(){
 window.open("index.html", "extension_popup", "width=330,height=260,status=no,scrollbars=yes,resizable=no");
 });*/

var oldLocation;
var pages = 15;
var counter = 0;
var popupOption = "random";
var duration = 3;
var notId = "";

safari.application.addEventListener('popover', function(event) {
  event.target.contentWindow.location.reload();
}, true);

if(localStorage.popupOption) {
  popupOption = localStorage.popupOption
} else {
  popupOption = "random";
}


if(localStorage.duration) {
  duration = +localStorage.duration
}


oldLocation = safari.application.activeBrowserWindow.activeTab.url;

safari.application.addEventListener("message", function(e) {
  switch(e.name) {
    case "tabUpdate":
      var tab = e.target;
      if(tab.url && tab.url != oldLocation && !(oldLocation && oldLocation.indexOf(".google.") != -1 && tab.url.indexOf(".google.") != -1)) {
        oldLocation = tab.url;
        counter++;
        if(((popupOption == "random" && counter == pages) || popupOption == "everyPage")) {
          new Notification("Rate this page, by clicking GiveScores in toolbar!");
          counter = 0;
        }
      }
  }
}, false);