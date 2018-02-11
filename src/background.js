chrome.runtime.onMessage.addListener((arg, sender, sendResponse) => {
	var blob = new Blob([arg], {type: "text/plain"});
	var url = URL.createObjectURL(blob);
	chrome.downloads.download({
		url: url
	});
});