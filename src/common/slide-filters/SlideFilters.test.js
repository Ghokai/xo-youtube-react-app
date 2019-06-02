import React from 'react';
import ReactDOM from 'react-dom';
import SlideFilters from './SlideFilters';
import { appConfig } from '../../config';

//const config = { maxVideosToLoad: 24 };
let store;
const onChanges = fn => {
  if (fn) {
    store = fn;
  }

  store();
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <SlideFilters config={appConfig} onChanges={onChanges} />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
