/*
 * EventPages/netflix.js is run in an Event Page
 * (https://developer.chrome.com/extensions/event_pages) and is responsible for
 * managing the page action (i.e. toolbar item). The responsibilities include
 * making sure the page action is shown (i.e. enabled) on the Netflix webpage
 * and handling the event that is generated when the page action is clicked.
 *
 * The JavaScript that actually does something useful when the page action is
 * clicked lives in ContentScripts/netflix.js.
 */

// Add a declarative content rule to only enable the page action on
// netflix.com.
// https://developer.chrome.com/extensions/declarativeContent
chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([ {
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: { hostContains: "netflix.com" },
				})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});

chrome.pageAction.onClicked.addListener(function(tab) {
	chrome.tabs.sendMessage(tab.id, {"name": "toolbarItemClicked"}, function(response) {
		// TODO: Change the icon instead of the tooltip title
		if (response.isBlurEnabled) {
			chrome.pageAction.setTitle({"title": "Enabled", "tabId": tab.id});
		} else {
			chrome.pageAction.setTitle({"title": "Disabled", "tabId": tab.id});
		}
	});
});

