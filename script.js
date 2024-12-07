const latInput = document.getElementById("latInput");
const lngInput = document.getElementById("lngInput");

const startLat = convertToDecimalDegrees("N48 23.916");
const startLng = convertToDecimalDegrees("E9 59.535");
const zoom = 15;

const map = L.map("map", {
  center: [startLat, startLng],
  zoom: zoom,
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function convertToDecimalDegrees(coord) {
  const [hemisphere, degrees, minutes] = coord
    .match(/([NSEW])(\d+) (\d+\.\d+)/)
    .slice(1);
  const decimal = parseFloat(degrees) + parseFloat(minutes) / 60;
  return hemisphere === "S" || hemisphere === "W" ? -decimal : decimal;
}

function convertToDMS(decimal) {
  const degrees = Math.floor(decimal);
  const minutes = (decimal - degrees) * 60;
  return `${degrees}° ${minutes.toFixed(3)}'`;
}

function show() {
  clearResults();

  /* if (!latInput.value.toLowerCase().includes("x") && !lngInput.value.toLowerCase().includes("x")) {
    showPoint(convertToDecimalDegrees(latInput.value), convertToDecimalDegrees(lngInput.value));
  } else if(latInput.value.toLowerCase().includes("x") && !lngInput.value.toLowerCase().includes("x")) {
    const start = [convertToDecimalDegrees(latInput.value.replace("x", 0)), convertToDecimalDegrees(lngInput.value)];
    const end = [convertToDecimalDegrees(latInput.value.replace("x", 9)), convertToDecimalDegrees(lngInput.value)];
    showRect(start, end);
  } else if (!latInput.value.toLowerCase().includes("x") && lngInput.value.toLowerCase().includes("x")) {
    const start = [convertToDecimalDegrees(latInput.value), convertToDecimalDegrees(lngInput.value.replace("x", 0))];
    const end = [convertToDecimalDegrees(latInput.value), convertToDecimalDegrees(lngInput.value.replace("x", 9))];
    showRect(start, end);
  } else {
    const start = [convertToDecimalDegrees(latInput.value.replace("x", 0)), convertToDecimalDegrees(lngInput.value.replace("x", 0))];
    const end = [convertToDecimalDegrees(latInput.value.replace("x", 9)), convertToDecimalDegrees(lngInput.value.replace("x", 9))];
    showRect(start, end);
  } */

  /* console.log(latInput.value, lngInput.value);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      for (let k = 0; k < 10; k++) {
        showPoint(
          convertToDecimalDegrees(latInput.value.replace("x", i).replace("y", j)),
          convertToDecimalDegrees(lngInput.value.replace("x", k))
        );
      }
    }
  } */

  showRect(
    [
      convertToDecimalDegrees(latInput.value.replace("x", 0).replace("y", 0)),
      convertToDecimalDegrees(lngInput.value.replace("x", 0)),
    ],
    [
      convertToDecimalDegrees(latInput.value.replace("x", 9).replace("y", 9)),
      convertToDecimalDegrees(lngInput.value.replace("x", 9)),
    ]
  );
}

function showPoint(lat, lng) {
  console.log(lat, lng);
  const pt = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`${convertToDMS(lat)}, ${convertToDMS(lng)}`);

  map.setView([lat, lng], zoom);
}

function showRect([lat1, lng1], [lat2, lng2]) {
  let weight = 1;
  if (lat1 == lat2 || lng1 == lng2) {
    weight = 5;
  }
  const rect = L.rectangle(
    [
      [lat1, lng1],
      [lat2, lng2],
    ],
    {
      color: "red",
      weight: weight,
    }
  ).addTo(map);

  const center = [(lat1 + lat2) / 2, (lng1 + lng2) / 2];
  map.setView(center, zoom);
}

function clearResults() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker || layer instanceof L.Rectangle) {
      map.removeLayer(layer);
    }
  });
}
