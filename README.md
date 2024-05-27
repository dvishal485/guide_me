# GuideMe

![GuideMe! logo](public/logo128.png)

A browser extension to give you a step by step tutorial for various websites.

GuideMe! can inject `shepherd.js` into websites which do not add their own support.

Infact, it makes addition of a tutorial extremely easy on any page, it only requires to build a config.json file for each page you want to attach your guide. [Here is a sample](./configs/team.dtutimes.com/login_page.json).

https://github.com/dvishal485/guide_me/assets/26341736/012f4f2e-6828-4bc3-bea5-ab49ff361c7b

## Installation

- For firefox, [you can hop on to AMO](https://addons.mozilla.org/en-US/android/addon/guideme/) to download and install your addon.
- For chrome, clone this repo and build it with environment variable `TARGET_CHROME=true`, and then load unpaced the extension on chrome the `/dist` directory. Alternatively you can directly download the `/dist` output of [built extension from releases](https://github.com/dvishal485/guide_me/releases/latest).

## Use Cases

- This tool can be utilized to acquaint users with limited technical expertise with a range of web services.
- A website utilizing non-js based builds can also use `shepherd.js` to add a website tour.
- This resource serves to educate on the fundamentals of select web services, which, while straightforward and intuitive, may still require guidance for children, thus acting as a bridge.
- Requires no hindering with code! Only a single configuration file handles it all.

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
