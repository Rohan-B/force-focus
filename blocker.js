//this is run for every tab that gets opened
chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	  console.log(response.farewell);
});
