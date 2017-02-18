
function getSelectedTabs(tabsToClose, callback){
  var queryInfo = {
    url: tabsToClose
  }
  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs);
  });
}

/**
  * Get the urls of all tabs in the active window
  *
  */
function getCurrentWindowTabs(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs);
  });
}

function renderStatus(statusText) {
  document.getElementById('status').innerHTML = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  var txt = document.getElementById("txtGrouping");
  var d = new Date();
  txt.value = "BMK2.0-" + d.toLocaleString();

  getCurrentWindowTabs(function(tabs) {
    var text = "";
    console.log(tabs);
    for(var i = 0; i < tabs.length; i++) {
      var url = tabs[i].url;
      console.log(url);
      text = text + "<br /><input type='checkbox' name='chk' value='" + url + "'>" + url;
    }

    renderStatus(text);
  });

  var btn = document.getElementById('btn');

  btn.addEventListener('click', function() {
    var checkboxes = document.getElementByName("chk");
    var checkboxes_checked = [];

    for ( var i = 0; i < checkboxes.length; i++ ) {
      if ( checkboxes[i].checked ) {
        checkboxes_checked.push(checkboxes[i].value);
      }
    }

    var bookmarkParam = {
      "title": document.getElementByID("txtGrouping").value
    }

    // Create a new folder using the chrome api
    chrome.bookmarks.create(bookmarkParam, function(newFolder) {

      for( var i = 0; i < checkboxes_checked.length; i++ ) {
        var params = {
          "parentId": newFolder.id,
          "title": checkboxes_checked[i],
          "url": checkboxes_checked[i]
        }

        chrome.bookmarks.create(params);
      }
    });

    getSelectedTabs(checkboxes_checked, function(tabs) {
      for ( var i = 0; i < tabs.length; i++ ){
        chrome.tabs.remove(tabs[i].id);
      }
    });
  });
});
