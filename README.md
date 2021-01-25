![Template Image](./templates/image_template.png)

# Setup a _<new project\>_...

> Last update January 24, 2021;

## Guide
1. [Prerequisite](#prerequesite)
2. [Getting Ready](#getting-ready)
3. [Create Repository](#create-repository)
4. [Setup Nuxt.js App (Vue.js)](#setup-nuxt.js-app-(vue.js)) 
5. [Deploy on Github Pages](#deploy-on-github-pages) 
6. [Optional Node Modules](#optional-node-modules) 
7. [Important Nuxt Commands](#important-nuxt-commands)
8. [Possible Issues](#possible-issues)
9. [Other](#other)

## Prerequesite

- Git 
- Git GUI
- Code Editor
- Node.js
- NPM

## Getting Ready

> **This section is for users who don't have the prequesite. Please skip ahead if you do.**

- [ ] Install [Git](https://git-scm.com/)
- [ ] Install a Git GUI
	- Windows : [Github Desktop](https://desktop.github.com/)
	- Linux : [GitKraken](https://www.gitkraken.com/)
- [ ] Install a Code Editor
	- [Visual Studio Code](https://code.visualstudio.com/) (Recommended)
	- [Atom](https://atom.io/)
	- [Sublime Text](https://www.sublimetext.com/)
	- [Notepad++](https://notepad-plus-plus.org/)
- [ ] Install [Node.js](https://nodejs.org/en/) (Includes NPM)

## Create repository

- [ ] On [this repository](https://github.com/LeVieuxSinge/TemplateProject) Click on **Use this template** to create a new repository.
- [ ] Fill in the information and click on **Create repository from template**.

## Setup Nuxt.js App (Vue.js)

> **The following instructions consider you are on Windows and using the recommended programs above.**

- [ ] Open your **Github Desktop**.
- [ ] **Clone** the repository on your local machine. (File > Clone Repository...)
- [ ] Open **Visual Studio Code**.
- [ ] Open the **folder** containing your repository. (File > Open Folder...)
- [ ] Open a new **terminal**. (Terminal > New Terminal)
- [ ] Enter the following **command** where _<project-name\>_ is the name for your project (Generally the same as the repository) :

	```bash
	npm init nuxt-app <project-name>
	```

- [ ] Follow the **instructions**. [Click me for more information.](https://github.com/nuxt/create-nuxt-app)
- [ ] Once done, find the newly created folder in your repository **files**. (Generally under **/Documents/Github/**)
- [ ] **Transfer** everything from the new foler inside your repository root folder.

## Deploy on Github Pages

- [ ] Run this command in a new **terminal** (Terminal > New Terminal) :

	```bash
	npm install --save-dev push-dir
	```

	[Push-Dir Documentation](https://github.com/L33T-KR3W/push-dir)

- [ ] Edit the **package.json** file and add a deploy command :

	```js
	"scripts": {
		"dev": "nuxt",
		"generate": "nuxt generate",
		"start": "nuxt start",
		"deploy": "push-dir --dir=dist --branch=gh-pages --cleanup"
	},
	```

- [ ] To deploy on Github Pages, simply execute :

	```bash
	npm run generate
	npm run deploy
	```

## Optional Node Modules

### Sass - [What is Sass?](https://sass-lang.com/) [How to use Sass with Nuxt.js?](https://fr.nuxtjs.org/faq/pre-processors/)
- [ ] Run this command in a new **terminal** (Terminal > New Terminal) :

	```bash
	npm install --save-dev sass sass-loader
	```

### Animejs - [What is Anime.js?](https://animejs.com/) [How to use Anime.js with Nuxt.js?](https://github.com/ivodolenc/nuxt-animejs)
- [ ] Run this command in a new **terminal** (Terminal > New Terminal) :

	```bash
	npm install --save-dev nuxt-animejs
	```

- [ ] Add nuxt-animejs to the buildModules section of **nuxt.config.js** :

	```js
	export default {
		buildModules: ['nuxt-animejs']
	}
	```

### Vuetify - [What is Vuetify?](https://vuetifyjs.com/en/) [How to use Vuetify with Nuxt.js?](https://vuetifyjs.com/en/introduction/why-vuetify/)
- [ ] Run this command in a new **terminal** (Terminal > New Terminal) :

	```bash
	npm install --save-dev @nuxtjs/vuetify
	```

- [ ] Add nuxt-vuetify to the buildModules section of **nuxt.config.js** :

	```js
	export default {
		buildModules: ['@nuxtjs/vuetify']
	}
	```

## Important Nuxt Commands

- To execute Nuxt commands, open a new **terminal**. (Terminal > New Terminal)
- List of commands :

	- Install or update all dependencies found on **package-lock.json** :

	```bash
	npm install
	```

	- Start **Development** Server on http://localhost:3000 :

	```bash
	npm run dev
	```

	- Start **Production** Server :

	```bash
	npm run build
	npm run start
	```

	- Generate **Static** Files (Make sure you have the right target setting in **nuxt.config.js**) :

	```js
	export default {
  		target: 'static'
	}
	```

	```bash
	npm run generate
	```

## Possible Issues

- If when you try to run **npm install** you get : "install function not found" or any similar issue, execute this command in a new terminal (Terminal > New Terminal) :

	```bash
	npm install --save nuxt
	```

- If when you try to run **npm run dev** you get "ENOSPC: System limit for number of file watchers reached", execute this command in a new terminal (Terminal > New Terminal) :

	- Windows :

	```bash
	echo fs.inotify.max_user_watches=524288
	```

	- Linux :

	```bash
	sudo tee -a /etc/sysctl.conf && sudo sysctl -p
	```

- If when you open **Visual Studio Code** there is a window saying 'GIT not found. Install git ...', add the directory to system's PATH.

	- Open Control Panel -> System and Security -> System -> Advanced System Settings -> Environment Variables -> *Click On PATH* -> Edit -> New -> Paste this directory:

	```text
	C:\Users\USERNAME\AppData\Local\GitHubDesktop\app-VERSION\resources\app\git\cmd
	```

---

## Other

[Markdown Cheatsheet](https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf)

:metal: Huge thanks to all the developers behind these amazing tools. :metal: