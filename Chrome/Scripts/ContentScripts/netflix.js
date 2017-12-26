/*
 * ContentScripts/netflix.js is a Content Script
 * (https://developer.chrome.com/extensions/content_scripts) which is injected
 * into any netflix.com tab. It's responsible for receiving messages from
 * EventPages/netflix.js and performing a suitable action (such as toggling if
 * blur is enabled or not).
 */

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.name == "toolbarItemClicked") {
		toggleElementBlur();
	}
});

var selectors = [
	/* Idle pause menu */
	".playback-longpause-container > .content > p:not(#yw-label)",
	/* Episode list in the player */
	".episode-list-synopsis",
	/* The large, featured content at the top of the start page */
	".billboard .synopsis",
	/* Synopses in the cards in Browse, when hovering over them */
	".bob-card .synopsis",
	/* Synopses in the expanded, full-width content in Browse (after clicking a card) */
	".jawbone-overview-info .synopsis",
	/* Synopses for episode list in Browse */
	".episodeSynopsis",
	/* Synopses for the "More Like This" list in Browse */
	".simsSynopsis",
	/* Synopsis for the next episode after an episode has completed */
	".player-postplay-episode-synopsi",
];

var noBlurStyleNode = null;

function toggleElementBlur() {
	// To disable blur we add a <style> element to the page which contains a
	// `filter: none !important` style for all the selectors that we've
	// previously added a blur to. This new style takes precedence over the old
	// style.
	// We need to use the same selectors to make sure that the noblur style
	// takes precedence, e.g. we can't just set the filter to none on the `body`
	// selector (even if we use `!important`). 
	if (noBlurStyleNode == null) {
		noBlurStyleNode = document.createElement("style");
		noBlurStyleNode.innerHTML = selectors.join(", ") + "{ filter: none !important; }";
	}

	// Update the icon to reflect the new state
	var blurEnabled = !toggleNode(noBlurStyleNode);
	return blurEnabled;
}

function toggleNode(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
		return false;
	} else {
		document.body.appendChild(node);
		return true;
	}
}

