chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		var button = document.querySelector("a[data-bind*='urlPGN']");
		if(button){
			button.setAttribute("href", "#");
			button.style.backgroundColor = "green";
			button.addEventListener("click", (event) => { 
				event.preventDefault(); 
				downloadPgn(); 
			}, true);
		}

	}
	}, 10);
});

function downloadPgn(){
	chrome.runtime.sendMessage(pgn());
}

function pgn(){
	var gameRoot = document.querySelector("div[data-bind*='tmpl-move-viewer-moves']");
	var gameMoves = gameRoot.querySelector("span[data-bind*='tmpl-mv-variation']");
	var result = gameRoot.querySelector("span[class*='cbMoveResult']").textContent;

	var moves = ["dummy"];

	for(var moveNode of gameMoves.children){
		var moveText = moveNode.querySelector("span[class*='cbRootMove']").textContent;
		moves.push(moveText);
	}

	var gameInfo = document.querySelector("div[data-bind*='tmpl-game-info']");

	var whitePlayer = gameInfo.querySelector("a[data-bind*='white()']").textContent;
	var blackPlayer = gameInfo.querySelector("a[data-bind*='black()']").textContent;

	var eventName = gameInfo.querySelector("a[data-bind*='data().roomData.name']").textContent;
	var round = gameInfo.querySelector("span[data-bind*='data().round']").textContent;

	var pgn = `
${pgnTag("Event", eventName)}
${pgnTag("Round", round)}
${pgnTag("White", whitePlayer)}
${pgnTag("Black", blackPlayer)}
${pgnTag("Result", result)}

${moveListString(moves)}
`;

	return pgn;
}

function pgnTag(key, value){
	return `[${key} "${value}"]`;
}

function moveListString(moves){
	var result = "";
	for(var i = 1; i < moves.length; i += 2){
		if(i > 1){
			result += " ";
		}
		result += `${(Math.floor(i / 2) + 1).toString()}. ${moves[i]}`;
		if(i + 1 < moves.length){
			result += ` ${moves[i + 1]}`;
		}
	}

	return result;
}