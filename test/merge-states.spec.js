import sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mergeStates } from '../lib';

chai.use(sinonChai);

describe('mergeStates', () => {
  it('is exported properly', () => {
    expect(mergeStates).to.be.a('function');
  });

  it('throws an error if the inner reducer is not an object', () => {
    expect(() => mergeStates()).to.throw('not a reducer');
    expect(() => mergeStates(null)).to.throw('not a reducer');
    expect(() => mergeStates(1)).to.throw('not a reducer');
    expect(() => mergeStates(new Date())).to.throw('not a reducer');
    expect(() => mergeStates({})).to.throw('not a reducer');
  });

  it('does not throw if the inner reducer is a function', () => {
    expect(() => mergeStates(() => {})).to.not.throw;
  });

  it('throws an error if the supplied state is not an object', () => {
    const reducer = mergeStates(() => {});
    expect(() => reducer()).to.throw('"mergeStates" only works with plain object states');
    expect(() => reducer(null)).to.throw('"mergeStates" only works with plain object states');
    expect(() => reducer(1)).to.throw('"mergeStates" only works with plain object states');
    expect(() => reducer(() => {})).to.throw('"mergeStates" only works with plain object states');
    expect(() => reducer(new Date())).to.throw('"mergeStates" only works with plain object states');
  });

  it('does not throw errors it the state is an object', () => {
    const reducer = mergeStates(() => {});
    expect(() => reducer({})).to.not.throw('"mergeStates" only works with plain object states');
  });

  it('calls the inner reducer', () => {
    const innerReducer = sinon.stub().returns({});
    const reducer = mergeStates(innerReducer);
    reducer({});
    expect(innerReducer).to.have.been.calledOnce;
  });

  it('merges the states', () => {
    const innerReducer = () => ({ test1: 'reducer' });
    const state = { test1: 'state', test2: 'state' };
    const reducer = mergeStates(innerReducer);
    expect(reducer(state)).to.eql({ test1: 'reducer', test2: 'state' });
  });
});
