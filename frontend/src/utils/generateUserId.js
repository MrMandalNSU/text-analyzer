import { v4 as uuidv4 } from "uuid";

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
  const uuidPart = uuidv4().slice(0, 4);
  return `${adj}-${noun}-${uuidPart}`;
}

export function getOrCreateUserId() {
  let userId = localStorage.getItem("unique_user_id");
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem("unique_user_id", userId);
  }
  return userId;
}
