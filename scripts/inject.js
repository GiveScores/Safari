/**
 * Created by yrst on 8/5/2016.
 */
safari.self.tab.dispatchMessage("tabUpdate", window.location.href);
safari.self.addEventListener("message", function(e) {
  if(e.name == "openUrl") {
    var data = e.message;
    window.open(data.url, data.title, data.sizeInfo);
  }
}, false);