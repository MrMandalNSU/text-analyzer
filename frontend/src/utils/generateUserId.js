import { v4 as uuidv4 } from "uuid";

// Lists can be expanded as needed
const adjectives = [
  "curious",
  "brave",
  "silly",
  "quiet",
  "gentle",
  "fuzzy",
  "bouncy",
  "happy",
  "zesty",
  "swift",
  "jazzy",
  "snappy",
];
const nouns = [
  "banana",
  "otter",
  "kiwi",
  "lemur",
  "penguin",
  "avocado",
  "melon",
  "panda",
  "koala",
  "mango",
  "eagle",
  "tulip",
];

function getRandomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateUserId() {
  const adj = getRandomFrom(adjectives);
  const noun = getRandomFrom(nouns);
  const uuidPart = uuidv4().slice(0, 8);
  return `${adj}-${noun}-${uuidPart}`;
}
