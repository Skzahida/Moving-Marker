import { mydata } from './coord.js';

const map = L.map('map').setView([19.07094158, 72.90730592], 12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Get the coordinates from the geojson data
const coordinates = mydata.features.map(feature => feature.geometry.coordinates);

// Create a routing control and add it to the map
const routingControl = L.Routing.control({
    waypoints: coordinates,
    routeWhileDragging: false,
    lineOptions: {
        styles: [{ color: '#00AAFF', weight: 3 }]
    },
    createMarker: function(i, waypoint, n) {
        // create a non-draggable marker
        return L.marker(waypoint.latLng, {
            //draggable: false,
            icon: L.icon({
                iconUrl: '../Moving/images/point.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        });
    }
}).addTo(map);

// Add a polyline based on the route found by the routing control
routingControl.on('routesfound', function(e) {
    const routes = e.routes;
    const route = routes[0]; // assume only one route
    const coordinates = route.coordinates;
    const polyline = L.polyline(coordinates, { color: '#DE3163' }).addTo(map);


    // Create a moving marker and add it to the map
    const marker = L.Marker.movingMarker(polyline.getLatLngs(), 100000, {
        icon: L.icon({
            iconUrl: '../Moving/images/car.png',
            iconSize: [30, 41],
            iconAnchor: [15, 41],
            popupAnchor: [2, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map);

    const playTogBtn = document.getElementById('play-tog-btn');
    const progBar = document.getElementById('prog-bar');

    // Add event listeners to the marker
    marker.on('start', function() {
        playTogBtn.innerText = "⏸";
    });
    marker.on('stop', function() {
        playTogBtn.innerText = "▶";
    });

    // marker.on('progress', function(e) {
    //     progBar.setAttribute('style', `width: ${e.progress * 100}%`);
    // });
    marker.on('end', function() {
        playTogBtn.innerText = "▶";
    });

    marker.on('progresschange', function(e) {
        progBar.setAttribute('style', `width: ${e.progress}%`);
    });

    marker.on('pointchange', function(e) {
        document.getElementById('point-id').innerText = e.point.id;
    });


    function pauseAnim() {
        marker.pause();
        playTogBtn.innerText = "▶";
    }

    // Add event listener to the play/pause button
    playTogBtn.addEventListener('click', function() {
        if (marker.isRunning()) {
            pauseAnim();
            playTogBtn.innerText = "▶";
        } else {
            marker.start();
            playTogBtn.innerText = "⏸";
        }
    });

});
// map.fitBounds(polyline.getBounds());
// map.setZoom(5);