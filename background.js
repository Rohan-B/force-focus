// 
// Name: Rohan Bhargava 
// Date: 8/29/16
// File name: background.js
// Description: Main script runs in the background and when a new tab is opened
//checks it against the database of blocked tabs and then deletes it 
//

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

//this script only runs when a tab content changes  and sends it a message 
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

//get the url of the current tab and check to see if it should be blocked
getCurrentTabUrl(function(url) {
	console.log(url);		
	
	//get the array from chrome storage
	chrome.storage.sync.get("array", function(e) {
		//check if the current url is in the blocked array 
		for(i = 0; i < e.array.length; i++) {
			console.log(e.array[i]);	
			if(url.includes(e.array[i].name)) {
				console.log("block");
				//if it is blocked then close that tab
				chrome.tabs.query({active: true, currentWindow:true}, function(e) {
					console.log(e[0]);
					chrome.tabs.remove(e[0].id);
				});
			}
		}
	});
});
});


