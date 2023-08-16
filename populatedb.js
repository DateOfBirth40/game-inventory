#! /usr/bin/env node

console.log(
  "This script populates some test games, developers, genres, platforms and game copies to your database"
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Developer = require("./models/developer");
const Platform = require("./models/platform");
const Genre = require("./models/genre");
const GameCopy = require("./models/gameCopy");

const games = [];
const developers = [];
const platforms = [];
const genres = [];
const gamecopies = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createDevelopers();
  await createPlatforms();
  await createGames();
  await createGameCopies();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function developerCreate(
  index,
  title,
  summary,
  locationCity,
  locationCountry,
  founded
) {
  const developerdetail = {
    title: title,
    summary: summary,
    locationCity: locationCity,
    locationCountry: locationCountry,
    founded: founded,
  };

  const developer = new Developer(developerdetail);

  await developer.save();
  developers[index] = developer;
  console.log(`Added developer: ${title}`);
}

async function platformCreate(index, name) {
  const platform = new Platform({ name: name });
  await platform.save();
  platforms[index] = platform;
  console.log(`Added platform: ${name}`);
}

async function gameCreate(
  index,
  title,
  developer,
  publisher,
  summary,
  platform,
  genre,
  releaseYear
) {
  const gamedetail = {
    title: title,
    developer: developer,
    publisher: publisher,
    summary: summary,
    platform: platform,
    genre: genre,
    releaseYear: releaseYear,
  };
  // if (genre != false) gamedetail.genre = genre;

  const game = new Game(gamedetail);
  await game.save();
  games[index] = game;
  console.log(`Added game: ${title}`);
}

async function gameCopyCreate(index, game, platform, condition, price) {
  const gamecopydetail = {
    game: game,
    platform: platform,
    price: price,
    // title: game.title,
    // developer: game.developer,
    // summary: game.summary,
    // genre: game.genre,
    // releaseYear: game.releaseYear,
  };
  if (condition != false) gamecopydetail.condition = condition;

  const gamecopy = new GameCopy(gamecopydetail);
  await gamecopy.save();
  gamecopies[index] = gamecopy;
  console.log(
    `Added game copy: ${game.title} for ${platform}: ${condition} - ${price}`
  );
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "Action-Adventure"),
    genreCreate(1, "Role-Playing Game"),
    genreCreate(2, "First-Person Shooter"),
    genreCreate(3, "Sports"),
  ]);
}

// index, title, summary, locationCity, locationCountry, founded
async function createDevelopers() {
  console.log("Adding developers");
  await Promise.all([
    developerCreate(
      0,
      "Nintendo",
      "Nintendo Co., Ltd. is a Japanese multinational video game company headquartered in Kyoto. It develops, publishes and releases both video games and video game consoles. Nintendo has produced some of the most successful consoles in the video game industry, such as the Game Boy, the Super Nintendo Entertainment System, the Nintendo DS, the Wii, and the Switch. It has created numerous major franchises, including Mario, Donkey Kong, The Legend of Zelda, Metroid, Fire Emblem, Kirby, Star Fox, Pokémon, Super Smash Bros., and Animal Crossing.",
      "Kyoto",
      "Japan",
      "1889"
    ),
    developerCreate(
      1,
      "Rockstar Games",
      "Rockstar Games, Inc. is an American video game publisher based in New York City. Rockstar Games predominantly publishes games in the action-adventure genre, while racing games also saw success for the company. One of such action-adventure game franchises is Grand Theft Auto, where the most recent main game in the series, Grand Theft Auto V, has sold over 170 million copies since its release in September 2013, making it the second-best-selling video game of all time. Other popular franchises published by Rockstar Games are Red Dead, Midnight Club, Max Payne, and Manhunt.",
      "New York City",
      "United States",
      "1998"
    ),
    developerCreate(
      2,
      "Infinity Ward",
      "Infinity Ward, Inc. is an American video game developer. Infinity Ward has developed some of the most popular installments in the Call of Duty series, including Call of Duty 4: Modern Warfare, Call of Duty: Modern Warfare 2, Call of Duty: Modern Warfare 3, Call of Duty: Infinite Warfare, the Modern Warfare reboot, and its sequel.",
      "Woodland Hills",
      "United States",
      "2002"
    ),
    developerCreate(
      3,
      "Visual Concepts",
      "Visual Concepts Entertainment is an American video game developer based in Novato, California. Founded in May 1988, the company is best known for developing sports games in the 2K franchise, most recently NBA 2K and WWE 2K, and previously NFL 2K and College Hoops 2K.",
      "Novato",
      "United States",
      "1988"
    ),
    developerCreate(
      4,
      "DICE",
      "EA Digital Illusions CE AB (DICE) is a Swedish video game developer based in Stockholm. The company has been a subsidiary of Electronic Arts since 2006. Its releases include the Battlefield, Mirror's Edge and Star Wars: Battlefront series. Through their Frostbite Labs division, the company also develops the Frostbite game engine, which has seen use in many of EA's games, from entries in the Madden NFL series to the Battlefield series.",
      "Växjö",
      "Sweden",
      "1992"
    ),
    developerCreate(
      5,
      "EA Sports",
      'EA Sports is a division of Electronic Arts that develops and publishes sports video games. Formerly a marketing gimmick of Electronic Arts, in which they tried to imitate real-life sports networks by calling themselves the "EA Sports Network" (EASN) with pictures or endorsements with real commentators such as John Madden, it soon grew up to become a sub-label on its own, releasing game series such as EA Sports FC, PGA Tour, NHL, NBA Live, and Madden NFL.',
      "Redwood City",
      "United States",
      "1991"
    ),
  ]);
}

