import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router>
      <Header />
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('header renders with name', () => {
  jest.useFakeTimers();

  const setTestTitle = () => 'Hello Youtube';
  const wrapper = mount(
    <Router>
      <Header setTitle={() => setTestTitle()} />
    </Router>
  );

  setTimeout(() => {
    expect(wrapper.find('.opened-module-title').text()).toEqual(setTestTitle());
  }, 500);
  jest.runAllTimers();
});
