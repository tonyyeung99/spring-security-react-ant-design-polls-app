import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from "../constants";

const request = options => {
  const headers = new Headers({
    "Content-Type": "application/json"
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function getAllPolls(page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
    method: "GET"
  });
}

export function createPoll(pollData) {
  return request({
    url: API_BASE_URL + "/polls",
    method: "POST",
    body: JSON.stringify(pollData)
  });
}

export function getAllSurveys(page, size) {
  console.log("getAllSurveys Test 1");

  page = page || 0;
  size = size || POLL_LIST_SIZE;

  const json = {
    content: [
      {
        id: 17,
        numQuestion: 2,
        createdBy: { id: 3, username: "user_b", name: "user b" },
        creationDateTime: "2019-07-09T05:01:05Z",
        expirationDateTime: "2019-07-10T05:01:05Z",
        totalVotes: 0,
        expired: true
      },
      {
        id: 18,
        numQuestion: 3,
        createdBy: { id: 3, username: "user_b", name: "user b" },
        creationDateTime: "2019-07-09T05:01:05Z",
        expirationDateTime: "2019-07-10T05:01:05Z",
        totalVotes: 0,
        expired: true
      },
      {
        id: 13,
        numQuestion: 4,
        createdBy: { id: 3, username: "user_b", name: "user b" },
        creationDateTime: "2019-07-04T09:15:59Z",
        expirationDateTime: "2019-07-07T12:15:59Z",
        totalVotes: 0,
        expired: true
      }
    ],
    page: 0,
    size: 30,
    totalElements: 18,
    totalPages: 1,
    last: true
  };

  let promise = new Promise(function(resolve, reject) {
    resolve(json);
  });
  return promise;
}
export function createSurvey(surveyData) {
  return request({
    url: API_BASE_URL + "/polls/survey",
    method: "POST",
    body: JSON.stringify(surveyData)
  });
}

export function castVote(voteData) {
  return request({
    url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
    method: "POST",
    body: JSON.stringify(voteData)
  });
}

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/signin",
    method: "POST",
    body: JSON.stringify(loginRequest)
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: "POST",
    body: JSON.stringify(signupRequest)
  });
}

export function checkUsernameAvailability(username) {
  return request({
    url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
    method: "GET"
  });
}

export function checkEmailAvailability(email) {
  return request({
    url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
    method: "GET"
  });
}

export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/user/me",
    method: "GET"
  });
}

export function getUserProfile(username) {
  return request({
    url: API_BASE_URL + "/users/" + username,
    method: "GET"
  });
}

export function getUserCreatedPolls(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/polls?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function getUserVotedPolls(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/votes?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}
