document.querySelector('video').playbackRate = 0.65;

const arrow_btn = document.querySelector('.arrow_btn');
const search_btn = document.querySelector('.search_btn');
const select = document.querySelector('select');
const input = document.querySelector('input');
const people = document.querySelector('#people');
const films = document.querySelector('#films');
const vehicle = document.querySelector('#vehicle');

let textAreaValue;
let linkNextPage;
let itemBlock;
let imgId;            
let result; 
let insert;
let search;

$(window).on('click', function(event){
const films = document.querySelector('#films');
   if(event.target !== select && event.target !== input && event.target !== films && event.target !== people && event.target !== vehicle ){
    event.target === arrow_btn ? $('.list_item').toggle(800) : $('.list_item').hide(800);
    event.target === search_btn ? $('.input').toggle(1100) : $('.input').hide(1100);
   }
});

$('.left_sliderBtn').on('click', function(){
    $('.item_list').removeClass('item_list_active');
    $('.show_more').removeClass('show_more_active');
});

$('.right_sliderBtn').on('click', function(){
    $('.item_list').removeClass('item_list_active');
    $('.show_more').removeClass('show_more_active');
});

$('.send_btn').on('click', function(){
    itemBlock = '';
    itemBlock = $('.radio_input[name="data"]:checked').val();
    $('.input_area').val(function(){
        textAreaValue = this.value;
    });
    if (textAreaValue) {
        $.ajax({
            url: `https://swapi.dev/api/${itemBlock}/?search=${textAreaValue}`,
            method: "GET",
            success: function(result) {
                swiperDestroy();
                addHtml(result.results);
                swiperInit();
                enableButton();
            }
        });
    };
    $('.input').hide(1100);
    search = true;
});

$('.schow_btn').on('click', function(){
    $('select').val(function() {
        itemBlock = this.value.toLowerCase();
        $.ajax({
            url: `https://swapi.dev/api/${this.value.toLowerCase()}`,
            method: "GET",
            success: function(result) {
                if(result.next){
                    linkNextPage = result.next
                } else {
                    linkNextPage = null;
                }
                swiperDestroy();
                $('.swiper-wrapper').empty();
                addHtml(result.results);
                swiperInit();
                enableButton();
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
    let item = array;
         if (search) {
            $('.slider_btn').addClass('hidden');
            $(swiper).empty();
            $('.swiper-wrapper').empty();
            search = false;
         } else {
            $('.slider_btn').removeClass('hidden');
         }
    item.forEach(element => {
        result = element;
        imgId = element.url.replace(`https://swapi.dev/api/${itemBlock}/`, '').replaceAll('/', '');
        operate(element);
    })
    function operate (result) {
        const films = `<div class="item_list">
    <ul>
        <li class="list_tittle"><p class="list_tittle">${result.title || result.name}</p></li>
        <li><p>Director:</p> <p class="parameters">${result.director}</p></li>
        <li><p>Producer:</p> <p class="parameters">${result.producer}</p></li>
        <li><p>Release Date:</p> <p class="parameters">${result.release_date}</p></li>
        <!--<li><p>Characters:</p> <p class="parameters">${result.characters}</p></li>-->
        <!--<li><p>Vehicles:</p> <p class="parameters">${result.vehicles}</p></li>-->
    </ul>
</div> `;
const people = `<div class="item_list">
    <ul>
        <li class="list_tittle"><p class="list_tittle">${result.title || result.name}</p></li>
        <li><p>Height:</p> <p class="parameters">${result.height}</p></li>
        <li><p>Mass:</p> <p class="parameters">${result.mass}</p></li>
        <li><p>Hair Color:</p> <p class="parameters">${result.hair_color}</p></li>
        <li><p>Birth of Year:</p> <p class="parameters">${result.birth_year}</p></li>
        <li><p>Gender:</p> <p class="parameters">${result.gender}</p></li>
        <!--<li><p>Characters:</p> <p class="parameters">${result.characters}</p></li>-->
        <!--<li><p>Vehicles:</p> <p class="parameters">${result.vehicles}</p></li>-->
    </ul>
</div> `;
const vehicles = `<div class="item_list">
    <ul>
        <li class="list_tittle"><p class="list_tittle">${result.title || result.name}</p></li>
        <li><p>Model:</p> <p class="parameters">${result.model}</p></li>
        <li><p>Manufacturer:</p> <p class="parameters">${result.manufacturer}</p></li>
        <li><p>Coast:</p> <p class="parameters">${result.cost_in_credits}</p></li>
        <li><p>Length:</p> <p class="parameters">${result.length}</p></li>
        <li><p>Max Speed:</p> <p class="parameters">${result.max_speed}</p></li>
        <li><p>Crewr:</p> <p class="parameters">${result.crew}</p></li>
        <li><p>Passengers:</p> <p class="parameters">${result.passengers}</p></li>
        <!--<li><p>Characters:</p> <p class="parameters">${result.characters}</p></li>-->
        <!--<li><p>Vehicles:</p> <p class="parameters">${result.vehicles}</p></li>-->
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
                                                <div class="image" style="background-image: url(img/${itemBlock}/${itemBlock}${imgId}.png);"></div>
                                            </div>
                                            <div class="image_right">
                                                <div class="image" style="background-image: url(img/${itemBlock}/${itemBlock}${imgId}.png);"></div>
                                            </div>
                                        </div>
                                        <div class="item_tittle">
                                        <div class="item_tittle"><p>${result.title || result.name}</p></div>
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
                                                    <div class="image" style="background-image: url(img/${itemBlock}/${itemBlock}${imgId}.png);"></div>
                                                </div>
                                                <div class="image_right">
                                                    <div class="image" style="background-image: url(img/${itemBlock}/${itemBlock}${imgId}.png);"></div>
                                                </div>
                                            </div>
                                            <div class="item_tittle"><p>${result.title || result.name}</p></div>
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