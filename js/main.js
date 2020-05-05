var audio = document.getElementById('audio');
var playpause = document.getElementById("play");
var timer;
var percent = 0;
const elForm = $('#form');
const elResultItemTemplate = document.querySelector('#results').content;
const elResultList = document.querySelector('.results-list');
const elSearchInput = $('.search-text');
const elTableTemplate = document.querySelector('#table-member').content;
const elTable = document.querySelector('.list');
const elToggleMusic = document.querySelector('.toggle-music');
const elMusicsList = document.querySelector('.list');
const elPrevBtn = document.querySelector('.fa-backward');
const elNextBtn = document.querySelector('.fa-forward');
const elSearchBtn = document.querySelector('.search-btn');
const elCheckBox = document.querySelector('#magicButton');
const elFormWrapper = document.querySelector('.form-wrapper');

let currentMusic = [];
showResults(data);


elToggleMusic.addEventListener('click', function() {
  this.querySelector('i').classList.toggle('fa-pause');
  const elAllMusics = elResultList.querySelectorAll('.bars');
  const elAllMusicImages = elResultList.querySelectorAll('.music-image');
  elAllMusicImages.forEach( img => {
    img.classList.remove('img--active');
  }); 
  elAllMusics.forEach( bars => {
    bars.classList.remove('bars--active');
  });
  if (audio.paused || audio.ended) {
    audio.play();
    let index = currentMusic.indexOf(parseInt(elToggleMusic.dataset.id,10));
    elResultList.children[index].firstElementChild.children[2].classList.add('bars--active');
    elResultList.children[index].firstElementChild.children[1].classList.add('img--active');
  } else {
    audio.pause();
  }
});

audio.onended = function(){
  elToggleMusic.querySelector('i').classList.remove('fa-pause');
};

audio.addEventListener("playing", function(_event) {
  var duration = _event.target.duration;
  advance(duration, audio);
});
audio.addEventListener("pause", function(_event) {
  const id = audio.dataset.id;
  clearTimeout(timer);
});
var advance = function(duration, element) {
  var progress = document.getElementById("progress");
  increment = 10/duration
  percent = Math.min(increment * element.currentTime * 10, 100);
  progress.style.width = percent+'%'
  startTimer(duration, element);
}
function startTimer(duration, element) { 
  if(percent < 100) {
    timer = setTimeout(function (){advance(duration, element)}, 100);
  }
}

function showError(err) {
  console.log(err);
}

function showResultInList(response) {
  elTable.innerHTML = '';

  let tableFragment = document.createDocumentFragment();
  let i = 1;
  response.data.forEach(item => {
    let tableClone = document.importNode(elTableTemplate, true);
    
    tableClone.querySelector('.title h6').textContent = item.title;
    tableClone.querySelector('.nr h5').textContent = i;
    tableClone.querySelector('button').dataset.id = item.id;
    i++;
    tableFragment.appendChild(tableClone);
  });
  elTable.appendChild(tableFragment);
}

function showResults(response) {
  elResultList.innerHTML = '';

  let resultFragment = document.createDocumentFragment();
  
  currentMusic = [];
  
  response.data.forEach(item => {
    currentMusic.push(item.id);
    let resultClone = document.importNode(elResultItemTemplate, true);
    resultClone.querySelector('li').dataset.id = item.id;
    resultClone.querySelector('.music-title').textContent = item.title;
    resultClone.querySelector('.play-button').dataset.id = item.id;
    audio.dataset.id = item.id;
    resultClone.querySelector('.music-image').src = item.album.cover_big;
    resultFragment.appendChild(resultClone);
  });
  elResultList.append(resultFragment);
};



showResultInList(data);

// elForm.addEventListener('submit', (evt) => {
//   evt.preventDefault();
//   let query = elSearchInput.value;
//   let link = 'https://api.deezer.com/search?q=eminem'
//   load(link, showResults, showError);
// });

var settings = {
  "async": true,
  "crossDomain": true,
  "url": null,
  "method": "GET",
  "headers": {
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    "x-rapidapi-key": "499688d523mshae309cf1a2cd004p167e34jsnc464315f6121"
  }
}



let searchURL = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=';
let searchID = 'https://deezerdevs-deezer.p.rapidapi.com/track/';
elForm.on('submit', (evt) => {
  evt.preventDefault();

  let query = elSearchInput.val();
  let link = searchURL + query;
  settings.url = link;
  elResultList
  $.ajax(settings).done(function (response) {
    if (window.matchMedia("(max-width: 400px)").matches) {
      showResultInList(response);
      return;
    }
    showResults(response);
    showResultInList(response);
  });
});

