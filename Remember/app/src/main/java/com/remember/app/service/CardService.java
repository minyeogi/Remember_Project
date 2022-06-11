package com.remember.app.service;

import java.util.List;

import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.Group;
import com.remember.app.entity.card.GroupCard;
import com.remember.app.entity.card.GroupSummary;
import com.remember.app.requestDto.CardInsertReqDto;
import com.remember.app.requestDto.CardUpdateReqDto;
import com.remember.app.responseDto.GroupRespDto;


public interface CardService {
	public Card getCard(int user_id);
	public int insertNewCard(CardInsertReqDto cardInsertReqDto);
	public int insertGroup(int user_id, String group_name);
	public int deleteCard(int user_id);
	public int updateCard(CardUpdateReqDto cardUpdateReqDto);
	public List<GroupSummary> getGroups(int user_id);
	public GroupRespDto getGroupId(int group_id);
	public int updateGroupCard(Group group);
	public int deleteGroupCard(Group group);
	public Card get(int cardId);
	public int addUserMyGroup(int cardId);
}