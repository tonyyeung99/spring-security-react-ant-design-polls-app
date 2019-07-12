import React, { Component } from "react";
import "./Poll.css";
import { Avatar, Icon } from "antd";
import { Link } from "react-router-dom";
import { getAvatarColor } from "../util/Colors";
import { formatDateTime } from "../util/Helpers";

import { Radio, Button } from "antd";
const RadioGroup = Radio.Group;

class Survey extends Component {
  getTimeRemaining = survey => {
    const expirationTime = new Date(survey.expirationDateTime).getTime();
    const currentTime = new Date().getTime();

    var difference_ms = expirationTime - currentTime;
    var seconds = Math.floor((difference_ms / 1000) % 60);
    var minutes = Math.floor((difference_ms / 1000 / 60) % 60);
    var hours = Math.floor((difference_ms / (1000 * 60 * 60)) % 24);
    var days = Math.floor(difference_ms / (1000 * 60 * 60 * 24));

    let timeRemaining;

    if (days > 0) {
      timeRemaining = days + " days left";
    } else if (hours > 0) {
      timeRemaining = hours + " hours left";
    } else if (minutes > 0) {
      timeRemaining = minutes + " minutes left";
    } else if (seconds > 0) {
      timeRemaining = seconds + " seconds left";
    } else {
      timeRemaining = "less than a second left";
    }

    return timeRemaining;
  };

  render() {
    return (
      <div className="poll-content">
        <div className="poll-header">
          <div className="poll-creator-info">
            <Link
              className="creator-link"
              to={`/users/${this.props.survey.createdBy.username}`}
            >
              <Avatar
                className="poll-creator-avatar"
                style={{
                  backgroundColor: getAvatarColor(
                    this.props.survey.createdBy.name
                  )
                }}
              >
                {this.props.survey.createdBy.name[0].toUpperCase()}
              </Avatar>
              <span className="poll-creator-name">
                {this.props.survey.createdBy.name}
              </span>
              <span className="poll-creator-username">
                @{this.props.survey.createdBy.username}
              </span>
              <span className="poll-creation-date">
                {formatDateTime(this.props.survey.creationDateTime)}
              </span>
            </Link>
          </div>
          <div className="poll-question">
            Number of questions : {this.props.survey.numQuestion}
          </div>
        </div>

        <div className="poll-footer">
          <span className="separator">•</span>
          <span className="time-left">
            {this.props.survey.expired
              ? "Final results"
              : this.getTimeRemaining(this.props.survey)}
          </span>
        </div>
      </div>
    );
  }
}

export default Survey;
