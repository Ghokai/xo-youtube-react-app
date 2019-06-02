/* eslint-disable */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import MovieIcon from "@material-ui/icons/Movie";
import AvTimerIcon from "@material-ui/icons/AvTimer";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FavoriteIcon from "@material-ui/icons/Favorite";
import WarningIcon from "@material-ui/icons/Warning";

import PropTypes from "prop-types";

import { YoutubeService } from "../../services/youtube/Youtube";
import "./Youtube.scss";

const service = new YoutubeService();

class Youtube extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trends: [],
      isError: false,
      nextPageToken: "",
      pageSize: 25,
      isLoading: false
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  onScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 60
    ) {
      let maxVids = this.props.config.getMaxVideos();

      if (this.state.trends.length < maxVids && !this.state.isLoading) {
        this.loadVideos(this.state.nextPageToken);
      }
    }
  };

  componentWillMount() {
    this.props.setTitle("YOUTUBE");
    this.props.onChanges(() => {
      window.scrollTo(0, 0);
      this.setState({ trends: [] });
      this.loadVideos("");
    });
  }

  async loadVideos(pageToken = "") {
    this.setState({ isLoading: true });

    let loadedVideoCount = 0;
    loadedVideoCount = this.props.config.getMaxVideos();

    if (pageToken !== "" && this.state.trends) {
      loadedVideoCount = loadedVideoCount - this.state.trends.length;
    }

    loadedVideoCount =
      loadedVideoCount > this.state.pageSize
        ? this.state.pageSize
        : loadedVideoCount;

    service
      .getTrendingVideos(loadedVideoCount, pageToken)
      .then(data => {
        if (pageToken !== "") {
          this.setState({
            trends: [...this.state.trends, ...data.videos],
            nextPageToken: data.nextPageToken,
            isError: false,
            isLoading: false
          });
        } else {
          this.setState({
            trends: data.videos,
            nextPageToken: data.nextPageToken,
            isError: false,
            isLoading: false
          });
        }
      })
      .catch(err => {
        this.setState({ isError: true });
        console.log(err);
      });
  }

  openVideo = id => {
    this.props.history.push("/youtube/" + id);
  };

  youtubeCard() {
    return this.state.trends.map((videos, index) => (
      <div key={index} className="card-container">
        <div className="card" onClick={() => this.openVideo(videos.id)}>
          <div className="img-container">
            <img src={videos.thumbnail} alt={videos.title} />
            <MovieIcon />
          </div>
          <div className="video-statistic">
            <div className="publishedAt">
              <AvTimerIcon />
              <span>{videos.publishedAt}</span>
            </div>
            <div className="viewCount">
              <VisibilityIcon />
              <span>{videos.viewCount}</span>
            </div>
            <div className="likeCount">
              <FavoriteIcon />
              <span>{videos.likeCount}</span>
            </div>
          </div>
          <p className="video-title text-ellipsis">
            {index + 1}-{videos.title}
          </p>
        </div>
      </div>
    ));
  }

  errorOnPage() {
    return (
      <div className="error-plate">
        <WarningIcon />
        <span>An error occured. Please try again later.</span>
      </div>
    );
  }

  loadingOnPage() {
    return (
      <div className="error-plate">
        <WarningIcon />
        <span>Loading please wait...</span>
      </div>
    );
  }

  noItemOnPage() {
    return (
      <div className="error-plate">
        <WarningIcon />
        <span>No videos found to show :(</span>
      </div>
    );
  }

  render() {
    if (
      this.state.isLoading &&
      (!this.state.trends || this.state.trends.length === 0)
    ) {
      return this.loadingOnPage();
    }
    if (this.state.isError) {
      return this.errorOnPage();
    }

    if (!this.state.trends || this.state.trends.length === 0) {
      return this.noItemOnPage();
    }

    return (
      <div id="youtube">
        <div className="row">{this.youtubeCard()}</div>
      </div>
    );
  }
}

Youtube.propTypes = {
  setTitle: PropTypes.func,
  config: PropTypes.object,
  onChanges: PropTypes.func
};

export default withRouter(Youtube);
