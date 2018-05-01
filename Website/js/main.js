// TODO: Use real URLs.
const SAFARI_EXT_DOWNLOAD_URL = "#safari";
const FIREFOX_EXT_DOWNLOAD_URL = "#firefox";
const CHROME_EXT_DOWNLOAD_URL = "#chrome";

function configureSecondaryLinkElements(defs) {
	var secondaryDownloadLinks = document
		.getElementById("secondary-download-links")
		.getElementsByTagName("a");

	for (i = 0; i < defs.length; i++) {
		var linkElement = secondaryDownloadLinks[i];
		linkElement.innerText = defs[i]["title"];
		linkElement.href = defs[i]["url"];
	}
}

function showRelevantDownloadButton() {
	// Browser detection copied from https://stackoverflow.com/a/9851769/274649
	// and modified to only include relevant checks.
	var isFirefox = typeof InstallTrigger !== 'undefined';
	var isChrome = !!window.chrome && !!window.chrome.webstore;

	var downloadLink = document.getElementById("download-button");
	var downloadSubtitle = document.getElementById("download-subtitle");

	if (isFirefox) {
		downloadLink.href = FIREFOX_EXT_DOWNLOAD_URL;
		downloadSubtitle.innerText = "for Firefox";
		configureSecondaryLinkElements([
			{title: "Safari", url: SAFARI_EXT_DOWNLOAD_URL}, 
			{title: "Chrome", url: CHROME_EXT_DOWNLOAD_URL},
		]);
	} else if (isChrome) {
		downloadLink.href = CHROME_EXT_DOWNLOAD_URL;
		downloadSubtitle.innerText = "for Chrome";
		configureSecondaryLinkElements([
			{title: "Safari", url: SAFARI_EXT_DOWNLOAD_URL},
			{title: "Firefox", url: FIREFOX_EXT_DOWNLOAD_URL},
		]);
	} else {
		// Probably Safari.
		// Don't modify the default HTML.
	}
}

showRelevantDownloadButton();
