import React from 'react';

import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import YoutubePlayer from './Youtube.Player';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const wrapper = mount(
    <MemoryRouter initialEntries={['/youtube/MBiQVjt7Rjc']}>
      <Router>
        <YoutubePlayer
          match={{ params: { videoId: 1 }, isExact: true, path: '', url: '' }}
        />
      </Router>
    </MemoryRouter>,
    div
  );

  expect(wrapper).toBeDefined();
});
