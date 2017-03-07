'use strict';

const fs = require('fs');
const path = require('path');

const _fileStructure = {
  terminals: {},
  startWords: [],
  model: {}
};

class SourceFile {

  /**
   * constructor
   * @param {String} dataPath location to save data file
   */
  constructor (dataPath) {
    if (!dataPath) {
      dataPath = './markov.json';
    }
    let pathObj = path.parse(dataPath);
    let directory = pathObj.dir || '.';
    let filename = pathObj.base || 'markov.json';
    try {
      fs.lstatSync(directory);
    } catch (e) {
      fs.mkdirSync(directory, parseInt('0755', 8));
    }
    let datafile = path.format({
      dir: directory,
      base: filename
    });
    if (!fs.existsSync(datafile)) {
      fs.writeFileSync(datafile, JSON.stringify(_fileStructure));
    }
    this.datafilepath = datafile;
  }

  /**
   * read
   * returns contents of datafile
   */
  read () {
    let data = JSON.parse(fs.readFileSync(this.datafilepath));
    return data;
  }

  /**
   * write
   * @param {Object} data the data to write to datafile
   */
  write (data) {
    fs.writeFileSync(this.datafilepath, JSON.stringify(data));
    return data;
  }
}

module.exports = SourceFile;
