safari.self.addEventListener("message", handleMessage);

/* This function is called when the script receives a message from the App
 * Extension.
 */
function handleMessage(event) {
	if (event.name == "toolbarItemClicked") {
		toggleElementBlur();
	}
}

var selectors = [
	/* Idle pause menu */
	".PlayerControls--container > div:not(.controls-full-hit-zone):not(.PlayerControls--main-controls) > .evidence-overlay > p:first-of-type",
	/* Episode list in the player */
	".episode-list .synopsis",
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

	var blurEnabled = !toggleNode(noBlurStyleNode);
	if (blurEnabled) {
		displayNotification("Summaries hidden");
	} else {
		displayNotification("Summaries revealed");
	}
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

var notificationNode = null;
var notificationTimeoutID = null;

function displayNotification(message) {
	if (notificationNode == null) {
		notificationNode = document.createElement("div");
		notificationNode.className = "nosummaryforyou-extension-notification";
	}
	notificationNode.innerText = message;

	if (notificationNode.parentNode == null) {
		document.body.appendChild(notificationNode);
	}

	if (notificationTimeoutID) {
		window.clearTimeout(notificationTimeoutID);
	}

	notificationTimeoutID = window.setTimeout(function() {
		notificationNode.parentNode.removeChild(notificationNode);
	}, 3000);
}

