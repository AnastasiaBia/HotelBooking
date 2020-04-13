jQuery(function ($) {
    $.ajax({
        url: "data.json",
        success: handleRequest
    });


    // Settings for Booking Calendar

    $(document).ready(function () {

        $("#datepicker").datepicker({
            dateFormat: "DD,dd/mm/yy",
            changeMonth: true,
            changeYear: true,
            minDate: new Date()
        }).datepicker("setDate", new Date());
        $("#datepicker2").datepicker({
            dateFormat: "DD,dd/mm/yy",
            changeMonth: true,
            changeYear: true,
            onSelect: function () {
                $('#datepicker2').datepicker('option', 'minDate', $("#datepicker").datepicker("getDate"));
            }
        }).datepicker("setDate", new Date());
    });


   



    //Hotel list - HTML & Modal for map 
    function showHotels(hotel) {
        const hotelDisplay = `<div class="col-12 row mb-2 p-0 border shadow">
                  <div class="col-3 px-0 hoteldisplay">
                      <i class="fas fa-heart text-muted"></i>
                      <img src="${hotel.thumbnail}" class="img-fluid" alt="hotel-photo">
                      <span class="bg-dark text-white p-1 rounded">1/30</span>
                  </div>

                  <div class="col-4"> 
                      <h4><b>${hotel.hotelName}</b></h4>
                          <span>
                          <i class='${hotel.rating > 0 && "fas fa-star text-warning"}'></i>
                          <i class='${hotel.rating > 1 && "fas fa-star text-warning"}'></i>
                          <i class='${hotel.rating > 2 && "fas fa-star text-warning"}'></i>
                          <i class='${hotel.rating > 3 && "fas fa-star text-warning"}'></i>
                          <i class='${hotel.rating > 4 && "fas fa-star text-warning"}'></i>
                          &ensp; Hotel
                           </span>
                      <p>${hotel.city}, 0.2 miles to Champs-Élysées</p>

                      <div>
                      <span class="ratingbox"><b>${hotel.ratings.no}</b></span> 
                      <span>&ensp;<b>${hotel.ratings.text}</b> (1736 reviews)</span>
                      <br>
                      <br>
                      <div>Excellent location (9.2/10)</div>
                      </div>
                   </div>

                  <div class="col-2 text-center border"> 
                  <div>
                  <span class='dealsDetail box'>
                  Hotel Website 
                    <br><b>$${hotel.price}</b>
                    </span>
                    </div>
                    
                  <div>
                  <span class='dealsDetail2'> Agoda <br><b>$575 </b>
                  </span>
                  </div>
                  
                  <div>
                  <span class='dealsDetail3'> Travelocity <br><b>$708 </b>
                  </span>
                  </div>
                  <hr>
                  <div class='mb-4'> 
                  <span><b>More deals from <br> $575 </b>
                  </span>
                  </div>
                  </div>
                  <div class="col-3 mt-5">
                  <div class= "col-12 text-center text-success"> 
                 Hotel Website
                 </div>
                  <div class= "col-12 text-center text-success" >
                  <h2> <b>$${hotel.price}</b></h2>
                  </div>
                  <div class= "col-12 text-center" >
                  3 nights for 
                  <span class="text-success"><b>$${(hotel.price) * 3}</b> 
                  </span>
                  </div>
                  <br>
                  <br>
                  <br>
                
                  <button class="col-12 btn-lg btn-success mb-2"><b> View Deal ></b></button>
                  </div>
                  
              </div>`;


        // Get the modal
        var modal = document.getElementById("myModal");
        // Get the button that opens the modal
        const btn = document.getElementById("myBtn");
        // Get the <span> element that closes the modal
        const span = document.getElementsByClassName("close")[0];
        const maps = document.getElementById("maps");

        //Show i-frame with mapurl on click of button
        btn.onclick = function () {
            modal.style.display = "block";

            maps.innerHTML += `<iframe src="${hotel.mapurl}" width=100%></iframe>`;
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        return hotelDisplay;


    }


    //Create list of hotels and display them in HTML
    function createHotelList(list) {
        const hotels = $("#hotels");
        hotels.empty();
        let eachHotel = "";

        const hotelList = list.reduce((a, hotel) => (
            eachHotel += showHotels(hotel)
        ), '');

        hotels.append(hotelList);
    }


    //Set minimum and Maximum price range
    function setPriceRange(list) {
        let min = Infinity;
        let max = -Infinity;
        list.forEach(hotel => {
            const price = parseFloat(hotel.price);
            if (price > max) max = price;
            if (price < min) min = price;
        });

        //Set minimum and maximum prices in slider
        const price = document.querySelector("#price");
        price.setAttribute("min", min);
        price.setAttribute("max", max);
        price.setAttribute("value", max);
        document.querySelector("#forPrice").innerHTML = `<span id="labelPrice">Price
     </span><span class="tab">Max: $${max}</span>`;
    }



    //Price filter - returns a floating point number less than or equal to price set
    function FilterByPrice(hotel, price) {
        return parseFloat(hotel.price) <= price;
    }



    //Location filter
    function FilterByHotelLocation(hotel, city) {

        return (hotel.city) === city;
    }

    //Filters filter
    function FilterByFilters(hotel, filter) {

        let finalFilter = "";
        (hotel.filters).forEach(function (fil) {
            if (fil.name === filter) {
                finalFilter = fil.name;

            }
            return (fil.name) === filter;
        })
        console.log(filter);

        return finalFilter;
    }


    //Rating filter- returns a floating point number equal to rating set
    function FilterByRating(hotel, rating) {

        return parseFloat(hotel.rating) == rating;
    }

    //Guest rating filter 
    function FilterByGuestRating(hotel, guestrating) {

        if (guestrating === "0") {
            console.log("0")
            return (parseFloat(hotel.ratings.no) >= 0 && parseFloat(hotel.ratings.no) <= 2);
        }
        if (guestrating === "1") {
            return (parseFloat(hotel.ratings.no) >= 2 && parseFloat(hotel.ratings.no) <= 6);
        }
        if (guestrating === "2") {
            return (parseFloat(hotel.ratings.no) >= 6 && parseFloat(hotel.ratings.no) <= 7);
        }
        if (guestrating === "3") {
            return (parseFloat(hotel.ratings.no) >= 7 && parseFloat(hotel.ratings.no) <= 8.5);
        }
        if (guestrating === "4") {
            console.log("4")
            return (parseFloat(hotel.ratings.no) >= 8.5 && parseFloat(hotel.ratings.no) <= 10);
        }

        return parseFloat(hotel.guestrating) >= guestrating;
    }






    let data = [];
    function handleRequest(alldata) {
        //Print all of data.json
        console.log(alldata);

        //Get entries array from data.json
        const entries = alldata.map(function (data) {
            return data.entries;

        });
        console.log(entries);

        //Get roomtypes array from data.json
        const roomtypes = alldata.map(function (data) {
            return data.roomtypes;
        });
        console.log(roomtypes);


        //Get objects of array entries - 
        //... mean that it spreads over the entries object and gets all its properties 
        const hotelDetails = [...entries[1]];
        data = [...entries[1]];

        console.log(hotelDetails);



        //Remove any duplicate entries
        function removeDuplicates(hotels) {
            return hotels.filter((a, b) => hotels.indexOf(a) === b)
        };


        // Get each city name from data.json
        const cities = hotelDetails.map(function (hotel) {
            console.log(hotel.city)
            return hotel.city;
        })


        let finalCities = removeDuplicates(cities);
        // Fill HTML datalist with cities for search bar
        const datalist = document.querySelector('#cities');
        const selectHotelLocation = document.querySelector('#hotellocation');
        finalCities.forEach(function (city) {
            const option = document.createElement('option');
            option.appendChild(document.createTextNode(city))
            option.value = city;
            datalist.appendChild(option);
            //Clone the same for the creation of Hotel Location dropwdown menu 
            const option2 = option.cloneNode(true)
            selectHotelLocation.appendChild(option2);

        })


        // Get each filter name from data.json
        const filters = hotelDetails.map(function (hotel) {
            return hotel.filters;
        });
        console.log(filters);


        // Create array with all filters (Car Park, Sauna, etc)
        let filtersArray = [];
        let finalFiltersArray = [];

        filters.forEach(function (filter) {
            filtersArray = filter.map(function (filter) {
                return filter.name;
            })
            //Fill final array with each filter name
            filtersArray.forEach(function (filter) {
                finalFiltersArray.push(filter);
            })
        });

        //Remove duplicates from filters
        finalFiltersArray = removeDuplicates(finalFiltersArray);
        console.log(finalFiltersArray);

        //Create filters dropdown menu
        const filterSelector = document.querySelector("#filters");
        finalFiltersArray.forEach(function (filter) {
            const option = document.createElement('option');
            option.appendChild(document.createTextNode(filter))
            option.value = filter;
            filterSelector.appendChild(option);
        })



        // Create Room Types dropdown menu
        //Get all properties from roomtypes array
        const roomTypesDetails = [...roomtypes[0]];
        const roomTypeSelector = document.querySelector("#roomtypes");
        console.log(roomTypesDetails);
        let finalRoomTypes = removeDuplicates(roomTypesDetails);
        finalRoomTypes.forEach(function (room) {
            const option = document.createElement('option');
            //console.log(city);
            option.appendChild(document.createTextNode(room.name))
            option.value = room.name;
            roomTypeSelector.appendChild(option);
        })



        createHotelList(hotelDetails);

        //Filter hotels based on price - FilterByPrice function
        setPriceRange(hotelDetails);
        $("#price").on("change", (price) => {
            document.querySelector("#priceMessage").innerText = `$ ${price.target.value}`;

            createHotelList(hotelDetails.filter(list => FilterByPrice(list, price.target.value)));
            if (($("#price").val()) === "") {
                createHotelList(hotelDetails);
            }
        });

        //Filter hotels based on rating - FilterByRating function
        $("#rating").on("change", (rating) => {

            createHotelList(hotelDetails.filter(list => FilterByRating(list, rating.target.value)));
            if (($("#rating").val()) === "") {
                createHotelList(hotelDetails);
            }
        });

        //Filter hotels based on guest rating - FilterByGuestRating function

        $("#guestRating").on("change", (guestrating) => {

            createHotelList(hotelDetails.filter(list => FilterByGuestRating(list, guestrating.target.value)));
            if (($("#guestRating").val()) === "") {
                createHotelList(hotelDetails);
            }
        });


        //Filter hotels based on hotel location - FilterByHotelLocation function
        $("#hotellocation").on("change", (hotelLocation) => {
            createHotelList(hotelDetails.filter(list => FilterByHotelLocation(list, hotelLocation.target.value)));
            if (($("#location").val()) === "") {
                createHotelList(hotelDetails);
            }
        });


        //Filter hotels based on hotel location - FilterByHotelLocation function triggered on 
        //click of search button
        $("#search-button").on("click", (e) => {

            //Creates the list for search bar
            createHotelList(hotelDetails.filter(list => FilterByHotelLocation(list, $(".city-choice").val())));
            if (($(".city-choice").val()) === "") {
                createHotelList(hotelDetails);
            }
        });



        //Filter hotels based on filters - FilterByFilters function
        $("#filters").on("change", (filters) => {
            createHotelList(hotelDetails.filter(list => FilterByFilters(list, filters.target.value)));
            if (($("#filters").val()) === "") {
                createHotelList(hotelDetails);
            }

        });




    }







});