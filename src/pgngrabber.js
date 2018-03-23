chrome.extension.sendMessage({}, function(response) {
    let readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);

        let button = document.querySelector("a[data-bind*='urlPGN']");
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
    let game = gameInfo();
    let pgn = `
${pgnTag("Event", game.event)}
${pgnTag("Round", game.round)}
${pgnTag("White", game.white)}
${pgnTag("Black", game.black)}
${pgnTag("Result", game.result)}

${game.moveText}
`;
    chrome.runtime.sendMessage({
        fileName: `${game.white}-${game.black} (${game.event}-${game.round}).pgn`,
        textContent: pgn
    });
}

function gameInfo(){
    let gameRoot = document.querySelector("div[data-bind*='tmpl-move-viewer-moves']");
    let gameMoves = gameRoot.querySelector("span[data-bind*='tmpl-mv-variation']");
    let result = gameRoot.querySelector("span[class*='cbMoveResult']").textContent.replace(/\u00BD/g, "1/2");

    let moves = ["dummy"];

    for(let moveNode of gameMoves.children){
        let moveSpan = moveNode.querySelector("span[class*='cbRootMove']");
        if(moveSpan){
            moves.push(moveSpan.textContent);
        }
    }

    let gameInfo = document.querySelector("div[data-bind*='tmpl-game-info']");

    let whitePlayer = gameInfo.querySelector("a[data-bind*='white()']").textContent;
    let blackPlayer = gameInfo.querySelector("a[data-bind*='black()']").textContent;

    let eventName = gameInfo.querySelector("a[data-bind*='data().roomData.name']").textContent;
    let round = gameInfo.querySelector("span[data-bind*='data().round']").textContent.replace( /^\D+/g, '');

    return {
        "event": eventName,
        "round": round,
        "white": whitePlayer,
        "black": blackPlayer,
        "result": result,
        "moveText": moveListString(moves)
    };
}

function pgnTag(key, value){
    return `[${key} "${value}"]`;
}

function moveListString(moves){
    let result = "";
    for(let i = 1; i < moves.length; i += 2){
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