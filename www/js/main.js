document.querySelector('video').playbackRate = 0.65;

const arrow_btn = document.querySelector('.arrow_btn');
const search_btn = document.querySelector('.search_btn');
const select = document.querySelector('select');
const input = document.querySelector('input');
const people = document.querySelector('#people');
const films = document.querySelector('#films');
const vehicle = document.querySelector('#vehicle');

let filmUrl
let textAreaValue;
let linkNextPage;
let itemBlock;
let imgId;            
let insert;
let search;

$(window).on('click touch', function(event){
const films = document.querySelector('#films');
   if(event.target !== select && event.target !== input && event.target !== films && event.target !== people && event.target !== vehicle ){
    event.target === arrow_btn ? $('.list_item').toggle(800) : $('.list_item').hide(800);
    event.target === search_btn ? $('.input').toggle(1100) : $('.input').hide(1100);
   }
});

$('.left_sliderBtn').on('click touch', function(){
    $('.item_list').removeClass('item_list_active');
    $('.show_more').removeClass('show_more_active');
});

$('.right_sliderBtn').on('click touch', function(){
    $('.item_list').removeClass('item_list_active');
    $('.show_more').removeClass('show_more_active');
});

$('.send_btn').on('click touch', function(){
    itemBlock = '';
    itemBlock = $('.radio_input[name="data"]:checked').val();
    $('.input_area').val(function(){
        textAreaValue = this.value;
    });
    if (textAreaValue) {
        textAreaValue = textAreaValue.toLowerCase().replaceAll(' ', '');
        if (itemBlock === 'films') {
            switch (textAreaValue) {
                case 'anewhope':
                    filmUrl = "https://www.swapi.tech/api/films/1"
                    break;
                case 'theempirestrikesback':
                    filmUrl = "https://www.swapi.tech/api/films/2"
                    break;
                case 'returnofthejedi':
                    filmUrl = "https://www.swapi.tech/api/films/3"
                    break;
                case 'thephantommenace"':
                    filmUrl = "https://www.swapi.tech/api/films/4"
                    break;
                case 'attackoftheclones"':
                    filmUrl = "https://www.swapi.tech/api/films/5"
                    break;
                case 'revengeofthesith"':
                    filmUrl = "https://www.swapi.tech/api/films/6"
                    break;
            }
            $.ajax({
                url: `${filmUrl}`,
                method: "GET",
                success: function(result) {
                    linkNextPage = null;
                    swiperDestroy();
                    addHtml(result.result);
                    swiperInit();
                    enableButton();
                }
            });
        } else {
            $.ajax({
                url: `https://swapi.tech/api/${itemBlock}/?name=${textAreaValue}`,
                method: "GET",
                success: function(result) {
                    linkNextPage = null;
                    swiperDestroy();
                    addHtml(result.result);
                    swiperInit();
                    enableButton();
                }
            });
        }
    };
    $('.input').hide(1100);
    search = true;
});

$('.schow_btn').on('click touch', function(){
    $('select').val(function() {
        itemBlock = this.value.toLowerCase();
        $.ajax({
            url: `https://swapi.tech/api/${itemBlock}`,
            method: "GET",
            success: function(result) {
                if(result.next){
                    linkNextPage = result.next
                } else {
                    linkNextPage = null;
                }
                swiperDestroy();
                $('.swiper-wrapper').empty();

                addHtml(result.results || result.result);
                enableButton();
                swiperInit();
            }
        });
        $('.list_item').hide(1100);
    });
});

function nextPage (page){
    if (linkNextPage) {
        $.ajax({
            url: `${page}`,
            method: "GET",
            success: function(result) {
                disableButton();
                addHtml(result.results);
                enableButton();
                linkNextPage = result.next;
            }
        });
    };
};

