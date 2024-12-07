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

  const varsp = /[a-z]/g;
  const count = (coordInput.value.match(varsp) || []).length;

  if (count === 0) {
    convertCoordinatesNoVars();
  } else {
    convertCoordinatesWithVars(count);
  }
}

function showPoint(lat, lng) {
  const pt = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`${convertToDegrees(lat)}' ${convertToDegrees(lng)}'`);

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

function showRect(lat1, lng1, lat2, lng2, text) {
  const rect = L.rectangle(
    [
      [lat1, lng1],
      [lat2, lng2],
    ],
    {
      color: "red",
      weight: 2,
    }
  )
    .addTo(map)
    .bindPopup(text);

  const center = [
    parseFloat(lat1) + (parseFloat(lat2) - parseFloat(lat1)) / 2,
    parseFloat(lng1) + (parseFloat(lng2) - parseFloat(lng1)) / 2,
  ];
  map.setView(center, zoom);
}

function clearResults() {
  map.eachLayer((layer) => {
    if (
      layer instanceof L.Marker ||
      layer instanceof L.Polyline ||
      layer instanceof L.Rectangle
    ) {
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
  let coordString = coordInput.value;
  const regexp =
    /((N|S)?)(\s?)(?<lat1>[0-9a-z]{1,3})(°?)(\s?)(?<lat2>[0-9a-z]{1,2}.[0-9a-z]{3})('?)(\s?)((E|W)?)(\s?)(?<lng1>[0-9a-z]{1,3})(°?)(\s?)(?<lng2>[0-9a-z]{1,2}.[0-9a-z]{3})('?)/g;
  if (count === 1) {
    const variable = coordString.match(/[a-z]/g)[0];
    const matches = Array.from(coordString.matchAll(regexp));
    for (const match of matches) {
      const latDeg1 = (match.groups.lat1 + " " + match.groups.lat2).replace(
        variable,
        "0"
      );
      const lngDeg1 = (match.groups.lng1 + " " + match.groups.lng2).replace(
        variable,
        "0"
      );
      const latDeg2 = (match.groups.lat1 + " " + match.groups.lat2).replace(
        variable,
        "9"
      );
      const lngDeg2 = (match.groups.lng1 + " " + match.groups.lng2).replace(
        variable,
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
    const variables = coordString.match(/[a-z]/g);
    const matches = Array.from(coordString.matchAll(regexp));
    for (const match of matches) {
      const latDeg1 = (match.groups.lat1 + " " + match.groups.lat2).replace(
        variables[0],
        "0"
      );
      const lngDeg1 = (match.groups.lng1 + " " + match.groups.lng2).replace(
        variables[1],
        "0"
      );
      const latDeg2 = (match.groups.lat1 + " " + match.groups.lat2).replace(
        variables[0],
        "9"
      );
      const lngDeg2 = (match.groups.lng1 + " " + match.groups.lng2).replace(
        variables[1],
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
  } else if (count === 3) {
    const variables = coordString.match(/[a-z]/g);
    for (let i = 0; i < count - 2; i++) {
      for (let value = 0; value < 10; value++) {
        let coordStringCopy = coordString.replace(variables[i], value);
        const matches = Array.from(coordStringCopy.matchAll(regexp));
        for (const match of matches) {
          const latDeg1 = (match.groups.lat1 + " " + match.groups.lat2)
            .replace(variables[count - 1], "0")
            .replace(variables[count - 2], "0");
          const lngDeg1 = (match.groups.lng1 + " " + match.groups.lng2)
            .replace(variables[count - 1], "0")
            .replace(variables[count - 2], "0");
          const latDeg2 = (match.groups.lat1 + " " + match.groups.lat2)
            .replace(variables[count - 1], "9")
            .replace(variables[count - 2], "9");
          const lngDeg2 = (match.groups.lng1 + " " + match.groups.lng2)
            .replace(variables[count - 1], "9")
            .replace(variables[count - 2], "9");
          const latDec1 = convertToDecimal(latDeg1);
          const lngDec1 = convertToDecimal(lngDeg1);
          const latDec2 = convertToDecimal(latDeg2);
          const lngDec2 = convertToDecimal(lngDeg2);
          showPoint(latDec1, lngDec1);
          showPoint(latDec2, lngDec2);
          showPoint(latDec1, lngDec2);
          showPoint(latDec2, lngDec1);
          showRect(
            latDec1,
            lngDec1,
            latDec2,
            lngDec2,
            `${variables[i]} = ${value}, ${variables[count - 2]} and ${
              variables[count - 1]
            } from 0 to 9`
          );
          // console.log("variable: " + variables[i] + " has value: " + value);
          // console.log("Replacing: " + variables[count - 1] + " with 0 and 9");
          // console.log("Replacing: " + variables[count - 2] + " with 0 and 9");
          // console.log("----");
          // console.log("latDeg1: " + latDeg1 + " lngDeg1: " + lngDeg1);
          // console.log("latDeg2: " + latDeg2 + " lngDeg2: " + lngDeg2);
          // console.log("latDec1: " + latDec1 + " lngDec1: " + lngDec1);
          // console.log("latDec2: " + latDec2 + " lngDec2: " + lngDec2);
          // console.log("\n");
        }
      }
    }
  }
}
