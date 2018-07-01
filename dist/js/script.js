


// HTTP request To get data from JSON file
let result;
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
$http.get("https://spreadsheets.google.com/feeds/list/0Ai2EnLApq68edEVRNU0xdW9QX1BqQXhHRl9sWDNfQXc/od6/public/basic?alt=json")
    .then(function(response) {
        let arr = [...response.data.feed.entry]
            let newArr = arr.map(item => {
            let new_itm = item.content.$t.split(",")
            return new_itm
        })

         result = newArr.map(item2 => {
            var newitem = {};
            for(var i=0; i < item2.length; i++){
                Object.defineProperty(newitem,item2[i].split(': ')[0].trim(),{value:item2[i].split(': ')[1]})        
            }
            return newitem
        })     

            result.map(item => {
                item.city = cityName(item.message)
                console.log(item.city);
            })
            
            $scope.messages = result
    }); 
});

// Function To get cityName from String

function cityName(words){
    var n = words.split(" ");
    return n[n.length - 1];
}




app.directive('myMap', function() {
    // directive link function
    var link = function(scope, element, attrs) {
      var map, infoWindow;
      var markers = [];
  
      // map config
      var mapOptions = {
        center: new google.maps.LatLng(50, 20),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false
      };
  
      // init the map
      function initMap() {
        if (map === void 0) {
          map = new google.maps.Map(element[0], mapOptions);
        }
      }
  
      // place a marker
      function setMarker(map, position, title, content, iconEx) {
        var marker;
        var markerOptions = {
          position: position,
          map: map,
          title: title,
          icon: iconEx
        };
        marker = new google.maps.Marker(markerOptions);
        markers.push(marker); // add marker to array
        
        google.maps.event.addListener(marker, 'click', function() {
          // close window if not undefined
          if (infoWindow !== void 0) {
            infoWindow.close();
          }
          // create new window
          var infoWindowOptions = {
            content: content
          };
          infoWindow = new google.maps.InfoWindow(infoWindowOptions);
          infoWindow.open(map, marker);
        });
      }
  
      initMap();

    //   Async Data 
      setTimeout(() => {
          console.log(result);
          let count=10
          let count2=-0.125486
        result.map(item => {
            //  this is for generate number for Latlang, becouse i don't have data in json file 
            count-=3
            count2 +=0.2
            // For markers mode
            if(item.sentiment == "Negative"){
               setMarker(map, new google.maps.LatLng(51.508515+count, 25.125487+count2), item.city, item.message, 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png')                
            }else if(item.sentiment == "Positive"){
                setMarker(map, new google.maps.LatLng(51.508515+count, 25.125487+count2), item.city, item.message, 'https://maps.google.com/mapfiles/ms/icons/green-dot.png')
            }else {
                setMarker(map, new google.maps.LatLng(51.508515+count, 25.125487+count2), item.city, item.message, 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png')                
            }
       })          
      }, 2000); 
    };
  
    return {
      restrict: 'A',
      template: '<div id="gmaps"></div>',
      replace: true,
      link: link
    };
  });
  