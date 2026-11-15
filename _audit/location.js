// assets/js/locations.js

const locations = [
  "Tambaram", "Mylapore", "Velachery", "Old Perungalathur", "Mogappair", "Avadi",
  "Sholinganallur", "Thoraipakkam", "Neelankarai", "Ramapuram", "Mugalivakkam",
  "Keelkattalai", "Saidapet", "Pallikaranai", "Kilpauk", "Kolathur", "Guduvanchery",
  "Pondicherry", "Cuddalore", "Old Pallavaram", "Mannivakkam", "Chidambaram",
  "Hasthinapuram", "Thiruverkadu", "Surapet", "Maraimalai Nagar", "Padur",
  "Medavakkam", "Ambattur", "Padappai", "Ayapakkam", "Arumbakkam", "Sithalapakkam",
  "Perumbakkam", "Basavanagudi", "Pudupakkam", "Pammal", "Urapakkam", "Thanjavur", 
  "Kumbakonam", "Maduravoyal", "Kandigai", "Kundrathur", "Kelambakkam", "Madambakkam",
  "Navalur", "Iyyappanthangal", "Mappedu", "Vyasarpadi", "Kolapakkam", "Polachery",
  "Kattur"
];

// Function to populate the dropdown
function loadLocations(selectedLocation = "") {
  const select = document.getElementById("course");
  if (!select) return;

  // Clear existing options
  select.innerHTML = "";

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Location";
  select.appendChild(defaultOption);

  // Add all locations dynamically
  locations.forEach((loc) => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    if (loc === selectedLocation) option.selected = true;
    select.appendChild(option);
  });
}
