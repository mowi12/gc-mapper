/* Map */
const startLat = convertToDecimal("48 23.916");
const startLng = convertToDecimal("9 59.535");
const zoom = 15;
const map = L.map("map", {
  center: [startLat, startLng],
  zoom: zoom,
});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
/* --- */

/* Input */
const coordInput = document.getElementById("coordInput");
let latDec,
  lngDec,
  latDeg,
  lngDeg = 0;
/* ----- */

function show() {
  convertCoordinates();
  clearResults();

  showPoint(latDec, lngDec);
}

function showPoint(lat, lng) {
  const pt = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`${convertToDegrees(lat)} ${convertToDegrees(lng)}`);

  map.setView([lat, lng], zoom);
}

function showLine(lat1, lng1, lat2, lng2) {
  const line = L.polyline(
    [
      [lat1, lng1],
      [lat2, lng2],
    ],
    {
      color: "green",
      weight: 5,
    }
  ).addTo(map);

  const center = [
    (parseFloat(lat1) + parseFloat(lat2)) / 2,
    (parseFloat(lng1) + parseFloat(lng2)) / 2,
  ];
  map.setView(center, zoom);
}

function showRect(lat1, lng1, lat2, lng2) {
  const rect = L.rectangle(
    [
      [lat1, lng1],
      [lat2, lng2],
    ],
    {
      color: "red",
      weight: 5,
    }
  ).addTo(map);

  const center = [
    parseFloat(lat1) + (parseFloat(lat2) - parseFloat(lat1)) / 2,
    parseFloat(lng1) + (parseFloat(lng2) - parseFloat(lng1)) / 2,
  ];
  map.setView(center, zoom);
}

function clearResults() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker || layer instanceof L.Rectangle) {
      map.removeLayer(layer);
    }
  });
}

function convertCoordinates() {
  const coordString = coordInput.value;
  const regexp =
    /((N|S)?)(\s?)(?<lat1>[0-9x]{1,3})(°?)(\s?)(?<lat2>[0-9x]{1,2}.[0-9x]{3})('?)(\s?)((E|W)?)(\s?)(?<lng1>[0-9x]{1,3})(°?)(\s?)(?<lng2>[0-9x]{1,2}.[0-9x]{3})('?)/g;
  const matches = coordString.matchAll(regexp);
  for (const match of matches) {
    latDeg = match.groups.lat1 + " " + match.groups.lat2;
    lngDeg = match.groups.lng1 + " " + match.groups.lng2;
    latDec = convertToDecimal(latDeg);
    lngDec = convertToDecimal(lngDeg);
    console.log("latDeg: " + latDeg);
    console.log("lngDeg: " + lngDeg);
    console.log("latDec: " + latDec);
    console.log("lngDec: " + lngDec);
  }
}

function convertToDecimal(coordsInDegrees) {
  const [degrees, minutes] = coordsInDegrees.match(/(\d+) (\d+\.\d+)/).slice(1);
  return (parseFloat(degrees) + parseFloat(minutes) / 60).toFixed(6);
}

function convertToDegrees(coordsInDecimal) {
  const degrees = Math.floor(coordsInDecimal);
  const minutes = (coordsInDecimal - degrees) * 60;
  return degrees + " " + minutes.toFixed(3);
}
