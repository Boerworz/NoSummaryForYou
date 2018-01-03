safari.application.addEventListener("command", handleCommand);
safari.application.addEventListener("validate", validate);

// This function is called when a command is received from Safari, i.e. when the
// user clicks the NoSummaryForYou toolbar item
function handleCommand(event) {
	if (event.command == "toggle") {
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("toggle");
	}
}

// This function is called when something in Safari changes that could affect
// the state of the extension, e.g. a tab switch.
function validate(event) {
	var toolbarItem = event.target;
	var activeURL = toolbarItem.browserWindow.activeTab.url
	var isNotViewingNetflix = activeURL == undefined || activeURL.indexOf("netflix.com") == -1;
	toolbarItem.disabled = isNotViewingNetflix;
}

