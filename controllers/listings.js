const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// Listing index route
module.exports.index = async (req, res) => {
  // console.log(req.query); 
  const { country, category } = req.query;  
  let query = {};  
  if (country) {
    query.country = { $regex: new RegExp(country, 'i') };
  }
  if (category) {
    query.category = { $regex: new RegExp(category, 'i') };
  }
  const allListings = await Listing.find(query);
  // Render the listings page with the filtered results
  res.render("listings/index.ejs", { allListings });
};

// New Route(form for new list creation)
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show route   show individual route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  const newListing = new Listing(req.body.listing);
  let url = req.file.path;
  let filename = req.file.filename;
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// Edit Route  (form for edit)
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    // this is flash error message for if we want to update wrong id list
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  let originalUrlImage = listing.image.url;
  originalUrlImage = originalUrlImage.replace("/upload", "/upload/w_250");
  // console.log(originalUrlImage);
  res.render("listings/edit.ejs", { listing, originalUrlImage });
};

// Update Route (update listing)
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//   Delete listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
