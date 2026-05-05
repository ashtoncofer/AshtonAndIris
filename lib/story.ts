export interface StoryPhoto {
  src: string;
  alt: string;
  placeholder?: boolean;
  video?: boolean;
}

export interface PersonLocation {
  lat: number;
  lng: number;
}

export type Era =
  | "Summer '21"
  | "Sophomore Year"
  | "Summer '22"
  | "Junior Year"
  | "Summer '23"
  | "Senior Year"
  | "Graduation"
  | "Long Distance"
  | "NYC Together"
  | "Next Chapter";

export interface StoryChapter {
  id: string;
  era: Era;
  title: string;
  date: string;
  location: string;
  lat: number;
  lng: number;
  altitude: number; // globe camera altitude — lower = more zoomed in
  description: string;
  photos: StoryPhoto[];
  accentColor: string;
  travelFrom?: { lat: number; lng: number };
  // Where each person physically is (defaults to chapter lat/lng if omitted)
  ashton?: PersonLocation;
  iris?: PersonLocation;
  journeyAnimation?: boolean;
}

const STANFORD  = { lat: 37.4275, lng: -122.1697 };
const DALLAS    = { lat: 32.7767, lng: -96.797  };
const PALO_ALTO = { lat: 37.4419, lng: -122.143 };
const OHIO      = { lat: 41.4097, lng: -81.3892 };
const NYC       = { lat: 40.7128, lng: -74.006  };
const SAN_DIEGO = { lat: 32.7157, lng: -117.1611 };

