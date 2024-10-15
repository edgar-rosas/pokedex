# Pokedex App Setup

This app uses SQLite for it's database, a seeding process will start as soon as the app is ran for the first time. Please make sure you have internet access as it will perform a series of network requests to [PokeAPI](https://pokeapi.co/).

You should be able to see progress on this seeding process directly on your terminal. Once it's completed, head on over to the Pokedex Client directory to setup and run the client!

Node 20.18.0 was used to develop this app, if you have nvm you can run the `nvm use` command to automatically set your version of Node to the specified one.

1.  `npm install`
2.  `npm run start`This will start the seeding process only if it hasn't been run before.
3.  All done! You may visit the [Swagger docs](http://localhost:3000/api/) to take a look at the avaiable endpoints.
4.  Head on over to the client directory to run the client app.
