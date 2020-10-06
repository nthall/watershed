# Watershed - A listen-later queue for streaming music

Watershed is an app for saving music to listen later. It's not complete but I got tired of keeping it private and not finishing it. I hope to release something usable soon.

## Project Status
I still really like the idea of finishing this up and "releasing" a production deployment, but life and other ideas and new fascinations keep getting in the way.

The server is down right now but I will stand it back up soon. In theory, though, you should have everything you need here to run your own.

## Installation
* The browser extension is currently available in two ways:
  * **Chrome**: By invitiation only in the Chrome Store
  * **Firefox**: Direct file transfer (or checkout and [build](#build)) to get the extension, then follow [manual installation](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/) instructions
  * No other browsers have been tested for support. It'd be neat if someone wanted to play around with that.
* The webapp is markedly less useful without the browser extension :(

## Contributing
* I don't expect anyone to contribute but if this is interesting to you I'd love to hear from you and talk about it.
* Some obvious areas for improvement are:
  * Testing
  * Updating React (again!? again.)
  * Docs/docstrings
  * Adding compatibility for other streaming sources, e.g.:
    * Youtube playlists

<a name="build"></a>
### Building the extension
[Webpack](https://webpack.js.org/) is the tool that builds both the player frontend and the browser extension. Once you have the project cloned, building the extension should theoretically be as simple as:

1. `yarn install`
2. `webpack --config webpack.config.js --browser`
3. This outputs to `browser/dist/` -- that's the folder you want for manually installing in Firefox. I don't remember how Chrome works in this regard anymore.

If that doesn't work, at least you know where to poke around.
