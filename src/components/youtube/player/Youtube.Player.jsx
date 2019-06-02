/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Youtube.Player.scss";
import { YoutubeService } from "../../../services/youtube/Youtube";

const service = new YoutubeService();

class YoutubePlayer extends Component {
  constructor(props) {
    super(props);

    let videoId = props.match.params.videoId;

    service
      .checkVideoExists(videoId)
      .then(data => {
        if (data.items.length == 0) {
          props.history.push("/youtube");
        }
      })
      .catch(err => props.history.push("/youtube"));

    this.state = {};
 
    const iframe =
      '<iframe title="Video"' +
      '        width="100%"' +
      '        height="100%"' +
      "        src=https://www.youtube.com/embed/" +
      videoId +
      "?autoplay=1" +
      '        frameBorder="0"' +
      "        allowFullScreen/>";
    setTimeout(() => {
      if (document.getElementsByClassName("frame-block")[0]) {
        document.getElementsByClassName("frame-block")[0].innerHTML = iframe;
      }
    }, 1000);
  }

  render() {
    return (
      <div className="video-container">
        <div className="frame-block" />
        <div className="controls">
          <Link className="btn btn-primary" to="/youtube">
            {" "}
            &#60; Back to Trends
          </Link>
        </div>
      </div>
    );
  }
}

YoutubePlayer.propTypes = {
  match: PropTypes.object
};

export default YoutubePlayer;