function playMusic(matchingEl, evt , elWrapper) {
  if (evt.target.matches(matchingEl)) {
      settings.url = searchID + evt.target.dataset.id;
      

      $.ajax(settings).done(function (response) {
        
    
        audio.firstElementChild.src = response.preview;
        elToggleMusic.dataset.id = evt.target.dataset.id;
        $('.coverImage').css('background', `url(${response.album.cover_xl}) no-repeat`);
        $('.coverImage').css('background-size', 'cover');
    
        $('.info h4').text(`${response.title}`);
        $('.info h3').text(`${response.artist.name}`);
        document.querySelector('.current h2').textContent = response.title.toUpperCase();
        audio.load();
        
        if (!elToggleMusic.querySelector('i').classList.contains('fa-pause')) {
          elToggleMusic.querySelector('i').classList.toggle('fa-pause');
        }
        audio.play();
        const elAllMusics = elResultList.querySelectorAll('.bars');
        const elAllMusicImages = elResultList.querySelectorAll('.music-image');
        elAllMusicImages.forEach( img => {
          img.classList.remove('img--active');
        }); 
        elAllMusics.forEach( bars => {
          bars.classList.remove('bars--active');
        });
        let index = currentMusic.indexOf(parseInt(elToggleMusic.dataset.id,10));
        elResultList.children[index].firstElementChild.children[2].classList.add('bars--active');
        elResultList.children[index].firstElementChild.children[1].classList.add('img--active');
      });
      evt.target.classList.remove('is-paused');
      if (!elToggleMusic.querySelector('i').classList.contains('fa-pause')) {
        elToggleMusic.querySelector('i').classList.toggle('fa-pause');
      }
      audio.pause();
  }
}

elMusicsList.addEventListener('click', (evt) => {
  playMusic('button', evt, elMusicsList);
});
elResultList.addEventListener('click', (evt) => {
  playMusic('.play-button', evt, elResultList);

  
});

function ajaxForControllers(settings,i) {
  $.ajax(settings).done(function(response) {
    elToggleMusic.dataset.id = currentMusic[i];
    audio.firstElementChild.src = response.preview;

    $('.coverImage').css('background', `url(${response.album.cover_xl}) no-repeat`);
    $('.coverImage').css('background-size', 'cover');

    $('.info h4').text(`${response.title}`);
    $('.info h3').text(`${response.artist.name}`);
    document.querySelector('.current h2').textContent = response.title.toUpperCase();
    audio.load();
    
    if (!elToggleMusic.querySelector('i').classList.contains('fa-pause')) {
      elToggleMusic.querySelector('i').classList.toggle('fa-pause');
    }
    audio.play();
    const elAllMusics = elResultList.querySelectorAll('.bars');
    const elAllMusicImages = elResultList.querySelectorAll('.music-image');
    elAllMusicImages.forEach( img => {
      img.classList.remove('img--active');
    }); 
    elAllMusics.forEach( bars => {
      bars.classList.remove('bars--active');
    });
    let index = currentMusic.indexOf(parseInt(elToggleMusic.dataset.id,10));
    elResultList.children[index].firstElementChild.children[2].classList.add('bars--active');
    elResultList.children[index].firstElementChild.children[1].classList.add('img--active');
  });
  if (!elToggleMusic.querySelector('i').classList.contains('fa-pause')) {
    elToggleMusic.querySelector('i').classList.toggle('fa-pause');
  }
  audio.pause();
}

elNextBtn.addEventListener('click', () => {
  let id = parseInt(elToggleMusic.dataset.id,10);
  var i = currentMusic.indexOf(id) + 1;
  if (currentMusic.length === i) {
    i = 0;
  }
  // debugger;
  settings.url = searchID + currentMusic[i];
  ajaxForControllers(settings, i);
});

elPrevBtn.addEventListener('click', () => {
  let id = parseInt(elToggleMusic.dataset.id,10);
  var i = currentMusic.indexOf(id) - 1;
  if (i < 0) {
    i = currentMusic.length - 1;
  }
  // debugger;
  settings.url = searchID + currentMusic[i];
  ajaxForControllers(settings, i);
});


elSearchBtn.addEventListener('click', () => {
  if (elCheckBox.checked === false) {
    elCheckBox.checked = true;
    elFormWrapper.classList.add('form--active');
    elSearchBtn.style.color = 'black';
  } else {
    elSearchBtn.style.color = 'white';
    elCheckBox.checked = false;
    elFormWrapper.classList.remove('form--active');
  }
});