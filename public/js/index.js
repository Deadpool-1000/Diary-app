const jokeBtn = document.querySelector(".get-joke");
const jokeSpan = document.querySelector(".joke");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");

jokeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const url = "http://localhost:3000/joke";
  getRequest(url)
    .then((joke) => {
      return joke.json();
    })
    .then((data) => {
      jokeSpan.innerHTML = data.body;
    })
    .catch((e) => {
      jokeSpan.innerHTML = "Error could'nt get a joke!😭";
    });
});

const getRequest = async (url) => {
  const req = await fetch(url);
  return req;
};

//Quote of the day logic
window.onload = function () {
  console.log("hello");
  if (!localStorage.getItem("quote")) {
    //render and store
    const url = "http://localhost:3000/quote";
    getRequest(url)
      .then((quote) => {
        return quote.json();
      })
      .then((data) => {
        quote.innerHTML = data.text;
        author.innerHTML = data.author;
        localStorage.setItem("quote", JSON.stringify(data));
        localStorage.setItem("time", new Date().getTime());
      });
  } else {
    //check the time elapsed or render
    const timeSet = localStorage.getItem("time");
    const timeElapsed = new Date().getTime() - timeSet;
    const hoursElapsed = Math.floor((timeElapsed / (1000 * 60 * 60)) % 24);
    if (hoursElapsed >= 24) {
      const url = "http://localhost:3000/quote";
      getRequest(url)
        .then((quote) => {
          return quote.json();
        })
        .then((data) => {
          quote.innerHTML = data.text;
          author.innerHTML = data.author;
          localStorage.setItem("quote", JSON.stringify(data));
          localStorage.setItem("time", new Date().getTime());
        });
    } else {
      const data = JSON.parse(localStorage.getItem("quote"));
      quote.innerHTML = data.text;
      author.innerHTML = data.author;
    }
  }
};
