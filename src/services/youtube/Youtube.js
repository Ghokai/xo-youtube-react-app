import axios from 'axios';
import { appConfig } from '../../config';
import { VideoClass } from '../../models/video.class';

//const axios = Axios.create({
//  baseURL: appConfig.getYoutubeEndPoint('videos')
//});

export class YoutubeService {
  getTrendingVideos(videosPerPage, nextPageToken = '') {
    const params = {
      part: appConfig.partsToLoad,
      chart: appConfig.chart,
      videoCategoryId: appConfig.getCategoryId(),
      regionCode: appConfig.getRegion(),
      maxResults: videosPerPage,
      key: appConfig.youtubeApiKey
    };

    if (nextPageToken.length > 0) {
      params.pageToken = nextPageToken;
    }

    const url = appConfig.getYoutubeEndPoint('videos');

    return axios
      .get(url, { params })
      .then(res => {
        let videos = res.data.items
          .map(item => new VideoClass(item))
          .filter(item => item.id !== '');

        var response = { videos, nextPageToken: res.data.nextPageToken };
        //  alert(response);
        return response;
      })
      .catch(err => err);
  }

  getCategoryList() {
    const params = {
      key: appConfig.youtubeApiKey,
      part: 'snippet',
      regionCode: appConfig.getRegion()
    };

    const url = appConfig.getYoutubeEndPoint('videoCategories');
    return axios
      .get(url, {
        params
      })
      .then(res => {
        return res.data.items.map(category => ({
          id: category.id,
          name: category.snippet.title
        }));
      })
      .catch(err => err);
  }

  checkVideoExists(videoId) {
    const params = {
      key: appConfig.youtubeApiKey,
      part: 'id',
      id: videoId
    };

    const url = appConfig.getYoutubeEndPoint('videos');

    return axios
      .get(url, {
        params
      })
      .then(res => {
        return res.data;
      })
      .catch(err => err);
  }
}
