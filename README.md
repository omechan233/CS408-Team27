## Obsidian Ark

---

Obsidian Ark is a top-down, horde based, quick play, survival based game.

Built for Purdue University | CS408 - Software Testing - Spring 2018

## Team Members
<a href="https://github.com/omechan233" target="_blank">Yi Dou</a>

<a href="https://github.com/zou50" target="_blank">Danny Zou</a>

<a href="https://github.com/devonlee111" target="_blank">Devon Lee</a>

<a href="https://github.com/JamesPHawk" target="_blank">James Hawk</a>

<a href="https://github.com/jstoddard94" target="_blank">Jordan Stoddard</a>

## Technologies / Dependencies

HTML5 | CSS3 | JS

* node 6.11.2+
* npm 5.7.1+
* express 4.16.2+
* file-system 2.2.2+
* mongodb 2.2.33+
* mongodb-core 3.0.5+
* mongoose 5.0.3+
* password-hash 1.2.2+
* phaser 2.6.2+
* require 2.4.20+
* socket.io 2.0.4+

##

### Installation

#### Requires <a href="https://nodejs.org/en/" target="_blank">Node.js</a>

#### Bash

```
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
```

```
sudo apt-get install -y nodejs
```

#### OSX Homebrew
```
brew install node
```


##

Check for successful installation

```
node -v
```

```
npm -v
```

Run the install script

```
./install.sh
```

Run the app

```
node app
```

If successful, app will be running on <a href="http://localhost:3000/" target="_blank">localhost:3000</a>

## Assets / Tools

##### <a href="http://www.mapeditor.org/" target="_blank">Tiled</a>

## Controls

    WASD / Arrow Keys: movement
    Mouse: aim
    Mouse1: basic attack
    Mouse2: special attack
    Q: switch weapons
    ESC: pause/unpause

### Dev Tools

    0-9: spawn specific mob (10 types)
    Spacebar: spawn random mob
    Backspace: spawn 100 random mobs
    P: display player position in console
    X: kill player

## Notes

- mongodb must be below version 3.0 due to mLab database
- restarting a game session may result in pause bug

## Assets
- Some custom tile assets and some from RMXP
- Bgm from イスVII, 那由多の軌跡, 空の軌跡
