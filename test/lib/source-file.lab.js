'use strict';

const _ = require('lodash');
const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const sinon = require('sinon');

const fs = require('fs');
const underTest = require('../../lib/source-file');

lab.suite('lib/source-file', () => {

  lab.beforeEach((done) => {
    sinon.stub(fs, 'mkdirSync');
    sinon.stub(fs, 'lstatSync');
    sinon.stub(fs, 'existsSync');
    sinon.stub(fs, 'writeFileSync');
    sinon.stub(fs, 'readFileSync');
    done();
  });

  lab.afterEach((done) => {
    fs.mkdirSync.restore();
    fs.lstatSync.restore();
    fs.existsSync.restore();
    fs.writeFileSync.restore();
    fs.readFileSync.restore();
    done();
  });

  lab.suite('constructor', () => {

    it('checks if directory exists', (done) => {
      fs.lstatSync.returns(true);
      fs.existsSync.returns(true);
      let sourceFile = new underTest('./data/markov.json');
      expect(fs.lstatSync.calledWith('./data')).to.be.true();
      done();
    });

    it('creates directory if directory does not exist', (done) => {
      fs.lstatSync.throws();
      fs.mkdirSync.returns(true);
      fs.existsSync.returns(true);
      let sourceFile = new underTest('./data/markov.json');
      expect(fs.mkdirSync.calledWith('./data')).to.be.true();
      done();
    });

    it('checks if file exists', (done) => {
      fs.lstatSync.returns(true);
      fs.existsSync.returns(true);
      let sourceFile = new underTest('./data/markov.json');
      expect(fs.existsSync.calledWith('./data/markov.json')).to.be.true();
      done();
    });

    it('creates file if file does not exist', (done) => {
      let expectedArg = JSON.stringify({
        terminals: {},
        startWords: [],
        model: {}
      });
      fs.lstatSync.returns(true);
      fs.existsSync.returns(false);
      let sourceFile = new underTest('./data/markov.json');
      expect(fs.writeFileSync.calledWith('./data/markov.json', expectedArg)).to.be.true();
      done();
    });

    it('sets datafilepath', (done) => {
      fs.lstatSync.returns(true);
      fs.existsSync.returns(true);
      let sourceFile = new underTest('./data/markov.json');
      expect(sourceFile.datafilepath).to.equal('./data/markov.json');
      done();
    });

    it('sets default datafilepath if not provided', (done) => {
      fs.lstatSync.returns(true);
      fs.existsSync.returns(true);
      let sourceFile = new underTest();
      expect(sourceFile.datafilepath).to.equal('./markov.json');
      done();
    });

  });

  lab.suite('read', () => {

    it('reads from datafilepath', (done) => {
      let returnedData = JSON.stringify({
        terminals: {},
        startWords: [],
        model: {}
      });
      fs.lstatSync.returns(true);
      fs.existsSync.returns(true);
      fs.readFileSync.returns(returnedData);
      let sourceFile = new underTest();
      expect(sourceFile.read()).to.deep.equal(JSON.parse(returnedData));
      done();
    });

  });

  lab.suite('write', () => {

    it('writes to datafilepath', (done) => {
      let data = {
        terminals: {},
        startWords: [],
        model: {}
      };
      let expectedArg = JSON.stringify(data);
      fs.lstatSync.returns(true);
      fs.existsSync.returns(true);
      fs.writeFileSync.returns(true);
      let sourceFile = new underTest();
      sourceFile.write(data);
      expect(fs.writeFileSync.calledWith(sourceFile.datafilepath, expectedArg)).to.be.true();
      done();
    });

  });

});
