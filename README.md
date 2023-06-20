# Getting Started with gangs.gg codebase

## Downloading some dependencies manually
You will need to download python and add it to your path env variable. A good article can be found here on this: https://stackoverflow.com/questions/15126050/running-python-on-windows-for-node-js-dependencies

You will need to be running on node version 14.13.1. You can use node version manager to download and switch to using that version of node. 

##Downloading the rest of the dependencies with npm i
In the root folder, run an npm i. This will download everything for the api.

CD into the ui folder, run another npm i here to download everything for the ui. 

If you get errors look the the section above about getting python and being on the right node version.

## Available Scripts

In the project directory, you can run:

### `supervisor index.js`

Starts the api locally

### `cd ui , npm start`

Runs the ui in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.\
You will also see any lint errors in the console.

