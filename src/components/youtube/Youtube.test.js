import React from 'react';
import ReactDOM from 'react-dom';
import Youtube from './Youtube';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount } from 'enzyme';

const config = {};
let store;
const onChanges = fn => {
  if (fn) {
    store = fn;
  }

  store();
};
let titleStore = '';
const setTitle = title => {
  if (title) {
    titleStore = title;
  }
  return titleStore;
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter initialEntries={['/youtube/']}>
      <Route>
        <Youtube config={config} onChanges={onChanges} setTitle={setTitle} />
      </Route>
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('mount without crashing', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={['/youtube/']}>
      <Route>
        <Youtube config={config} onChanges={onChanges} setTitle={setTitle} />
      </Route>
    </MemoryRouter>
  );

  expect(wrapper).toBeDefined();
});
