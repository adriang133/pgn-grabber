chrome.runtime.onMessage.addListener((arg, sender, sendResponse) => {
    if(typeof arg === "string" && arg.length > 0){
        var blob = new Blob([arg], {type: "text/plain"});
        var url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url
        });
    }
});