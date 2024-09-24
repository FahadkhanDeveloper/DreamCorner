// this mapTken is from show.ejs script
console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

// this coordinates is send from show.ejs
console.log(listing);
// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4> <p>Exact location will be provided after booking</p>`
    )
  )
  .addTo(map);

// same as above but here we change the icon
// console.log(mapToken);
// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//   container: "map", // container ID
//   center: listing.geometry.coordinates, // starting position [lng, lat]
//   zoom: 9, // starting zoom
// });

// console.log(listing);

// // Create a custom marker with the Font Awesome icon
// const customMarker = document.createElement("div");
// customMarker.innerHTML =
//   '<i class="fa-regular fa-compass" style="font-size:24px; color:red; margin-bottom: 40px;"></i>';

// // Add the custom marker to the map
// new mapboxgl.Marker(customMarker)
//   .setLngLat(listing.geometry.coordinates)
//   .setPopup(
//     new mapboxgl.Popup({ offset: 25 }).setHTML(
//       `<h4>${listing.title}</h4> <p>Exact location will be provided after booking</p>`
//     )
//   )
//   .addTo(map);
