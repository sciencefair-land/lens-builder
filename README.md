Lens Starter
========

Lens Starter provides a minimal Lens integration. It's a perfect starting point for building your very own customized Lens.

## Prerequisites

For Lens development, you need to have Node.js >=0.10.x installed.

### Substance Screwdriver

We use a custom Python tool to manage Git repositories.
We didn't opt for using Git sub-modules as it doesn't make it easier but rather even more complicated.

To install Substance Screwdriver do

```bash
$ git clone https://github.com/substance/screwdriver.git
```

and install it globally

```bash
$ cd screwdriver
$ sudo python setup.py install
```

You need to repeat that install step whenever you updated the screwdriver repo.

## Setup

1. Clone the lens-starter repository

  ```bash
  $ git clone https://github.com/elifesciences/lens-starter.git
  ```

2. Fetch dependencies

  ```bash
  $ cd lens-ams
  $ substance --update
  ```

3. Run the server

  ```bash
  ~/projects/lens-ams $ node server
  Lens running on port 4001
  http://127.0.0.1:4001/
  ```

4. Open in browser

This will show you a simple index page with links to sample files.

5. Updates

To receive all new changes update the main repo and then use the screwdriver again

```
$ git pull
$ substance --update
```

## Bundling

You need to have `browserify` and `uglify-js` installed:

```bash
$ sudo npm install -g browserify uglify-js
```

A bundle is created via

```bash
$ substance --bundle
```

There are two options available (not-minified JS bundle, bundle with souremap):

```bash
$ substance --bundle nominify,sourcemap
```

To control which assets are bundled adjust the `assets` block in `.screwdriver/project.json`.

After bundling you can serve the bundle e.g. using

```bash
$ cd dist
$ pyhton -m SimpleHTTPServer
```

To open one of the bundled samples you need open the following URL in your browser

```bash
http://127.0.0.1:8000/doc.html?url=data/samples/preprocessed/bproc1.xml
```

> Adjust the 'url' parameter to open a different document.
