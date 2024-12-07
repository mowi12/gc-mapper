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
/* ----- */

function show() {
  clearResults();

  // input does not contain any variables
  if (!coordInput.value.includes("x")) {
    convertCoordinatesNoVars();
    return;
  } else {
    // input contains variables
    const count = (coordInput.value.match(/x/g) || []).length;
    convertCoordinatesWithVars(count);
  }
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
      weight: 2,
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
      weight: 2,
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

function convertCoordinatesNoVars() {
  const coordString = coordInput.value;
  const regexp =
    /((N|S)?)(\s?)(?<lat1>[0-9]{1,3})(°?)(\s?)(?<lat2>[0-9]{1,2}.[0-9]{3})('?)(\s?)((E|W)?)(\s?)(?<lng1>[0-9]{1,3})(°?)(\s?)(?<lng2>[0-9]{1,2}.[0-9]{3})('?)/g;
  const matches = coordString.matchAll(regexp);
  for (const match of matches) {
    const latDeg = match.groups.lat1 + " " + match.groups.lat2;
    const lngDeg = match.groups.lng1 + " " + match.groups.lng2;
    const latDec = convertToDecimal(latDeg);
    const lngDec = convertToDecimal(lngDeg);
    showPoint(latDec, lngDec);
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

function convertCoordinatesWithVars(count) {
  const coordString = coordInput.value;
  const regexp =
    /((N|S)?)(\s?)(?<lat1>[0-9x]{1,3})(°?)(\s?)(?<lat2>[0-9x]{1,2}.[0-9x]{3})('?)(\s?)((E|W)?)(\s?)(?<lng1>[0-9x]{1,3})(°?)(\s?)(?<lng2>[0-9x]{1,2}.[0-9x]{3})('?)/g;
  const matches = coordString.matchAll(regexp);
  if (count === 1) {
    for (const match of matches) {
      const latDeg1 = (match.groups.lat1 + " " + match.groups.lat2).replace(
        "x",
        "0"
      );
      const lngDeg1 = (match.groups.lng1 + " " + match.groups.lng2).replace(
        "x",
        "0"
      );
      const latDeg2 = (match.groups.lat1 + " " + match.groups.lat2).replace(
        "x",
        "9"
      );
      const lngDeg2 = (match.groups.lng1 + " " + match.groups.lng2).replace(
        "x",
        "9"
      );
      const latDec1 = convertToDecimal(latDeg1);
      const lngDec1 = convertToDecimal(lngDeg1);
      const latDec2 = convertToDecimal(latDeg2);
      const lngDec2 = convertToDecimal(lngDeg2);
      showPoint(latDec1, lngDec1);
      showPoint(latDec2, lngDec2);
      showLine(latDec1, lngDec1, latDec2, lngDec2);
    }
  } else if (count === 2) {
    for (const match of matches) {
      const latDeg1 = (match.groups.lat1 + " " + match.groups.lat2).replace(
        "x",
        "0"
      );
      const lngDeg1 = (match.groups.lng1 + " " + match.groups.lng2).replace(
        "x",
        "0"
      );
      const latDeg2 = (match.groups.lat1 + " " + match.groups.lat2).replace(
        "x",
        "9"
      );
      const lngDeg2 = (match.groups.lng1 + " " + match.groups.lng2).replace(
        "x",
        "9"
      );
      const latDec1 = convertToDecimal(latDeg1);
      const lngDec1 = convertToDecimal(lngDeg1);
      const latDec2 = convertToDecimal(latDeg2);
      const lngDec2 = convertToDecimal(lngDeg2);
      showPoint(latDec1, lngDec1);
      showPoint(latDec2, lngDec2);
      showPoint(latDec1, lngDec2);
      showPoint(latDec2, lngDec1);
      showRect(latDec1, lngDec1, latDec2, lngDec2);
    }
  }
}
