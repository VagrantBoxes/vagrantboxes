VagrantBoxes
============

Requirements
------------

To run or build the project you need nodejs, Grunt's command line interface and bower, a front-end package manager.

```
npm install -g grunt-cli
npm install -g bower
```

In Arch Linux you can install the required packages as follows.

```
yaourt -S nodejs-grunt-cli nodejs-bower
```

Run the app
-----------

```
npm install
bower install
grunt server
```

Build for deployment
--------------------

```
grunt build
```

The build will be located in the `dist` directory.