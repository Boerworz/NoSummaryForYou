/*
 * BackgroundScripts/netflix.js is a so called Background Script
 * (https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Background_scripts)
 * and is responsible for managing the page action (i.e. toolbar item). The 
 * responsibilities include making sure the page action is shown (i.e. enabled)
 * on the Netflix webpage and handling the event that is generated when the page
 * action is clicked.
 *
 * The JavaScript that actually does something useful when the page action is
 * clicked lives in ContentScripts/netflix.js.
 */

browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	var isNetflixTab = tab.url.indexOf("netflix.com") != -1;
	if (isNetflixTab) {
		browser.pageAction.show(tab.id);
	} else {
		browser.pageAction.hide(tab.id);
	}
});

browser.pageAction.onClicked.addListener(function(tab) {
	browser.tabs.sendMessage(tab.id, {"name": "toolbarItemClicked"});
});

