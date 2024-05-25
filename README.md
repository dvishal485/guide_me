# guide_me

A browser extension to give you a step by step tutorial for various websites.

GuideMe! can inject `shepherd.js` into websites which do not add their own support.

Infact, it makes addition of a tutorial extremely easy on any page, it only requires to build a config.json file for each page you want to attach your guide. [Here is a sample](./configs/team.dtutimes.com/login_page.json).

## How to add configuration?

- Fork and clone this repo on your system
- Create a folder with you domain name in `/configs` directory
- Create a `<configuration_name>.json` file with [the format same as here](./configs/team.dtutimes.com/login_page.json)
- Push these changes in your repo
- [Make a PR in original repo](https://github.com/dvishal485/guide_me/compare)
- Wait for the changes to me merged!

## How to build extension?

- Fork and clone this repo on your system
- [Install `bun` on your system](https://bun.sh/)
- Execute build script `bun run build`
- Your extension will be ready and saved at `ext/` directory!