async function createPlatforms() {
  console.log("Adding platforms");
  await Promise.all([
    platformCreate(0, "Nintendo Switch"),
    platformCreate(1, "PlayStation 4"),
    platformCreate(2, "PlayStation 5"),
    platformCreate(3, "Xbox One"),
    platformCreate(4, "Xbox Series X|S"),
    platformCreate(5, "PC"),
  ]);
}

// index, title, developer, summary, platform, genre, releaseYear
async function createGames() {
  console.log("Adding games");
  await Promise.all([
    gameCreate(
      0,
      "Super Mario Odyssey",
      developers[0],
      "Nintendo",
      "Super Mario Odyssey is a 2017 platform game developed and published by Nintendo for the Nintendo Switch. An entry in the Super Mario series, it follows Mario and his new ally Cappy—a sentient hat that allows Mario to control other characters and objects—as they journey across various kingdoms to save Princess Peach from his nemesis Bowser's plans of forced marriage. In contrast to the linear gameplay of prior entries, the game returns to the primarily open-ended, 3D platform gameplay featured in Super Mario 64 and Super Mario Sunshine.",
      [platforms[0]],
      [genres[0]],
      "2017"
    ),
    gameCreate(
      1,
      "Grand Theft Auto V",
      developers[1],
      "Take-Two Interactive",
      "Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North. It is the seventh main entry in the Grand Theft Auto series, following 2008's Grand Theft Auto IV, and the fifteenth installment overall. Set within the fictional state of San Andreas, based on Southern California, the single-player story follows three protagonists—retired bank robber Michael De Santa, street gangster Franklin Clinton, and drug dealer and gunrunner Trevor Philips—and their attempts to commit heists while under pressure from a corrupt government agency and powerful criminals. The open world design lets players freely roam San Andreas' open countryside and the fictional city of Los Santos, based on Los Angeles.",
      [platforms[1], platforms[2], platforms[3], platforms[4], platforms[5]],
      [genres[0]],
      "2013"
    ),
    gameCreate(
      2,
      "Red Dead Redemption 2",
      developers[1],
      "Take-Two Interactive",
      "Red Dead Redemption 2 is a 2018 action-adventure game developed and published by Rockstar Games. The game is the third entry in the Red Dead series and a prequel to the 2010 game Red Dead Redemption. The story is set in a fictionalized representation of the United States in 1899 and follows the exploits of Arthur Morgan, an outlaw and member of the Van der Linde gang, who must deal with the decline of the Wild West whilst attempting to survive against government forces, rival gangs, and other adversaries. The game is presented through first- and third-person perspectives, and the player may freely roam in its interactive open world. Gameplay elements include shootouts, robberies, hunting, horseback riding, interacting with non-player characters, and maintaining the character's honor rating through moral choices and deeds. A bounty system governs the response of law enforcement and bounty hunters to crimes committed by the player.",
      [platforms[1], platforms[3], platforms[5]],
      [genres[0]],
      "2018"
    ),
    gameCreate(
      3,
      "Call of Duty: Modern Warfare",
      developers[2],
      "Activision",
      "Call of Duty: Modern Warfare is a 2019 first-person shooter video game developed by Infinity Ward and published by Activision. Serving as the sixteenth overall installment in the Call of Duty series, as well as a reboot of the Modern Warfare sub-series, it was released on October 25, 2019, for PlayStation 4, Windows, and Xbox One. \nThe game takes place in a realistic and modern setting. The campaign follows a CIA officer and British SAS forces as they team up with rebels from the fictional Republic of Urzikstan, combating together against Russian Armed Forces who have invaded the country and the Urzik terrorist group Al-Qatala, while searching for a stolen shipment of chlorine gas.",
      [platforms[1], platforms[2], platforms[3], platforms[4], platforms[5]],
      [genres[2]],
      "2019"
    ),
    gameCreate(
      4,
      "The Legend of Zelda: Breath of the Wild",
      developers[0],
      "Nintendo",
      "The Legend of Zelda: Breath of the Wild is a 2017 action-adventure game developed and published by Nintendo for the Nintendo Switch. Set at the end of the Zelda timeline, the player controls an amnesiac Link as he sets out to save Princess Zelda and prevent Calamity Ganon from destroying the world. Players explore the open world of Hyrule while they collect items and complete objectives such as puzzles or side quests. Breath of the Wild's world is unstructured and encourages exploration and experimentation; the story can be completed in a nonlinear fashion.",
      [platforms[0]],
      [genres[0]],
      "2017"
    ),
    gameCreate(
      5,
      "The Legend of Zelda: Tears of the Kingdom",
      developers[0],
      "Nintendo",
      "The Legend of Zelda: Tears of the Kingdom is a 2023 action-adventure game developed and published by Nintendo for the Nintendo Switch. The sequel to The Legend of Zelda: Breath of the Wild (2017), Tears of the Kingdom retains aspects including the open world of Hyrule, which has been expanded to allow for more vertical exploration. The player controls Link as he searches for Princess Zelda and fights to prevent the Demon King from destroying the world.",
      [platforms[0]],
      [genres[0]],
      "2023"
    ),
    gameCreate(
      6,
      "NBA 2K23",
      developers[3],
      "2K",
      "NBA 2K23 is a 2022 basketball video game developed by Visual Concepts and published by 2K, based on the National Basketball Association (NBA). Featured game modes include the return of the Jordan Challenge after a 12-year hiatus, allowing the player to recreate various key moments throughout Michael Jordan's career.",
      [
        platforms[0],
        platforms[1],
        platforms[2],
        platforms[3],
        platforms[4],
        platforms[5],
      ],
      [genres[3]],
      "2022"
    ),
    gameCreate(
      7,
      "Madden NFL 23",
      developers[5],
      "Electronic Arts",
      "Madden NFL 23 is a 2022 American football video game developed by EA Tiburon (EA Sports) and published by Electronic Arts.\nThe franchise mode featured new additions, including free agency tools and additional trade factors. The PS5 and Xbox Series X/S versions of the game included new defensive animations, including mid-air collisions and tackle assists, as well as a more precise passing mechanic on offense.",
      [platforms[1], platforms[2], platforms[3], platforms[4], platforms[5]],
      [genres[3]],
      "2022"
    ),
    gameCreate(
      8,
      "FIFA 23",
      developers[5],
      "Electronic Arts",
      'FIFA 23 is a football video game published by Electronic Arts (or simply EA). It is the 30th and final installment in the FIFA series that is developed by EA Sports, and the final installment under the FIFA banner.\nThe game features what\'s being dubbed as "HyperMotion2", a system of match capture with machine learning from real life football matches to create over 6,000 in-game animations. "Technical Dribbling" uses what is being called the "Active Touch" system to improve the footballer\'s path to the ball and improve a player\'s turning and dribbling with more responsiveness.',
      [
        platforms[0],
        platforms[1],
        platforms[2],
        platforms[3],
        platforms[4],
        platforms[5],
      ],
      [genres[3]],
      "2022"
    ),
  ]);
}

