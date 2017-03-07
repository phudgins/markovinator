# Markovinator

Basic text generator built on markov chains

## Installation
```
$ npm install --save markovinator
```

## Usage
```
var Markovinator = require('markovinator');
var markov = new Markovinator('./data/markov.json');

markov.train('The quick fox jumped over the lazy dog');

console.log(markov.createText(3));
```
