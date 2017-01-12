'use strict';

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const SourceFiles = require('./source-files');

const Markovinator = function (dataPath) {
  this.sourceFile = new SourceFiles(dataPath);
  let data = this.sourceFile.read();
  this.terminals = data.terminals;
  this.startWords = data.startWords;
  this.model = data.model;
};

Markovinator.prototype.train = function (line) {
  let words = line.split(/\s+/);
  this.terminals[_.last(words)] = true;
  this.startWords.push(_.head(words));
  _.each(words, (word, index) => {
    let nextWord = words[index + 1] || '';
    if (_.has(this.model, word)) {
      this.model[word].push(nextWord);
    } else {
      this.model[word] = [nextWord];
    }
  });
  this.sourceFile.write({
    terminals: this.terminals,
    startWords: this.startWords,
    model: this.model
  });
};

Markovinator.prototype.createText = function (minLength) {
  let word = _.sample(this.startWords);
  let text = [word];
  while (_.has(this.model, word)) {
    let nextWords = this.model[word];
    word = _.sample(nextWords);
    text.push(word);
    if (text.length > minLength && this.terminals[word]) {
      break;
    }
  }
  if (text.length < minLength) {
    return this.createText(minLength);
  }
  return text.join(' ').trim();
};

module.exports = Markovinator;
