const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');


setTimeout(function () {
  alert("You can use 'Tab' key on the key board for navigating through buttons and inputs. Thank you for using our website.");
}, 1500);
// selected image 
let sliders = [];

// api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  toggleSpinner();
}


const getImages = (query) => {
  toggleSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {
      if (data.total === 0) {
        document.getElementById("spinner-container").innerHTML = "";
        alert("No result matched. Please try with another name or check your spelling.");
      } else {
        showImages(data.hits) //here I found a spelling mistake : it was "hitS". 
      }
    })
    .catch(err => {
      document.getElementById("spinner-container").innerHTML = "";
      alert("Some error occurred. Please try again.");
    });
}


// Extra feature : spinner on data loading
const toggleSpinner = () => {
  const spinner = document.getElementById("spinner");
  // toggling spinner
  toggleDisplay(spinner);
  toggleDisplay(sliderContainer);
  toggleDisplay(gallery);
  toggleDisplay(document.getElementById("sliderInputAndButton"));
}


const toggleDisplay = (element) => {
  element.classList.toggle("d-none");
}


let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  //toggles the class "added"
  element.classList.toggle('added');
  let item = sliders.indexOf(img);
  //checking whether the item is in the list
  if (item === -1) {
    sliders.push(img); //pushes new item in the list and the slider
  } else {
    sliders.splice(item, 1); //removes selected item from the list and the slider
  }
}

let timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.');
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector('.main').style.display = 'block';
  const duration = document.getElementById('duration').value || 1000;
  //hide image aria
  imagesArea.style.display = 'none';
  // If duration is negative, the slider will show the pictures from the opposite direction by which they were selected.
  if (duration < 0) {
    sliders.forEach(slide => {
      let item = document.createElement('div');
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item);
    })
    sliders.reverse(); //in case of negative values, the direction will be reversed
    changeSlide(0);
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration * -1); //The duration will be the positive value of the given value.
  } else {
    //creating slider
    sliders.forEach(slide => {
      let item = document.createElement('div');
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item);
    })
    changeSlide(0);
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
}


// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}


// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  };
  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }
  items.forEach(item => {
    item.style.display = "none";
  })
  items[index].style.display = "block";
}


searchBtn.addEventListener('click', function () {
  document.getElementById("goToHome").disabled = false;
  if (document.getElementById("search").value === "") {
    alert("Please Write the Search topic in the Search Box.");
  } else {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value);
    sliders.length = 0;
  }
})


// clicking buttons on keyboard Enter keyup
const triggerSearchOnEnter = (inputId, btn) => {
  document.getElementById(inputId).addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      btn.click();
    }
  });
}

// triggering Enter for searching 
triggerSearchOnEnter("search", searchBtn);

//triggering Enter for creating slider
triggerSearchOnEnter("duration", sliderBtn);

sliderBtn.addEventListener('click', function () {
  if (document.getElementById("duration").value === "") {
    alert("Please select a duration for your slider.")
  } else {
    createSlider();
    document.getElementById("special-btn1").disabled = false;
    document.getElementById("special-btn2").disabled = false;
  }
})


//handling clicks on extra buttons
const backToPrevious = (backToImages) => {
  if (backToImages === true) {
    imagesArea.style.display = 'block';
    document.querySelector('.main').style.display = 'none';
  } else {
    imagesArea.style.display = 'none';
    document.querySelector('.main').style.display = 'block';
  }
}