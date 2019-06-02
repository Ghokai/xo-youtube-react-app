import { YoutubeService } from './Youtube';
import { appConfig } from '../../config';

it('creates without crashing', () => {
  new YoutubeService();
});

it('get Trending Videos', async () => {
  const service = new YoutubeService();
  let videosCount = 19;
  appConfig.saveCategory(10);
  appConfig.saveRegion('US');

  appConfig.saveMaxVideos(videosCount);
  const result = await service.getTrendingVideos(videosCount);
  expect(result.videos.length).toEqual(videosCount);
});

it('get Categories', async () => {
  const service = new YoutubeService();
  appConfig.saveCategory(10);
  appConfig.saveRegion('US');
  appConfig.saveMaxVideos(10);

  const result = await service.getCategoryList();
  expect(result.length).toBeGreaterThan(0);
});
//8LJqoRMyFSo

it('check video id exists', async () => {
  const service = new YoutubeService();
  appConfig.saveCategory(10);
  appConfig.saveRegion('US');
  appConfig.saveMaxVideos(10);

  const videoId = '8LJqoRMyFSo';
  const result = await service.checkVideoExists(videoId);
  expect(result.items.length).toBeGreaterThan(0);
});
