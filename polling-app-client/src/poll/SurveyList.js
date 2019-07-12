import React, { Component } from "react";
import { getAllSurveys, getUserCreatedPolls } from "../util/APIUtils";
import Survey from "./Survey";
import LoadingIndicator from "../common/LoadingIndicator";
import { Button, Icon, notification } from "antd";
import { POLL_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "./PollList.css";

class SurveyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveys: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      isLoading: false
    };
    this.loadSurveyList = this.loadSurveyList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  loadSurveyList(page = 0, size = POLL_LIST_SIZE) {
    let promise;
    if (this.props.username) {
      if (this.props.type === "USER_CREATED_POLLS") {
        promise = getUserCreatedPolls(this.props.username, page, size);
      } /*else if (this.props.type === "USER_VOTED_POLLS") {
        promise = getUserVotedPolls(this.props.username, page, size);
      }*/
    } else {
      promise = getAllSurveys(page, size);
    }

    if (!promise) {
      return;
    }
    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        const surveys = this.state.surveys.slice();

        this.setState({
          surveys: surveys.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.loadSurveyList();
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setState({
        surveys: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        isLoading: false
      });
      this.loadSurveyList();
    }
  }

  handleLoadMore() {
    this.loadSurveyList(this.state.page + 1);
  }

  render() {
    console.log("render test 1");
    const surveyViews = [];
    this.state.surveys.forEach((survey, surveyIndex) => {
      surveyViews.push(<Survey key={survey.id} survey={survey} />);
    });
    console.log("render test 2");
    return (
      <div className="polls-container">
        {surveyViews}
        {!this.state.isLoading && this.state.surveys.length === 0 ? (
          <div className="no-polls-found">
            <span>No Surveys Found.</span>
          </div>
        ) : null}
        {!this.state.isLoading && !this.state.last ? (
          <div className="load-more-polls">
            <Button
              type="dashed"
              onClick={this.handleLoadMore}
              disabled={this.state.isLoading}
            >
              <Icon type="plus" /> Load more
            </Button>
          </div>
        ) : null}
        {this.state.isLoading ? <LoadingIndicator /> : null}
      </div>
    );
  }
}
/*
function Survey(props) {
  return <Survey />;
}*/

export default withRouter(SurveyList);
