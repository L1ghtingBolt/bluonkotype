const typingDiv = document.getElementById("typing");
const statsDiv = document.getElementById("stats");

var json;
function getQuote() {
    fetch('https://api.quotable.io/random')
      .then((res) => res.json())
      .then((data) => {
          json = data;
        return data.content;
      });
  }

getQuote();

function reloadPage(){
    location.reload();
}

const startGame = () => {
  typingDiv.innerHTML = "";
  statsDiv.innerHTML = "";

  const text = json.content;

  const characters = text.split("").map((char) => {
    const span = document.createElement("span");
    span.innerText = char;
    typingDiv.appendChild(span);
    return span;
  });

  let cursorIndex = 0;
  let cursorCharacter = characters[cursorIndex];
  cursorCharacter.classList.add("cursor");

  let startTime = null;

  const keydown = ({ key }) => {
    

    if (key === cursorCharacter.innerText) {
      cursorCharacter.classList.remove("cursor");
      cursorCharacter.classList.add("done");
      cursorCharacter = characters[++cursorIndex];
      if (!startTime) {
        startTime = new Date();
      }
    }

    else if (key != cursorCharacter.innerText && key != 'Backspace' && key != 'Shift'){
        cursorCharacter.classList.remove("cursor");
        if(cursorCharacter.innerText == ' ')
        cursorCharacter.classList.add("failed-space");
        else
        cursorCharacter.classList.add("failed");
        cursorCharacter = characters[++cursorIndex];  
        if (!startTime) {
          startTime = new Date();
        }
    }

    if (key == 'Backspace' && cursorIndex >= 1){
        
        cursorCharacter.classList.remove("cursor");
        cursorCharacter = characters[--cursorIndex];
        cursorCharacter.classList.remove("failed");
        cursorCharacter.classList.remove("failed-space");

        cursorCharacter.classList.remove("done");
        cursorCharacter.classList.add("cursor");
        
    }

    if (cursorIndex >= characters.length) {
      // game ended
      const endTime = new Date();
      const delta = endTime - startTime;
      const seconds = delta / 1000;
      const numberOfWords = text.split(" ").length;
      const wps = numberOfWords / seconds;
      const wpm = wps * 60.0;
      const acc = document.getElementsByClassName('failed').length * 100 / characters.length
      document.getElementById("stats").innerText = `WordsPerMinute: ${parseInt(wpm)}\nAccuracy: ${100 - parseInt(acc)}%\nWordsPerSecond: ${parseFloat(wps).toFixed(2)}`;
      document.removeEventListener("keydown", keydown);
      setTimeout(reloadPage, 5000);
      return;
    }

    cursorCharacter.classList.add("cursor");
  };
  
  document.addEventListener("keydown", keydown);
};
setTimeout(startGame, 1500);
