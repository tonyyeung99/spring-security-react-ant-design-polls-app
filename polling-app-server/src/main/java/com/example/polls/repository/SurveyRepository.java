package com.example.polls.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.polls.model.Survey;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
	Optional<Survey> findById(Long surveyId);

	Page<Survey> findByCreatedBy(Long userId, Pageable pageable);

	long countByCreatedBy(Long userId);

	List<Survey> findByIdIn(List<Long> surveyIds);

	List<Survey> findByIdIn(List<Long> surveyIds, Sort sort);
}
