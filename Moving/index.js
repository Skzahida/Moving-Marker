const map = L.map('map').setView([19.07094158, 72.90730592], 12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// create a red polyline from an array of LatLng points
const latlngs = [
    [19.07094158, 72.90730592],
    [19.07132692, 72.90770732],
    [19.07146338, 72.8953985],
    [19.06790834, 72.89286813],
    [19.07708118, 72.89948537],
    [19.07500889, 72.89294168],
    [19.07368225, 72.89711714],
    [19.07335726, 72.89872306],
    [19.07364176, 72.89723527],
    [19.07102198, 72.90441846]
];

const polyline = L.polyline(latlngs, { color: '#DE3163' }).addTo(map);

// zoom the map to the polyline
map.fitBounds(polyline.getBounds());
map.setZoom(5);

//create markerplayer
const points = latlngs.map((v, i) => {
    return { id: i, latlng: v };
});
const animMarker = L.markerPlayer(points, 20000).addTo(map);

//init contorols
const playTogBtn = document.getElementById('play-tog-btn');
const progBar = document.getElementById('prog-bar');

function startAnim() {
    animMarker.start();
    playTogBtn.innerText = "⏸";
}

function pauseAnim() {
    animMarker.pause();
    playTogBtn.innerText = "▶";
}
playTogBtn.addEventListener('click', e => {
    if (animMarker.isRunning()) {
        pauseAnim();
    } else {
        startAnim();
    }
});
animMarker.on('end', e => {
    playTogBtn.innerText = "▶";
});
animMarker.on('progresschange', e => {
    progBar.setAttribute('style', `width: ${e.progress}%`);
});
animMarker.on('pointchange', e => {
    document.getElementById('point-id').innerText = e.point.id;
});