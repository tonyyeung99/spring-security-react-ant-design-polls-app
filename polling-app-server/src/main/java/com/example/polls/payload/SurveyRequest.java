package com.example.polls.payload;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class SurveyRequest {

    @NotNull
    @Valid
    private List<PollRequest> polls;

    @NotNull
    @Valid
    private PollLength surveyLength;

	public PollLength getSurveyLength() {
		return surveyLength;
	}

	public void setSurveyLength(PollLength surveyLength) {
		this.surveyLength = surveyLength;
	}

	public List<PollRequest> getPolls() {
		return polls;
	}

	public void setPolls(List<PollRequest> polls) {
		this.polls = polls;
	}
	
	
}