export const chapters: StoryChapter[] = [
  {
    id: "the-meeting",
    era: "Summer '21",
    title: "Where It All Began",
    date: "July 26, 2021",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275, lng: -122.1697, altitude: 1.1,
    description:
      "Ashton and Iris crossed paths for the first time at Tap on the Stanford campus — right after Ashton's soccer game. Neither of them knew it yet, but this was the start of everything.",
    photos: [
      { src: "/images/tap.png", alt: "First meeting at Tap" },
      { src: "/images/stanford-logo.png", alt: "Stanford" },
    ],
    accentColor: "#8C1515",
  },
  {
    id: "the-text",
    era: "Summer '21",
    title: "First Dinner",
    date: "July 27, 2021",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275, lng: -122.1697, altitude: 1.1,
    description:
      "They grabbed dinner together at Wilbur Dining. Ashton headed off to work on his pset — and Iris was racking her brain for something to say. She accidentally sent him an Apple Watch transcription message instead. Perfectly imperfect.",
    photos: [
      { src: "/images/wilbur-dining.jpg", alt: "Wilbur Dining at Stanford" },
      { src: "/images/apple-watch-text.png", alt: "The accidental Apple Watch text" },
    ],
    accentColor: "#4A90D9",
  },
  {
    id: "the-walk",
    era: "Summer '21",
    title: "Late Night Walk",
    date: "Late July 2021",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275, lng: -122.1697, altitude: 1.1,
    description:
      "They went on a three-hour walk around campus — the kind where time disappears. At some point they stumbled across some very photogenic raccoons, and kept walking anyway.",
    photos: [{ src: "/videos/raccoon-walk.mp4", alt: "Raccoons on the late night walk", video: true }],
    accentColor: "#5C8A6B",
  },
  {
    id: "cowboy-party",
    era: "Summer '21",
    title: "Yeehaw",
    date: "Late July 2021",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275, lng: -122.1697, altitude: 1.1,
    description:
      "At the end of Iris's week on campus, they went to a cowboy-themed party together. It was the perfect send-off before summer pulled them apart.",
    photos: [{ src: "/images/cowboy-party.jpeg", alt: "Cowboy theme party" }],
    accentColor: "#C4782A",
  },
  {
    id: "summer-facetime",
    era: "Summer '21",
    title: "Facetiming Every Day",
    date: "Summer 2021",
    location: "Palo Alto, CA  ↔  Dallas, TX",
    lat: 35.5, lng: -109.0, altitude: 2.2, // centered between CA and TX
    travelFrom: STANFORD,
    description:
      "Iris went home to Dallas. Ashton stayed in Palo Alto. They FaceTimed every day for the rest of the summer — something that would become their signature.",
    photos: [{ src: "/images/summer-facetime-1.jpeg", alt: "Summer FaceTime" }],
    accentColor: "#D4A844",
    ashton: PALO_ALTO,
    iris: DALLAS,
  },
  {
    id: "official",
    era: "Sophomore Year",
    title: "Back on Campus",
    date: "October 10, 2021",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275, lng: -122.1697, altitude: 1.1,
    travelFrom: DALLAS,
    description:
      "Fall quarter started and they were back on campus. On October 10th, Ashton and Iris made it official. A date they'd celebrate for years to come.",
    photos: [
      { src: "/images/official.jpg", alt: "October 10, 2021 — official" },
      { src: "/images/back-on-campus.jpg", alt: "Back on campus together" },
    ],
    accentColor: "#C0392B",
  },
  {
    id: "monterey-road-trip",
    era: "Sophomore Year",
    title: "First Road Trip",
    date: "December 8, 2021",
    location: "Monterey, CA",
    lat: 36.6002, lng: -121.8947, altitude: 0.7,
    travelFrom: STANFORD,
    description:
      "Their first trip together: a road trip down the coast from Stanford to Monterey. The Pacific, the sea breeze, and good company.",
    photos: [{ src: "/images/monterey-1.jpeg", alt: "Monterey road trip" }],
    accentColor: "#2980B9",
  },
  {
    id: "christmas-apart",
    era: "Sophomore Year",
    title: "Back Home",
    date: "December 2021",
    location: "Dallas, TX  ↔  Chagrin Falls, OH",
    lat: 38.5, lng: -89.0, altitude: 1.9, // centered between OH and TX
    travelFrom: { lat: 36.6002, lng: -121.8947 },
    description:
      "Christmas break: Iris went back to Dallas; Ashton flew home to Ohio. 1,900 miles between them. They FaceTimed every day — as always.",
    photos: [{ src: "/images/christmas-apart.jpeg", alt: "FaceTime over Christmas" }],
    accentColor: "#2C3E50",
    ashton: OHIO,
    iris: DALLAS,
  },
  {
    id: "school-year-22",
    era: "Sophomore Year",
    title: "Together Every Day",
    date: "Winter–Spring 2022",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275, lng: -122.1697, altitude: 1.1,
    travelFrom: OHIO,
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
    era: "Sophomore Year",
    title: "The Happiest Place on Earth",
    date: "May 29, 2022",
    location: "Anaheim, CA",
    lat: 33.8121, lng: -117.919, altitude: 0.9,
    travelFrom: STANFORD,
    description:
      "A weekend in LA at Disneyland — because why not? They rode everything, ate everything, and loved every second.",
    photos: [{ src: "/images/disneyland.jpeg", alt: "Disneyland" }],
    accentColor: "#1A6EBF",
  },
  {
    id: "austin-family",
    era: "Summer '22",
    title: "Meeting the Family",
    date: "June 2022",
    location: "Austin, TX",
    lat: 30.2672, lng: -97.7431, altitude: 1.4,
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
    era: "Summer '22",
    title: "Long Distance, Round Two",
    date: "Summer 2022",
    location: "Palo Alto, CA  ↔  Dallas, TX",
    lat: 35.5, lng: -109.0, altitude: 2.2,
    travelFrom: { lat: 30.2672, lng: -97.7431 },
    description:
      "Iris interned at Alcon in Dallas. Ashton held it down in Palo Alto. Daily FaceTimes kept them close across the miles.",
    photos: [{ src: "/images/summer-facetime-2.jpeg", alt: "Summer FaceTime 2022" }],
    accentColor: "#F39C12",
    ashton: PALO_ALTO,
    iris: DALLAS,
  },
  {
    id: "anniversary-1",
    era: "Junior Year",
    title: "One Year",
    date: "October 10, 2022",
    location: "Monterey, CA",
    lat: 36.6002, lng: -121.8947, altitude: 0.7,
    travelFrom: STANFORD,
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
    era: "Junior Year",
    title: "Aloha for the First Time",
    date: "October 22, 2022",
    location: "Hawaii",
    lat: 20.7984, lng: -156.3319, altitude: 1.6,
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
    id: "thanksgiving-sandiego",
    era: "Junior Year",
    title: "Thanksgiving in San Diego",
    date: "November 2022",
    location: "San Diego, CA",
    lat: 32.7157, lng: -117.1611, altitude: 1.2,
    travelFrom: { lat: 20.7984, lng: -156.3319 },
    description:
      "Thanksgiving in San Diego — meeting Tyler's family for the first time. They played Dungeons & Dragons, ate great food, and kicked off a new tradition.",
    photos: [
      { src: "/images/thanksgiving-sandiego-1.jpeg", alt: "Thanksgiving in San Diego" },
      { src: "/images/thanksgiving-sandiego-2.jpeg", alt: "Dungeons & Dragons in San Diego" },
    ],
    accentColor: "#E67E22",
  },
  {
    id: "hawaii-2",
    era: "Junior Year",
    title: "Back to the Islands",
    date: "March 2023",
    location: "Hawaii",
    lat: 21.3069, lng: -157.8583, altitude: 1.6,
    travelFrom: SAN_DIEGO,
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
    era: "Summer '23",
    title: "The City That Never Sleeps",
    date: "Summer 2023",
    location: "New York City, NY",
    lat: 40.7128, lng: -74.006, altitude: 1.4,
    travelFrom: { lat: 21.3069, lng: -157.8583 },
    description:
      "Iris interned at McKinsey in New York. Ashton was back in Palo Alto — but he flew out for a weekend and fell in love with the city. It planted a seed.",
    photos: [
      { src: "/images/nyc-summer-1.jpeg", alt: "NYC summer 2023" },
      { src: "/images/nyc-summer-2.jpeg", alt: "Ashton visits NYC" },
      { src: "/images/nyc-summer-3.jpeg", alt: "New York City" },
    ],
    accentColor: "#E74C3C",
    ashton: PALO_ALTO,
    iris: NYC,
  },
  {
    id: "napa",
    era: "Senior Year",
    title: "Two Years",
    date: "October 2023",
    location: "Napa Valley, CA",
    lat: 38.2975, lng: -122.2869, altitude: 0.8,
    travelFrom: NYC,
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
    era: "Senior Year",
    title: "She Said Yes",
    date: "November 2023",
    location: "Santa Cruz, CA",
    lat: 36.9741, lng: -122.0308, altitude: 0.8,
    travelFrom: { lat: 38.2975, lng: -122.2869 },
    description:
      "Savannah got engaged! The celebration party was in Santa Cruz — a milestone for the whole family.",
    photos: [{ src: "/images/savannah-engaged.jpeg", alt: "Savannah's engagement party" }],
    accentColor: "#F8C8D4",
  },
  {
    id: "christmas-dallas-23",
    era: "Senior Year",
    title: "Christmas in Dallas",
    date: "December 2023",
    location: "Dallas, TX",
    lat: 32.7767, lng: -96.797, altitude: 1.5,
    travelFrom: { lat: 36.9741, lng: -122.0308 },
    description:
      "For the first time, Ashton spent Christmas with Iris and her family in Dallas. Warm, loud, and full of love.",
    photos: [{ src: "/images/christmas-dallas.jpeg", alt: "Christmas in Dallas 2023" }],
    accentColor: "#C0392B",
  },
  {
    id: "senior-year",
    era: "Senior Year",
    title: "Senior Year",
    date: "Winter–Spring 2024",
    location: "Stanford University, Palo Alto, CA",
    lat: 37.4275, lng: -122.1697, altitude: 1.1,
    travelFrom: DALLAS,
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
    era: "Graduation",
    title: "Graduation & Japan",
    date: "Spring 2024",
    location: "Japan",
    lat: 35.6762, lng: 139.6503, altitude: 2.4,
    travelFrom: STANFORD,
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
    era: "Long Distance",
    title: "Coast to Coast",
    date: "Summer–Fall 2024",
    location: "Palo Alto, CA  ↔  New York City, NY",
    lat: 39.5, lng: -96.0, altitude: 2.2, // centered over US
    travelFrom: { lat: 35.6762, lng: 139.6503 },
    description:
      "After Japan, they went their separate ways — Iris to McKinsey in NYC, Ashton back to Palo Alto. Six months of long distance. Ashton flew out every month. Daily FaceTimes. They kept it going.",
    photos: [
      { src: "/images/long-distance-1.jpeg", alt: "Long distance visits to NYC" },
      { src: "/images/long-distance-2.jpg", alt: "Making it work" },
    ],
    accentColor: "#566573",
    ashton: PALO_ALTO,
    iris: NYC,
  },
  {
    id: "ashton-moves-nyc",
    era: "NYC Together",
    title: "He Moved",
    date: "February 2025",
    location: "New York City, NY",
    lat: 40.7128, lng: -74.006, altitude: 1.3,
    travelFrom: PALO_ALTO,
    description:
      "February 2025: Ashton packed up Palo Alto and moved to New York City. Same city. Finally.",
    photos: [{ src: "/images/he-moved.jpeg", alt: "Moving to NYC" }],
    accentColor: "#1A5276",
  },
  {
    id: "nyc-life",
    era: "NYC Together",
    title: "New York, Together",
    date: "2025",
    location: "New York City, NY",
    lat: 40.7128, lng: -74.006, altitude: 1.3,
    description:
      "New York as a team. Hawaiian getaways, Savannah's wedding, a trip back to Stanford, Thanksgiving at Tyler's, Christmas in Houston, and another Hawaii trip in February 2026. And then — Europe: Italy and Istanbul.",
    photos: [
      { src: "/images/nyc-life-1.jpg", alt: "NYC life together" },
      { src: "/images/nyc-life-2.jpg", alt: "NYC adventures" },
      { src: "/images/italy.jpg", alt: "Italy & Istanbul" },
      { src: "/images/nyc-life-3.jpg", alt: "Trips in 2025" },
    ],
    accentColor: "#2471A3",
    journeyAnimation: true,
  },
  {
    id: "paris",
    era: "Next Chapter",
    title: "Next Stop: Paris",
    date: "Coming Soon",
    location: "Paris, France",
    lat: 48.8566, lng: 2.3522, altitude: 1.2,
    travelFrom: NYC,
    description:
      "The adventure continues. Ashton & Iris are heading to Paris — a new city, a new chapter, and many more to come.",
    photos: [{ src: "", alt: "Paris awaits", placeholder: true }],
    accentColor: "#E74C3C",
  },
];
