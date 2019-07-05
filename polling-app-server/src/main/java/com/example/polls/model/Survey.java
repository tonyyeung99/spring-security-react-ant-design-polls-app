package com.example.polls.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.example.polls.model.audit.UserDateAudit;

@Entity
@Table(name = "survey")
public class Survey extends UserDateAudit {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	private Instant expirationDateTime;
	/*
	 * @ManyToMany
	 * 
	 * @JoinTable(name = "contain_polls", joinColumns = @JoinColumn(name =
	 * "survey_id"), inverseJoinColumns = @JoinColumn(name = "polls_id")) private
	 * Set<Poll> containPolls;
	 */

	@ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinTable(name = "contain_polls", joinColumns = @JoinColumn(name = "survey_id"), inverseJoinColumns = @JoinColumn(name = "polls_id"))
	private List<Poll> containPolls = new ArrayList<Poll>();

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Instant getExpirationDateTime() {
		return expirationDateTime;
	}

	public void setExpirationDateTime(Instant expirationDateTime) {
		this.expirationDateTime = expirationDateTime;
	}

	public List<Poll> getContainPolls() {
		return containPolls;
	}

	public void setContainPolls(List<Poll> containPolls) {
		this.containPolls = containPolls;
	}

	public void removeContainPools(Poll poll) {
		this.containPolls.remove(poll);
	}

	public void addContainPolls(Poll poll) {
		this.containPolls.add(poll);
	}

}
