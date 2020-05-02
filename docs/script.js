moment.locale("is");

//Geymir alla viðburðina (fyrra geymir json og seinna geymir DOM)
let events = [];
let eventElements = [];

//Nær í gögnin fyrir viðburðina á githubinu mínu
fetch('https://raw.githubusercontent.com/MikaelAndriIngason/FORR3JS05DU-Verkefni-4/master/docs/gogn.json')
  .then(
    function(response) {
      if (response.status !== 200) { //Ef það varð villa
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }

      //Ef það fékk gögn þá loopum við yfir þau og setjum þau í json array-ið
      response.json().then(function(data) {
        for(let i = 0; i<data.results.length; i++){
          events.push ({
              name:data.results[i].eventDateName,
              date:data.results[i].dateOfShow,
              where:data.results[i].eventLocation,
              price:data.results[i].price,
              imageSrc:data.results[i].imageSource
          });
          addEvent(i); //Búum til nýtt DOM/HTML fyrir viðburðinn
        }
        displayEvents(); //Þegar við erum búin að fara yfir öll gögnin þá birtum við þau á vefsíðuna
      });
    }
  )
  .catch(function(err) { console.log('Fetch Error :-S', err); }); //Ef það varð villa

//Búum til nýtt DOM/HTML fyrir viðburðinn og setur það í array
function addEvent(event){
  //Býr til elements fyrir myndina og alla textana
  let div = document.createElement("DIV"); 
  let name = document.createElement("h2");
  let date = document.createElement("P");
  let loc = document.createElement("P");
  let pri = document.createElement("P");
  let img = document.createElement("IMG");
  img.setAttribute("src", events[event].imageSrc); //Setur linkinn af myndinni í src

  //Setur klassa á nokkur elements til að geta raðað þeim með grid
  date.classList.add("date");
  loc.classList.add("location");
  pri.classList.add("price");

  //Setur textana í element-inn
  name.appendChild(document.createTextNode(events[event].name));
  date.appendChild(document.createTextNode(moment(events[event].date).format('LLL')));
  loc.appendChild(document.createTextNode(events[event].where));
  pri.appendChild(document.createTextNode(events[event].price.toLocaleString() + " kr"));

  //Bætir öllum elements í eitt div
  div.appendChild(name);
  div.appendChild(date);
  div.appendChild(loc);
  div.appendChild(pri);
  div.appendChild(img);
  div.classList.add("event");

  //Sett viðburðinn í array
  eventElements.push(div);
}

//Birtir alla viðburðina þegar þeir hlaðast inn
function displayEvents(){
  for (let i = 0; i < eventElements.length; i++)
    document.getElementById("list").appendChild(eventElements[i]);
}

//Síar viðburðina eftir þörf
function FilterEvents(){
  //Fyrir texta síun
  let input, filter, txtValue;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();

  //Fyrir dagsetningar síun
  let startDate = document.getElementById("startdate").value;
  let endDate = document.getElementById("enddate").value;

  //Fer í gegnum alla viðburðina
  for (let i = 0; i < eventElements.length; i++){
    txtValue = events[i].name; //Nafn viðburðar 
    
    //Fer í gegnum allar stillinganar til að sjá hvort viðburðurinn eigi að vera þarna eða ekki
    //Fyrst kíkjir það hvort verðið er undir eða yfir, síðan kíkjir það hvort notandinn hafi skrifað eitthvað, og að lokum kíkir það hvort dagsetninginn er undir eða yfir, eð eitthvað klikkar á hverfur viðburðurinn
    if(events[i].price < sliderValue[0] || events[i].price > sliderValue[1] || txtValue.toUpperCase().indexOf(filter) < 0 || events[i].date.slice(0,10) < startDate || events[i].date.slice(0,10) > endDate)
      eventElements[i].classList.add("hidden");
    else //Ef ekkert klikkar þá hverfur viðburðurinn ekki
        eventElements[i].classList.remove("hidden");
  }
}

//
//Slider
//
var slider = document.getElementById('slider');
var sliderValue = [];

//Býr til slider-inn
noUiSlider.create(slider, {
    start: [0, 10000], //Handföngin byrja hér
    connect: true,
    range: { //takmörk
      'min': 0,
      'max': 10000
    },
    step: 500,
    margin: 1000,
    pips: { //Setur inn línur fyrir neðan slider-inn
        mode: 'positions',
        values: [0, 25, 50, 75, 100],
        density: 100,
        stepped: true
    }
});
//Ef maður færir slider-inn þá geymir það staðsetninganar og upfærir viðburðina
slider.noUiSlider.on('update.one', function(){ sliderValue = slider.noUiSlider.get(); FilterEvents(); })
