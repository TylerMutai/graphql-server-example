import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import typeDefs from "./schema";
import db from "./_db";

const port = 4000;

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_, args) {
      return db.games.find((review) => args.id === review.id);
    },
    reviews() {
      return db.reviews;
    },
    review(_, args) {
      return db.reviews.find((review) => args.id === review.id);
    },
    authors() {
      return db.authors;
    },
    author(_, args) {
      return db.authors.find((review) => args.id === review.id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((review) => review.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((review) => review.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return db.authors.find(a => a.id === parent.author_id);
    },
    game(parent) {
      return db.games.find(a => a.id === parent.game_id);
    },
  },
  Mutation: {
    deleteGame(_, args) {
      db.games = db.games.filter(g => g.id !== args.id);
      return db.games;
    },
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      db.games.push(game);
      return game;
    },
    updateGame(_, args) {
      db.games = db.games.map(g => {
        if (g.id === args.game.id) {
          return {
            ...g, ...args.game,
          };
        }
        return g;
      });
      return args.game;
    },
  },
};
// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const {url} = await startStandaloneServer(server, {
  listen: {
    port: port,
  },
});

console.log(`Server ready at ${url}`);