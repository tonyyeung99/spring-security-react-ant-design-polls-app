package com.example.polls;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;
import org.springframework.test.context.junit4.SpringRunner;

import com.example.polls.model.Choice;
import com.example.polls.model.Poll;
import com.example.polls.model.Survey;
import com.example.polls.payload.ChoiceRequest;
import com.example.polls.payload.PollLength;
import com.example.polls.payload.PollRequest;
import com.example.polls.payload.SurveyRequest;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.SurveyRepository;
import com.example.polls.service.PollService;

@RunWith(SpringRunner.class)
@DataJpaTest
@EntityScan(basePackageClasses = {
		Jsr310JpaConverters.class
})
public class PollsJPATests {

    @Autowired
    private TestEntityManager entityManager;
 
    @Autowired
    private PollRepository pollRepository;
    
    @Autowired
    private SurveyRepository surveyRepository;
    
    @Autowired
    private PollService pollService;
    
	@Test
	public void contextLoads() {
		System.out.println("*** Test 2 ***");
	}
	
	public void whenFindById_thenReturnPoll() {
		Choice choice1 = new Choice();
		choice1.setText("Choice A");
		Choice choice2 = new Choice();
		choice2.setText("Choice B");
		
		Poll poll = new Poll();
		poll.getChoices().add(choice1);
		poll.getChoices().add(choice2);
		poll.setQuestion("Question 1");
		Instant instant = Instant.now();
		poll.setExpirationDateTime(instant);
				
		choice1.setPoll(poll);
		choice2.setPoll(poll);

	    entityManager.persist(poll);
	    entityManager.flush();
	    
	    System.out.println("Poll Id : " + poll.getId());
	    System.out.println("Poll : " + poll.toString());
	 
	    Optional<Poll> foundPoll = pollRepository.findById(1L);
	    assertEquals(foundPoll.get().getQuestion(), "Question 1");
	    
	    
	    /*
	    // when
	    Employee found = employeeRepository.findByName(alex.getName());
	 
	    // then
	    assertThat(found.getName())
	      .isEqualTo(alex.getName());
	      */
	}
	
	private Poll createPoll(String question) {
		Choice choice1 = new Choice();
		choice1.setText("Choice A");
		Choice choice2 = new Choice();
		choice2.setText("Choice B");
		
		Poll poll = new Poll();
		poll.getChoices().add(choice1);
		poll.getChoices().add(choice2);
		poll.setQuestion(question);
		Instant instant = Instant.now();
		poll.setExpirationDateTime(instant);
				
		choice1.setPoll(poll);
		choice2.setPoll(poll);
		
		return poll;
	}
	
	
	public void persistSurvey() {
		
		Poll poll1 = createPoll("Question 1");
		Poll poll2 = createPoll("Question 2");

	   //entityManager.persist(poll1);
	    //entityManager.flush();
	 
	   // Optional<Poll> foundPoll = pollRepository.findById(1L);
	   // assertEquals(foundPoll.get().getQuestion(), "Question 1");
	    
	    Survey survey = new Survey();
	    survey.setExpirationDateTime(Instant.now());
	    survey.addContainPolls(poll1);
	    survey.addContainPolls(poll2);
		entityManager.persist(survey);
	    entityManager.flush();
	    
	    Optional<Survey> foundSurvey = surveyRepository.findById(1L);
	    List<Poll> polls = foundSurvey.get().getContainPolls();
	    for(Poll poll: polls) {
	    	System.out.println( "Found Poll : " + poll.toString());
	    }	    
	}	
	
	/*
	@Test
	public void whenSurveyRequestReady_thenCreateNewSurveyWithPollService() {
		SurveyRequest reqSurvey = new SurveyRequest();
		PollRequest reqPoll1 = createPollRequest("Poll Request 1", 3, 0);
		PollRequest reqPoll2 = createPollRequest("Poll Request 2", 3, 0);
		reqSurvey.setPolls(new ArrayList<PollRequest>());
		reqSurvey.getPolls().add(reqPoll1);
		reqSurvey.getPolls().add(reqPoll2);
		pollService.createSurvey(reqSurvey);
		
		System.out.println("*** whenSurveyRequestReady_thenCreateNewSurveyWithPollService ***");
	    Optional<Survey> foundSurvey = surveyRepository.findById(1L);
	    List<Poll> polls = foundSurvey.get().getContainPolls();
	    for(Poll poll: polls) {
	    	System.out.println( "Found Poll : " + poll.toString());
	    }
		
	}
	*/
	

	
	private PollRequest createPollRequest(String questionText, int daysLength, int hoursLength) {
		PollRequest poll = new PollRequest();
		poll.setChoices(new ArrayList<ChoiceRequest>());
		poll.setQuestion(questionText);
		poll.getChoices().add(createChoiceRequest("Choice A"));
		poll.getChoices().add(createChoiceRequest("Choice B"));
		poll.setPollLength(createPollLength(daysLength, hoursLength));
		return poll;
	}
	
	private ChoiceRequest createChoiceRequest(String choiceText) {
		ChoiceRequest choice = new ChoiceRequest();
		choice.setText(choiceText);
		return choice;
	}
	
	private PollLength createPollLength(int daysLength, int hoursLength) {
		PollLength pollLength = new PollLength();
		pollLength.setDays(daysLength);
		pollLength.setDays(hoursLength);
		return pollLength;
	}
}
