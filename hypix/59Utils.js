const Utils = require("./modules/utils.js");
const Embed = Utils.Embed;
const chalk = require('chalk');
const path = require('path');

module.exports = {
  addonPrefix: chalk.hex("#03fceb").bold("[59L-ADDON] "),
  reactEmojis: async function (number1, number2, msg) {
    if (number1 < 1 || number2 > 10) return console.log(`${module.exports.addonPrefix}${Utils.errorPrefix}Invalid reaction number`)
    while (number1 <= number2) {
      await msg.react(Utils.getEmoji(number1))
      ++number1
    }
  },
  loadAddon: function (file, ext) {
    console.log(module.exports.addonPrefix + chalk.hex("#03fceb").bold(`[${path.basename(file, ext)}]`) + ` has been loaded!`)
  },
  //The install function was made by the corebot staff team all the credit goes to them
  install: async function (modules) {
    return new Promise(async (resolve, reject) => {
      if (process.argv.slice(2).map(a => a.toLowerCase()).includes("--no-install")) resolve();
      else {
        const showInfo = process.argv.slice(2).map(a => a.toLowerCase()).includes("--show-install-output");

        const { spawn } = require('child_process');

        const npmCmd = process.platform == "win32" ? 'npm.cmd' : 'npm';

        const info = "[90m>[39m          [INFO]";

        const missingModules = modules.filter(module => {
          try {
            require.resolve(module);
            return;
          } catch (err) {
            return true;
          }
        });

        if (missingModules.length == 0) {
          resolve();
        } else {
          for (let i = 0; i < missingModules.length; i++) {
            const module = missingModules[i];

            console.log(info, `Installing module ${i + 1}/${missingModules.length} (${module})`);

            await new Promise(resolve => {
              const install = spawn(npmCmd, ['i', module]);

              install.stdout.on('data', (data) => {
                if (showInfo) console.log(data.toString().trim())
              })

              install.stderr.on('data', (data) => {
                if (showInfo) console.log("\u001b[31m" + data.toString().trim());
              })

              install.on('exit', () => {
                console.log(info, `Finished installing module ${i + 1}/${missingModules.length} (${((i + 1) / missingModules.length * 100).toFixed(2)}% done)`);
                resolve();
              })
            })
          }
          resolve();
        }
      }
    })
  },
  setupDatabase: async function (name) {
    return new Promise(async (resolve, reject) => {
      try {
        const SqlDatabase = require('better-sqlite3');
        const db = new SqlDatabase('59LAddons.db');

        resolve(db);
      } catch (err) {
        reject(err);
      }
    })
  },
  createProgressBar: async function (value, maxvalue, size) {
    try {
      const percent = value / maxvalue
      const progress = Math.round((size * percent)) > size ? size : Math.round((size * percent))
      const emptyProgress = size - progress < 0
      const progressText = '■'.repeat(progress)
      const emptyText = '□'.repeat(emptyProgress)
      const percentageText = Math.round(percent * 100)
      return `${progressText + emptyText} ${percentageText}%`
    } catch (error) {
      return `Invalid Parameters`
    }
  }
}