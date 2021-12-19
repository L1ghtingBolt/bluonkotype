// random words http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5
const wordApiUrl = '  https://random-word-api.herokuapp.com/word?number=10&swear=1'
const wordSection = document.getElementById('words')
const userInput = document.getElementById('wordinput')

let words = ''
let desiredSeconds = 30
let time = desiredSeconds;
let timer = ''
let mistakes = 0;

var css = document.getElementById('css');
//Theme selecting
document.getElementById('themes').addEventListener('change', (event) => { 
    css.setAttribute('href', (event.target.value + '.css')) 
  });

const renderNewQuote = async() =>{
    userInput.value = "";
    wordSection.innerHTML = "";
    try{
        //Fetch
        const response = await fetch(wordApiUrl);
        //Store
        let data = await response.json();
         words
        //Access
        words = data.join(' ');
    
        console.log(words);
    }
    catch{
        try{//Fetch
            const response = await fetch('http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5');
            //Store
            let data = await response.json();
             words
            let result = data.map(a => a.word);
            //Access
            words = result.join(' ');
        
            console.log(words);
        }
        catch{
            words = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec. '
        }
    }
    
    
    console.log(words);
    let arr = words.split('').map(value => {
        return `<span class='word-chars'>${value}</span>`
        
    });
    wordSection.innerHTML += arr.join('');
}

// Comparing words
userInput.addEventListener('input', ()=>{
    let chars = document.querySelectorAll('.word-chars');
    // makearrayxdxd
    chars = Array.from(chars);
    
    //arry user chars
    let userChars = userInput.value.split('');

    //loop
    chars.forEach((char,index)=>{
        //Chech for char(char) = userchars[infex]
        if(char.innerText == userChars[index]){
            char.classList.add('success');

        }
        
        //if nothing or backspace
        else if(userChars[index] == null){
            if(char.classList.contains('success'))
                char.classList.remove('success');
            else{
                char.classList.remove('fail');
                char.classList.remove('fail-space');
            }
        }
        
        //if user entered the wrong char
        else{
            //check if already has failed it lol just in case
            if(!char.classList.contains('fail') && !char.classList.contains('fail-space')){
                mistakes += 1;
                if(char.innerText == ' ')
                    char.classList.add('fail-space');
                else
                    char.classList.add('fail');
            }
            document.getElementById('mistakes').innerText = mistakes;
        } 
        //returns true if everything correct
        let check = chars.every(e=>{
            return e.classList.contains('success') || e.classList.contains('fail') || e.classList.contains('fail-space');
        })
        //Happy hour (end if everything is written)
        if(check){
            displayResults();
        }
    }
    )
})

function updateTimer(){
    if(time == 0){
        displayResults();
    }
    else{
        document.getElementById('timer').innerText = --time + 's'
    }
}

//Set timer
const timeReduce =()=>{
    time = desiredSeconds;
    timer = setInterval(updateTimer, 1000)
}

//end
const displayResults = () =>{
    document.getElementsByClassName('result')[0].style.display = 'block';
    clearInterval(timer);
    document.getElementById('stop-test').style.display = 'none';
    userInput.disabled = true;
    let timeTaken = 1;
    if(time != 0) {
        timeTaken = (desiredSeconds - time) / 100;
    }
    document.getElementById('wpm').innerText = (userInput.value.length / 5 / timeTaken).toFixed(1) + 'wpm';
    document.getElementById("accuracy").innerText =
    Math.round(
      ((userInput.value.length - mistakes) / userInput.value.length) * 100
    ) + " %";
    document.getElementById('start-test').style.display = 'block';
    //document.getElementById('start-test').onclick = function(){location.reload(true)};
    
}

const startTest = () =>{
     words = ''
     time = desiredSeconds;
     timer = ''
     mistakes = 0;
    renderNewQuote();
    //Start test
    mistakes = 0;
    timer = ''
    timeReduce();
    userInput.disabled = false;
    document.getElementById('start-test').style.display = 'none';
    document.getElementById('stop-test').style.display = 'block';
    document.getElementsByClassName('result')[0].style.display = 'none';

}

window.onload = () => {
    userInput.value = "";
    css.setAttribute('href', (document.getElementById('themes').value + '.css')) 
    document.getElementById('start-test').style.display = 'block';
    document.getElementById('stop-test').style.display = 'none';
    userInput.disabled = true;
    
};