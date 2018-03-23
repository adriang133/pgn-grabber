chrome.runtime.onMessage.addListener((arg, sender, sendResponse) => {
    if(arg.fileName && arg.textContent){
        var blob = new Blob([arg.textContent], {type: "text/plain"});
        var url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url,
            filename: arg.fileName
        });
    }
});