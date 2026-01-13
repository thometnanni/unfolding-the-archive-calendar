# Unfolding the Archive – Calendar

This project is part of _Unfolding the Archive: New Dimensions of Access to Born-digital Architecture Collections_, led by Ania Molenda at the Nieuwe Instituut. It explores new ways to access and interpret born-digital architecture archives, combining methods from museum studies, archival studies, architecture, and digital humanities. The goal is to develop prototypes and tools that enable dynamic, multimodal, and participatory exploration of digital archival materials, focusing on underused metadata as new forms of discovery.

## Usage

This repository contains the necessary source code to prepare, create and deploy the visualisation.

### Directories

- `.github`: A [github workflow](https://docs.github.com/en/actions/how-tos/write-workflows) to automatically deploy the website to github pages
- `preprocessing`: The necessary [Node.js](https://nodejs.org) scripts to extract the metadata from any project directory required for the calendar visualisation
- `prototype`: The [SvelteKit](https://svelte.dev) website and calendar visualisation.

### Prerequisites

- [Node.js](https://nodejs.org/en); This project was developed and tested on version 24.6.0
- [Basic understanding of how to use the command line / terminal](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line)

### Preprocessing

Preprocessing is required to extract the necessary metadata from a project directory, its subdirectories and files.

#### Setup

To get started, navigate to `preprocessing`…

```
cd preprocessing
```

…and install dependencies.

```
npm install --omit=dev
```

This will also install optional dependecies to extract layer names from dwg, dxf, and psd files. You can skip those by instead running:

```
npm install --omit=dev --omit=optional
```

#### Usage

With the dependencies installed you can now run index.js:

```
node index.js -i "[path to project directory]"
```

You always need to specify a project directory using the `-i` argument. Assuming you have a `Projects` folder in your home/user directory this might look like

```
node index.js -i "~/Projects/My Project"
```

Optional parameters are:

- `-o "[path to output directory]"`: this specifies the location where to export the extracted metadata. If you omit this parameter the output directory defaults to `"../prototype/static/projects"` where the visualisation prototype expects it.
- `--batch`: Use this to process a folder of project folders instead of a single project folder. i.e. `node index.js -i "~/Projects" --batch`
- `--layers`: Use this to extract layer names from supported files. Extracting layers requires loading and parsing files and will take comsiderably longer.

This will export multiple files to the output directory.

- `directories.json` contains a list of project names and data files and is required for making a project selectable in the visualisation. When exporting multiple projects without using `--batch` this may require some manual editing.
- `[project directory name].json` contains the project and file metadata. When using `--batch` one file per project directory will be created.

The project and file metadata contains for every file in the project directory: name, path, file size, birthtime (timestamp of when the file was created), the hour and date of the creation and if applicable layer names and filetype.

The filetype is derrived from a files extensions and classified as follows:

- pdf, doc, qxd, indd, txt: document
- jpg, tif, psd, png, gif: image
- dwg, ai, fmz, eps, dxf, igs, plt, obj: drawing

#### Development

For development you may want to install all dependencies including dev and optional:

```
npm install
```

##### `index.js`

This is the main script, parsing parameters, reading and parsing basic file metadata, converting and exporting data.

##### `config.js`

This file contains so baisc configurations on which files to ignore and how specific file extensions are categorised.

##### `layers/*`

Multiple scripts to handle layer extraction for varoius file types. To add support for other file types add a case to `layers/index.js` and provide a custom script. It is recommend to install any additional package you require as optional dependecies and to load them dynamically.

##### `utils.js`

Various utlity scripts.

### Prototype / Visualisation

The visualisation is a SvelteKit website. After preprocessing your project directories you will need to rebuild this website.

from the project root, navigate into the directory:

```
cd prototype
```

Install dependencies

```
npm install
```

Build website

```
npm run build
```

Copy the files in the `build` directory to your web server.

If you want to preview the website locally instead, run:

```
npm run preview
```

#### Development

Run the website locally in development mode:

```
npm run dev
```

##### Updating _About_

The prototype consists of several components and script files. To change the text appearing on the website open `src/lib/components/About.svelte` The html text on top is always visible, eveything between `{#if showMore}` and `{/if}` is shown on demand.

##### Other Changes

For more advanced changes you may require a more in depth understanding of Svelte and SvelteKit. Follow their tutoprial to [get started](https://svelte.dev/tutorial/svelte/welcome-to-svelte).