function addHtml(array) {
    
    let urlArr = []
    let cartArr = [];

    let item = array;
        if (search) {
        item.length > 1 ? $('.slider_btn').removeClass('hidden') : $('.slider_btn').addClass('hidden');
        $(swiper).empty();
        $('.swiper-wrapper').empty();
        search = false;
        } else {
        $('.slider_btn').removeClass('hidden');
    }
    if (itemBlock != 'films' || item.length != undefined) {
        item.forEach(element => {
            if (element.properties) {
                imgId = element.properties.url.slice(27).replaceAll('/', '');
                enableButton()
                operate(element.properties)
                enableButton()
            } else {
                urlArr.push(element.url)
            }
        })
    } else {
        imgId = item.properties.url.slice(27).replaceAll('/', '');
                enableButton()
                operate(item.properties)
                enableButton()
    }
    
    function httpGet(url) {

        return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (this.status == 200) {
            resolve(this.response);
            } else {
            var error = new Error(this.statusText);
            error.code = this.status;
            reject(error);
            }
        };
        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };
        xhr.send();
        });
    }

    Promise.all( urlArr.map(httpGet) )
        .then(results => {
        results.map(element => {
            element = JSON.parse(element)
            cartArr.push(element.result.properties)
        })
        cartArr.map(element => {
            imgId = element.url.slice(27).replaceAll('/', '');
            operate(element);
        })
        enableButton();
    });

    function operate (result) {
        const computedResult = result.properties ? result.properties : result;
        const films = `<div class="item_list">
        <ul>
            <li class="list_tittle"><p class="list_tittle">${computedResult.title || computedResult.name}</p></li>
            <li><p>Director:</p> <p class="parameters">${computedResult.director}</p></li>
            <li><p>Producer:</p> <p class="parameters">${computedResult.producer}</p></li>
            <li><p>Release Date:</p> <p class="parameters">${computedResult.release_date}</p></li>
            <!--<li><p>Characters:</p> <p class="parameters">${computedResult.characters}</p></li>-->
            <!--<li><p>Vehicles:</p> <p class="parameters">${computedResult.vehicles}</p></li>-->
        </ul>
        </div> `;
        const people = `<div class="item_list">
            <ul>
                <li class="list_tittle"><p class="list_tittle">${computedResult.title || computedResult.name}</p></li>
                <li><p>Height:</p> <p class="parameters">${computedResult.height}</p></li>
                <li><p>Mass:</p> <p class="parameters">${computedResult.mass}</p></li>
                <li><p>Hair Color:</p> <p class="parameters">${computedResult.hair_color}</p></li>
                <li><p>Birth of Year:</p> <p class="parameters">${computedResult.birth_year}</p></li>
                <li><p>Gender:</p> <p class="parameters">${computedResult.gender}</p></li>
                <!--<li><p>Characters:</p> <p class="parameters">${computedResult.characters}</p></li>-->
                <!--<li><p>Vehicles:</p> <p class="parameters">${computedResult.vehicles}</p></li>-->
            </ul>
        </div> `;
        const vehicles = `<div class="item_list">
            <ul>
                <li class="list_tittle"><p class="list_tittle">${computedResult.title || computedResult.name}</p></li>
                <li><p>Model:</p> <p class="parameters">${computedResult.model}</p></li>
                <li><p>Manufacturer:</p> <p class="parameters">${computedResult.manufacturer}</p></li>
                <li><p>Coast:</p> <p class="parameters">${computedResult.cost_in_credits}</p></li>
                <li><p>Length:</p> <p class="parameters">${computedResult.length}</p></li>
                <li><p>Max Speed:</p> <p class="parameters">${computedResult.max_speed}</p></li>
                <li><p>Crewr:</p> <p class="parameters">${computedResult.crew}</p></li>
                <li><p>Passengers:</p> <p class="parameters">${computedResult.passengers}</p></li>
                <!--<li><p>Characters:</p> <p class="parameters">${computedResult.characters}</p></li>-->
                <!--<li><p>Vehicles:</p> <p class="parameters">${computedResult.vehicles}</p></li>-->
            </ul>
        </div> `;
        if(itemBlock === 'films'){
            insert = films;
        } else if (itemBlock === 'people') {
            insert = people;
        } else if (itemBlock === 'vehicles') {
            insert = vehicles;
        }
        if (swiper) {
            swiper.appendSlide(`<div class="swiper-slide">
                                    <div class="slide">
                                        <div class="image_wrapper">
                                            <div class="image_left">
                                                <div class="image" style="background-image: url(img/${itemBlock}/${imgId}.png);"></div>
                                            </div>
                                            <div class="image_right">
                                                <div class="image" style="background-image: url(img/${itemBlock}/${imgId}.png);"></div>
                                            </div>
                                        </div>
                                        <div class="item_tittle">
                                        <div class="item_tittle"><p>${computedResult.title || computedResult.name}</p></div>
                                            <div class="show_more">
                                            <img src="img/other/moreBtn.png" alt="">
                                            </div>
                                            <div>${insert}</div>
                                        </div>
                                </div>`)
        } else {
            $('.swiper-wrapper').append(`<div class="swiper-slide">
                                        <div class="slide">
                                            <div class="image_wrapper">
                                                <div class="image_left">
                                                    <div class="image" style="background-image: url(img/${itemBlock}/${imgId}.png);"></div>
                                                </div>
                                                <div class="image_right">
                                                    <div class="image" style="background-image: url(img/${itemBlock}/${imgId}.png);"></div>
                                                </div>
                                            </div>
                                            <div class="item_tittle"><p>${computedResult.title || computedResult.name}</p></div>
                                            <div class="show_more">
                                                <img src="img/other/moreBtn.png" alt="">
                                            </div>
                                            <div>${insert}</div>
                                        </div>
                                    </div>`)
        }
    }
    insert = '';
};