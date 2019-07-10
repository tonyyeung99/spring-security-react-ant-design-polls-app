import React, { Component } from "react";
import { createPoll, createSurvey } from "../util/APIUtils";
import {
  MAX_CHOICES,
  POLL_QUESTION_MAX_LENGTH,
  POLL_CHOICE_MAX_LENGTH
} from "../constants";
import "./NewPoll.css";
import {
  Form,
  Input,
  Button,
  Icon,
  Select,
  Col,
  notification,
  Card
} from "antd";
import { tuple } from "antd/lib/_util/type";
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

class NewSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      polls: [
        {
          question: {
            text: ""
          },
          choices: [
            {
              text: ""
            },
            {
              text: ""
            }
          ]
        },
        {
          question: {
            text: ""
          },
          choices: [
            {
              text: ""
            },
            {
              text: ""
            }
          ]
        }
      ],
      pollLength: {
        days: 1,
        hours: 0
      }
    };

    this.addChoice = this.addChoice.bind(this);
    this.removeChoice = this.removeChoice.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleChoiceChange = this.handleChoiceChange.bind(this);
    this.handlePollDaysChange = this.handlePollDaysChange.bind(this);
    this.handlePollHoursChange = this.handlePollHoursChange.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  addChoice(event, pollNumber) {
    this.setState({
      polls: this.state.polls.map((poll, index) => {
        if (index === pollNumber) {
          poll.choices = poll.choices.concat([
            {
              text: ""
            }
          ]);
          return poll;
        } else return poll;
      })
    });
  }

  removeChoice(pollNumber, choiceNumber) {
    this.setState({
      polls: this.state.polls.map((poll, index) => {
        if (index === pollNumber) {
          poll.choices = [
            ...poll.choices.slice(0, choiceNumber),
            ...poll.choices.slice(choiceNumber + 1)
          ];
        }
        return poll;
      })
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const surveyData = {
      /*
      question: this.state.question.text,
      choices: this.state.choices.map(choice => {
        return { text: choice.text };
      }),*/
      polls: this.state.polls.map((poll, index) => {
        const newPoll = {
          question: poll.question.text,
          choices: poll.choices.map(choice => {
            const newChoice = { text: choice.text };
            return newChoice;
          }),
          pollLength: this.state.pollLength
        };
        return newPoll;
      }),
      surveyLength: this.state.pollLength
    };
    console.log("pollData = " + JSON.stringify(surveyData));

    createSurvey(surveyData)
      .then(response => {
        this.props.history.push("/");
      })
      .catch(error => {
        if (error.status === 401) {
          this.props.handleLogout(
            "/login",
            "error",
            "You have been logged out. Please login create poll."
          );
        } else {
          notification.error({
            message: "Polling App",
            description:
              error.message || "Sorry! Something went wrong. Please try again!"
          });
        }
      });
  }

  validateQuestion = questionText => {
    if (questionText.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please enter your question!"
      };
    } else if (questionText.length > POLL_QUESTION_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Question is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  handleQuestionChange(event, pollNumber) {
    const value = event.target.value;
    this.setState({
      polls: this.state.polls.map((poll, index) => {
        if (index === pollNumber) {
          poll.question = { text: value, ...this.validateQuestion(value) };
        }
        return poll;
      })
    });
  }

  validateChoice = choiceText => {
    if (choiceText.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please enter a choice!"
      };
    } else if (choiceText.length > POLL_CHOICE_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Choice is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  handleChoiceChange(event, pollNumber, choiceNumber) {
    const value = event.target.value;
    this.setState({
      polls: this.state.polls.map((poll, index) => {
        if (index === pollNumber) {
          poll.choices[choiceNumber] = {
            text: value,
            ...this.validateChoice(value)
          };
        }
        return poll;
      })
    });
  }

  handlePollDaysChange(value) {
    const pollLength = Object.assign(this.state.pollLength, { days: value });
    this.setState({
      pollLength: pollLength
    });
  }

  handlePollHoursChange(value) {
    const pollLength = Object.assign(this.state.pollLength, { hours: value });
    this.setState({
      pollLength: pollLength
    });
  }

  isFormInvalid() {
    for (let i = 0; i < this.state.polls.length; i++) {
      const poll = this.state.polls[i];
      console.log("isFormInvalid i =" + i);
      if (poll.question.validateStatus !== "success") {
        console.log("validateStatus=not success");
        return true;
      }
      for (let j = 0; j < poll.choices.length; j++) {
        const choice = poll.choices[j];
        if (choice.validateStatus !== "success") {
          return true;
        }
      }
    }
    return false;
  }

  render() {
    const pollViews = [];
    this.state.polls.forEach((poll, index) => {
      pollViews.push(
        <PollItem
          key={index}
          poll={poll}
          pollNumber={index}
          addChoice={this.addChoice}
          removeChoice={this.removeChoice}
          handleChoiceChange={this.handleChoiceChange}
          handleQuestionChange={this.handleQuestionChange}
        />
      );
    });
    return (
      <div className="new-poll-container">
        <h1 className="page-title">Create Survey</h1>
        <div className="new-poll-content">
          <Form onSubmit={this.handleSubmit} className="create-poll-form">
            {pollViews}
            <FormItem className="poll-form-row">
              <Col xs={24} sm={4}>
                Poll length:
              </Col>
              <Col xs={24} sm={20}>
                <span style={{ marginRight: "18px" }}>
                  <Select
                    name="days"
                    defaultValue="1"
                    onChange={this.handlePollDaysChange}
                    value={this.state.pollLength.days}
                    style={{ width: 60 }}
                  >
                    {Array.from(Array(8).keys()).map(i => (
                      <Option key={i}>{i}</Option>
                    ))}
                  </Select>{" "}
                  &nbsp;Days
                </span>
                <span>
                  <Select
                    name="hours"
                    defaultValue="0"
                    onChange={this.handlePollHoursChange}
                    value={this.state.pollLength.hours}
                    style={{ width: 60 }}
                  >
                    {Array.from(Array(24).keys()).map(i => (
                      <Option key={i}>{i}</Option>
                    ))}
                  </Select>{" "}
                  &nbsp;Hours
                </span>
              </Col>
            </FormItem>
            <FormItem className="poll-form-row">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                disabled={this.isFormInvalid()}
                className="create-poll-form-button"
              >
                Create Survey
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

function PollItem(props) {
  const choiceViews = [];
  props.poll.choices.forEach((choice, index) => {
    choiceViews.push(
      <PollChoice
        key={index}
        choice={choice}
        choiceNumber={index}
        pollNumber={props.pollNumber}
        addChoice={props.addChoice}
        removeChoice={props.removeChoice}
        handleChoiceChange={props.handleChoiceChange}
        handleQuestionChange={props.handleQuestionChange}
      />
    );
  });

  return (
    <div>
      <FormItem
        validateStatus={props.poll.question.validateStatus}
        help={props.poll.question.errorMsg}
        className="poll-form-row"
      >
        <TextArea
          placeholder="Enter your question"
          style={{ fontSize: "16px" }}
          autosize={{ minRows: 3, maxRows: 6 }}
          name="question"
          value={props.poll.question.text}
          onChange={event =>
            props.handleQuestionChange(event, props.pollNumber)
          }
        />
      </FormItem>
      {choiceViews}
      <FormItem className="poll-form-row">
        <Button
          type="dashed"
          onClick={event => props.addChoice(event, props.pollNumber)}
          disabled={props.poll.choices.length === MAX_CHOICES}
        >
          <Icon type="plus" /> Add a choice
        </Button>
      </FormItem>
    </div>
  );
}
function PollChoice(props) {
  return (
    <FormItem
      validateStatus={props.choice.validateStatus}
      help={props.choice.errorMsg}
      className="poll-form-row"
    >
      <Input
        placeholder={"Choice " + (props.choiceNumber + 1)}
        size="large"
        value={props.choice.text}
        className={props.choiceNumber > 1 ? "optional-choice" : null}
        onChange={event =>
          props.handleChoiceChange(event, props.pollNumber, props.choiceNumber)
        }
      />

      {props.choiceNumber > 1 ? (
        <Icon
          className="dynamic-delete-button"
          type="close"
          disabled={props.choiceNumber <= 1}
          onClick={() =>
            props.removeChoice(props.pollNumber, props.choiceNumber)
          }
        />
      ) : null}
    </FormItem>
  );
}

export default NewSurvey;