// index, game, platform, condition
async function createGameCopies() {
  console.log("Adding game copies");
  await Promise.all([
    gameCopyCreate(0, games[0], platforms[0].name, "New", "69.99"),
    gameCopyCreate(1, games[0], platforms[0].name, "Used", "29.99"),
    gameCopyCreate(2, games[1], platforms[1].name, "Used", "29.99"),
    gameCopyCreate(3, games[1], platforms[3].name, "Used", "29.99"),
    gameCopyCreate(4, games[1], platforms[2].name, "New", "69.99"),
    gameCopyCreate(5, games[2], platforms[1].name, "Used", "29.99"),
    gameCopyCreate(6, games[3], platforms[3].name, "Used", "29.99"),
    gameCopyCreate(7, games[3], platforms[5].name, "Used", "29.99"),
    gameCopyCreate(8, games[4], platforms[0].name, "Used", "29.99"),
    gameCopyCreate(9, games[4], platforms[0].name, "New", "69.99"),
    gameCopyCreate(10, games[6], platforms[1].name, "Used", "29.99"),
    gameCopyCreate(11, games[6], platforms[2].name, "Used", "29.99"),
    gameCopyCreate(12, games[6], platforms[4].name, "New", "69.99"),
    gameCopyCreate(13, games[7], platforms[1].name, "New", "69.99"),
    gameCopyCreate(14, games[7], platforms[2].name, "Used", "29.99"),
    gameCopyCreate(15, games[7], platforms[4].name, "New", "69.99"),
    gameCopyCreate(16, games[8], platforms[2].name, "New", "69.99"),
    gameCopyCreate(17, games[8], platforms[4].name, "Used", "29.99"),
    gameCopyCreate(18, games[8], platforms[5].name, "New", "69.99"),
  ]);
}
