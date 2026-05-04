export type Category = {
  code: string;
  name: string;
  image?: string;
  description: string;
};

// Order matters — drives the grid sequence on home + products page.
// To add a real image for putters/drivers: drop it into /public/images and
// set the `image` field below.
export const CATEGORIES: Category[] = [
  {
    code: "01",
    name: "Golf Balls",
    image: "/images/balls.webp",
    description: "Pro Plus, Pro, Tour & Drive — full Vice ball line.",
  },
  {
    code: "02",
    name: "Gear & Bags",
    image: "/images/Vice-Golf-Landing-Page-Category-Gear.webp",
    description: "Cart, stand and tour bags, gloves, towels, headcovers.",
  },
  {
    code: "03",
    name: "Wedges",
    image: "/images/wedge.png",
    description: "VGW wedges with custom grind options.",
  },
  {
    code: "04",
    name: "Putters",
    image: "/images/putter.png",
    description: "VGP04 mallet & blade putters — fit to your stroke arc.",
  },
  {
    code: "05",
    name: "Driver & Woods",
    image: "/images/driver.webp",
    description: "Built lighter. Swings faster. Hits further. Drivers, fairway woods & hybrids.",
  },
  {
    code: "06",
    name: "Irons",
    image: "/images/irons.png",
    description: "VGI03 one-piece forged players' irons & VGI distance series.",
  },
];
