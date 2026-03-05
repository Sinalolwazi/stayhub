
const routes = {
  Home: "/",
  MyProperties: "/my-properties",
  MyBookings: "/my-bookings",
  AddProperty: "/add-property",
  CreateListing: "/create-listing",
  Help: "/help",
  PropertyDetails: "/property",
};


export default function createPageUrl(pageName, params = "") {
  const base = routes[pageName] || "/";
  return params ? `${base}?${params}` : base;
}