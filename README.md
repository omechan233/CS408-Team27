## Obsidian Ark

---

Obsidian Ark is a top-down, horde based, quick play, survival based game.

Built for Purdue University | CS408 - Software Testing - Spring 2018

## Team Members
[Yi Dou](https://github.com/omechan233)

[Danny Zou](https://github.com/zou50)

[Devon Lee](https://github.com/devonlee111)

[James Hawk](https://github.com/JamesPHawk)

[Jordan Stoddard](https://github.com/jstoddard94)

## Technologies / Dependencies

HTML5 | CSS3 | JS

* node 6.11.2+
* npm 5.7.1+
* express 4.16.2+
* file-system 2.2.2+
* mongodb 2.2.33+
* mongoose 5.0.3+
* password-hash 1.2.2+
* phaser 2.6.2+
* require 2.4.20+
* socket.io 2.0.4+

```
npm install
```

## Assets / Tools

##### [Tiled](http://www.mapeditor.org)

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