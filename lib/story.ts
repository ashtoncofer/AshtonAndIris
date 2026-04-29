export interface StoryPhoto {
  src: string;
  alt: string;
  placeholder?: boolean;
}

export interface StoryChapter {
  id: string;
  chapter: number;
  title: string;
  date: string;
  location: string;
  lat: number;
  lng: number;
  description: string;
  photos: StoryPhoto[];
  accentColor: string;
  // Arc from previous location (auto-set in data)
  travelFrom?: { lat: number; lng: number };
}

export const chapters: StoryChapter[] = [
  {
    id: "the-meeting",
    chapter: 1,
    title: "Where It All Began",
    date: "July 26, 2021",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275,
    lng: -122.1697,
    description:
      "Ashton and Iris crossed paths for the first time at Tap on the Stanford campus — right after Ashton's soccer game. Neither of them knew it yet, but this was the start of everything.",
    photos: [
      { src: "", alt: "Stanford campus", placeholder: true },
    ],
    accentColor: "#8C1515",
  },
  {
    id: "the-text",
    chapter: 2,
    title: "The Accidental Text",
    date: "July 27, 2021",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275,
    lng: -122.1697,
    description:
      "After dinner at Wilbur Dining the next night, Ashton headed off to work on his pset. Iris was racking her brain for something to say — and accidentally sent him an Apple Watch transcription message instead. It was perfectly imperfect.",
    photos: [
      { src: "/images/apple-watch-text.png", alt: "The accidental Apple Watch text" },
    ],
    accentColor: "#4A90D9",
  },
  {
    id: "the-walk",
    chapter: 3,
    title: "Three Hours & Some Raccoons",
    date: "Late July 2021",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275,
    lng: -122.1697,
    description:
      "They went on a three-hour walk around campus — the kind where time disappears. At some point they stumbled across some very photogenic raccoons, and kept walking anyway.",
    photos: [
      { src: "", alt: "Stanford campus walk", placeholder: true },
    ],
    accentColor: "#5C8A6B",
  },
  {
    id: "cowboy-party",
    chapter: 4,
    title: "Yeehaw",
    date: "Late July 2021",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275,
    lng: -122.1697,
    description:
      "At the end of Iris's week on campus, they went to a cowboy-themed party together. It was the perfect send-off before summer pulled them apart.",
    photos: [
      { src: "/images/cowboy-party.jpeg", alt: "Cowboy theme party" },
    ],
    accentColor: "#C4782A",
  },
  {
    id: "summer-facetime",
    chapter: 5,
    title: "Every Single Day",
    date: "Summer 2021",
    location: "Palo Alto, CA → Dallas, TX",
    lat: 32.7767,
    lng: -96.797,
    travelFrom: { lat: 37.4275, lng: -122.1697 },
    description:
      "Iris went home to Dallas. Ashton stayed in Palo Alto. They FaceTimed every day for the rest of the summer — something that would become their signature.",
    photos: [
      { src: "/images/summer-facetime-1.jpeg", alt: "Summer FaceTime" },
    ],
    accentColor: "#D4A844",
  },
  {
    id: "official",
    chapter: 6,
    title: "Official",
    date: "October 10, 2021",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275,
    lng: -122.1697,
    travelFrom: { lat: 32.7767, lng: -96.797 },
    description:
      "Fall quarter started and they were back on campus. On October 10th, Ashton and Iris made it official. A date they'd celebrate for years to come.",
    photos: [
      { src: "/images/official.jpg", alt: "October 10, 2021 — official" },
    ],
    accentColor: "#C0392B",
  },
  {
    id: "monterey-road-trip",
    chapter: 7,
    title: "First Road Trip",
    date: "December 8, 2021",
    location: "Monterey, CA",
    lat: 36.6002,
    lng: -121.8947,
    travelFrom: { lat: 37.4275, lng: -122.1697 },
    description:
      "Their first trip together: a road trip down the coast from Stanford to Monterey. The Pacific, the sea breeze, and good company.",
    photos: [
      { src: "/images/monterey-1.jpeg", alt: "Monterey road trip" },
    ],
    accentColor: "#2980B9",
  },
  {
    id: "christmas-apart",
    chapter: 8,
    title: "1,900 Miles Apart",
    date: "December 2021",
    location: "Dallas, TX & Chagrin Falls, OH",
    lat: 41.4097,
    lng: -81.3892,
    travelFrom: { lat: 36.6002, lng: -121.8947 },
    description:
      "Christmas break: Iris went back to Dallas; Ashton flew home to Ohio. 1,900 miles between them. They FaceTimed every day — as always.",
    photos: [
      { src: "/images/christmas-apart.jpeg", alt: "FaceTime over Christmas" },
    ],
    accentColor: "#2C3E50",
  },
  {
    id: "school-year-22",
    chapter: 9,
    title: "Together Every Day",
    date: "Winter–Spring 2022",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275,
    lng: -122.1697,
    travelFrom: { lat: 41.4097, lng: -81.3892 },
    description:
      "Back on campus, they spent every day together — studying, laughing, celebrating birthdays, building their world.",
    photos: [
      { src: "/images/school-year-1.jpeg", alt: "Together on campus" },
      { src: "/images/school-year-2.jpg", alt: "Campus days" },
      { src: "/images/school-year-3.jpg", alt: "Birthday celebration" },
      { src: "/images/school-year-4.jpeg", alt: "More campus memories" },
    ],
    accentColor: "#8C1515",
  },
  {
    id: "disneyland",
    chapter: 10,
    title: "The Happiest Place on Earth",
    date: "May 29, 2022",
    location: "Anaheim, CA",
    lat: 33.8121,
    lng: -117.919,
    travelFrom: { lat: 37.4275, lng: -122.1697 },
    description:
      "A weekend in LA at Disneyland — because why not? They rode everything, ate everything, and loved every second.",
    photos: [
      { src: "/images/disneyland.jpeg", alt: "Disneyland" },
    ],
    accentColor: "#1A6EBF",
  },
  {
    id: "austin-family",
    chapter: 11,
    title: "Meeting the Family",
    date: "June 2022",
    location: "Austin, TX",
    lat: 30.2672,
    lng: -97.7431,
    travelFrom: { lat: 33.8121, lng: -117.919 },
    description:
      "A big milestone: Ashton flew to Austin to meet Iris's entire family for the first time. He passed the test.",
    photos: [
      { src: "/images/austin-family-1.jpeg", alt: "Meeting Iris's family in Austin" },
      { src: "/images/austin-family-2.jpeg", alt: "Austin family visit" },
    ],
    accentColor: "#27AE60",
  },
  {
    id: "summer-22",
    chapter: 12,
    title: "Long Distance, Round Two",
    date: "Summer 2022",
    location: "Dallas, TX & Palo Alto, CA",
    lat: 32.7767,
    lng: -96.797,
    travelFrom: { lat: 30.2672, lng: -97.7431 },
    description:
      "Iris interned at Alcon in Dallas. Ashton held it down in Palo Alto. Daily FaceTimes kept them close across the miles.",
    photos: [
      { src: "/images/summer-facetime-2.jpeg", alt: "Summer FaceTime 2022" },
    ],
    accentColor: "#F39C12",
  },
  {
    id: "anniversary-1",
    chapter: 13,
    title: "One Year",
    date: "October 10, 2022",
    location: "Monterey, CA",
    lat: 36.6002,
    lng: -121.8947,
    travelFrom: { lat: 37.4275, lng: -122.1697 },
    description:
      "For their first anniversary they went back to Monterey — full circle. They visited the Aquarium and watched the sardine exhibit swirl and dart. One year down.",
    photos: [
      { src: "/images/anniversary-monterey-1.jpg", alt: "Monterey anniversary" },
      { src: "/images/anniversary-monterey-2.jpg", alt: "Monterey Aquarium" },
      { src: "/images/anniversary-monterey-3.jpg", alt: "Anniversary trip" },
    ],
    accentColor: "#16A085",
  },
  {
    id: "hawaii-1",
    chapter: 14,
    title: "Aloha for the First Time",
    date: "October 22, 2022",
    location: "Hawaii",
    lat: 20.7984,
    lng: -156.3319,
    travelFrom: { lat: 36.6002, lng: -121.8947 },
    description:
      "Their first trip to Hawaii — with Ashton's parents. It was the beginning of a love affair with the islands that would bring them back again and again.",
    photos: [
      { src: "/images/hawaii-1-a.jpeg", alt: "Hawaii first trip" },
      { src: "/images/hawaii-1-b.jpg", alt: "Hawaii with Ashton's parents" },
    ],
    accentColor: "#1ABC9C",
  },
  {
    id: "hawaii-2",
    chapter: 15,
    title: "Back to the Islands",
    date: "March 2023",
    location: "Hawaii",
    lat: 21.3069,
    lng: -157.8583,
    travelFrom: { lat: 37.4275, lng: -122.1697 },
    description:
      "They returned to Hawaii — this time with Ashton's parents, sister Savannah, and her boyfriend Tyler. Paradise with the whole crew.",
    photos: [
      { src: "/images/hawaii-2-a.jpeg", alt: "Hawaii family trip 2023" },
      { src: "/images/hawaii-2-b.jpg", alt: "Hawaii with Savannah and Tyler" },
    ],
    accentColor: "#3498DB",
  },
  {
    id: "nyc-summer-23",
    chapter: 16,
    title: "The City That Never Sleeps",
    date: "Summer 2023",
    location: "New York City, NY",
    lat: 40.7128,
    lng: -74.006,
    travelFrom: { lat: 21.3069, lng: -157.8583 },
    description:
      "Iris interned at McKinsey in New York. Ashton was back in Palo Alto — but he flew out for a weekend and fell in love with the city. It planted a seed.",
    photos: [
      { src: "/images/nyc-summer-1.jpeg", alt: "NYC summer 2023" },
      { src: "/images/nyc-summer-2.jpeg", alt: "Ashton visits NYC" },
      { src: "/images/nyc-summer-3.jpeg", alt: "New York City" },
    ],
    accentColor: "#E74C3C",
  },
  {
    id: "napa",
    chapter: 17,
    title: "Two Years",
    date: "October 2023",
    location: "Napa Valley, CA",
    lat: 38.2975,
    lng: -122.2869,
    travelFrom: { lat: 40.7128, lng: -74.006 },
    description:
      "Two years. They celebrated in Napa Valley — wine country, golden light, and two years of choosing each other.",
    photos: [
      { src: "/images/napa-1.jpeg", alt: "Napa Valley anniversary" },
      { src: "/images/napa-2.jpeg", alt: "Two year anniversary" },
    ],
    accentColor: "#8E44AD",
  },
  {
    id: "savannah-engaged",
    chapter: 18,
    title: "She Said Yes",
    date: "November 2023",
    location: "Santa Cruz, CA",
    lat: 36.9741,
    lng: -122.0308,
    travelFrom: { lat: 38.2975, lng: -122.2869 },
    description:
      "Savannah got engaged! The celebration party was in Santa Cruz — a milestone for the whole family.",
    photos: [
      { src: "/images/savannah-engaged.jpeg", alt: "Savannah's engagement party" },
    ],
    accentColor: "#F8C8D4",
  },
  {
    id: "christmas-dallas-23",
    chapter: 19,
    title: "Christmas in Dallas",
    date: "December 2023",
    location: "Dallas, TX",
    lat: 32.7767,
    lng: -96.797,
    travelFrom: { lat: 36.9741, lng: -122.0308 },
    description:
      "For the first time, Ashton spent Christmas with Iris and her family in Dallas. Warm, loud, and full of love.",
    photos: [
      { src: "/images/christmas-dallas.jpeg", alt: "Christmas in Dallas 2023" },
    ],
    accentColor: "#C0392B",
  },
  {
    id: "senior-year",
    chapter: 20,
    title: "Senior Year",
    date: "Winter–Spring 2024",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275,
    lng: -122.1697,
    travelFrom: { lat: 32.7767, lng: -96.797 },
    description:
      "Final year on the Farm. They soaked it all in — including trips to Tahoe in the winter and another Hawaii trip with Ashton's family.",
    photos: [
      { src: "/images/senior-year-tahoe.jpg", alt: "Tahoe trip senior year" },
      { src: "/images/senior-year-hawaii.jpg", alt: "Hawaii with family" },
      { src: "", alt: "Senior year campus life", placeholder: true },
    ],
    accentColor: "#8C1515",
  },
  {
    id: "graduation-japan",
    chapter: 21,
    title: "Graduation & Japan",
    date: "Spring 2024",
    location: "Japan",
    lat: 35.6762,
    lng: 139.6503,
    travelFrom: { lat: 37.4275, lng: -122.1697 },
    description:
      "They graduated from Stanford — and then immediately booked a flight to Japan. Cherry blossoms, ramen, temples, and bullet trains. The perfect graduation gift to each other.",
    photos: [
      { src: "/images/japan-1.jpeg", alt: "Japan trip" },
      { src: "/images/japan-2.jpg", alt: "Japan adventures" },
      { src: "/images/japan-3.jpg", alt: "Japan with Iris" },
    ],
    accentColor: "#E8B4C8",
  },
  {
    id: "long-distance",
    chapter: 22,
    title: "The Hard Part",
    date: "Summer–Fall 2024",
    location: "New York City, NY & Palo Alto, CA",
    lat: 40.7128,
    lng: -74.006,
    travelFrom: { lat: 35.6762, lng: 139.6503 },
    description:
      "After Japan, they went their separate ways — Iris to McKinsey in NYC, Ashton back to Palo Alto. Six months of long distance. Ashton flew out every month. Daily FaceTimes. They kept it going.",
    photos: [
      { src: "/images/long-distance-1.jpeg", alt: "Long distance visits to NYC" },
      { src: "/images/long-distance-2.jpg", alt: "Making it work" },
    ],
    accentColor: "#566573",
  },
  {
    id: "ashton-moves-nyc",
    chapter: 23,
    title: "He Moved",
    date: "February 2025",
    location: "New York City, NY",
    lat: 40.7128,
    lng: -74.006,
    description:
      "February 2025: Ashton packed up Palo Alto and moved to New York City. Same city. Finally.",
    photos: [
      { src: "", alt: "Moving to NYC", placeholder: true },
    ],
    accentColor: "#1A5276",
  },
  {
    id: "nyc-life",
    chapter: 24,
    title: "New York, Together",
    date: "2025",
    location: "New York City, NY",
    lat: 40.7128,
    lng: -74.006,
    description:
      "New York as a team. Hawaiian getaways, Savannah's wedding, a trip back to Stanford, Thanksgiving at Tyler's, Christmas in Houston, and another Hawaii trip in February 2026. And then — Europe: Italy and Istanbul.",
    photos: [
      { src: "/images/nyc-life-1.jpg", alt: "NYC life together" },
      { src: "/images/nyc-life-2.jpg", alt: "NYC adventures" },
      { src: "/images/nyc-life-3.jpg", alt: "Trips in 2025" },
      { src: "/images/nyc-life-4.jpg", alt: "More 2025 adventures" },
    ],
    accentColor: "#2471A3",
  },
  {
    id: "montreal",
    chapter: 25,
    title: "Next Stop: Montréal",
    date: "Coming Soon",
    location: "Montréal, QC, Canada",
    lat: 45.5017,
    lng: -73.5673,
    travelFrom: { lat: 40.7128, lng: -74.006 },
    description:
      "The adventure continues. Ashton & Iris are heading to Montréal — a new city, a new chapter, and many more to come.",
    photos: [
      { src: "", alt: "Montréal awaits", placeholder: true },
    ],
    accentColor: "#E74C3C",
  },
];

export const allLocations = chapters.map((c) => ({
  id: c.id,
  lat: c.lat,
  lng: c.lng,
  label: c.location.split(",")[0],
  color: c.accentColor,
}));
