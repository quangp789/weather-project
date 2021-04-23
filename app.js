const express = require("express");
const https = require("https"); // https is already part of node, so no external package is needed
const bodyParser = require("body-parser") // looks through the body of the post request and fetch data based on the name of the input


const app = express();

app.use(bodyParser.urlencoded({extended: true})); // This is needed in order to start parsing through the body of the post request



// get will reach out to the a server and request information. response is our server going to send the browser
app.get("/", function(request, response) {
  // .sendFile will send our html file over to the browser
  response.sendFile(__dirname + "/index.html");
})

// "/" - root route: where our for lies
app.post("/", function(request, response) {
  const query = request.body.cityName;
  const apiKey = "d3899e7b548856ade10b111afd332dad";
  const unit = "imperial" // imperial = Fahrenheit / Celsius = Metrix

  // https is required when using the https module
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  https.get(url, function(res) {
    // Logs your status code on to hyper text
    console.log(res.statusCode);

    // .on method is node's EventEmitter class
    res.on("data", function(data) {

      // data returns hexadecimal code, so we need to parse it and store it into an object
      const weatherData = JSON.parse(data);

      // You can copy the key:value path (main.temp) using googles JSON pro-viewer
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;

      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

      // .write allows you to write strings onto the file. You can have multiple of these
      response.write("<p>The weather is currently " + weatherDescription + "</p>");
      response.write("<h1>The temperature in " + query + " is " + temp + " degrees.</h1>");
      response.write("<img src=" + imageURL +">");

      // can only have one .send() b/c that is the final thing that happends
      response.send();


    })
  })

})




// This is where you set which port you want your local server to run on.
app.listen(3000, function() {
  console.log("Server is running on port 3000.");
})

/*
const object = {
    name: "Quang",
    favoriteFood: "Burgers"
}
// stringify will turn the object into a string
console.log(JSON.stringify(object));
*/
