'use strict';

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const SourceFile = require('./source-file');

class Markovinator {

  /**
   * constructor
   * @param {String} dataPath location to save markov data
   */
  constructor (dataPath) {
    this.sourceFile = new SourceFile(dataPath);
    let data = this.sourceFile.read();
    this.terminals = data.terminals;
    this.startWords = data.startWords;
    this.model = data.model;
  }

  /**
   * train
   * Add to the Markovinator's vocabulary
   * @param {String} line a line of text to add to the markov model
   */
  train (line) {
    let words = line.split(/\s+/);
    this.terminals[_.last(words)] = true;
    this.startWords.push(_.head(words));
    _.each(words, (word, index) => {
      let nextWord = words[index + 1] || '';
      if (this.model[word]) {
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
  }

  /**
   * createText
   * Returns a string from the markov model
   * @param {Number} minLength The minimum number of words for a valid response
   */
  createText (minLength) {
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
  }

};

module.exports = Markovinator;
