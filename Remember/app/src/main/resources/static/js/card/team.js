const team_members_button = document.querySelector(".menus .members");
const team_manage_button = document.querySelector(".menus .team_manage");
const change_team_button = document.querySelector(".menus .change_team");

const card_book_wrapper = document.querySelector(".menus .card_books");
const add_new_card_book_button = document.querySelector(".menus .add_new_card_book");

const groups = document.querySelector(".menus .groups");
const add_new_group_button = document.querySelector(".menus .add_new_group");
const whole_card_button = document.querySelector("#whole_cards");

const group_wrapper = document.querySelector(".menus .groups");

const card_book_members_button = document.querySelector(".card_book_members_button");
const card_book_settings_button = document.querySelector(".card_book_settings_button");
const main_contents = document.querySelector(".main_contents");

let principal_profile;

let team_list;
let card_book_list;
let group_list;
let card_list;

let selected_team;
let selected_card_book;
let selected_group;
let selected_card;
let selected_card_detail;

let page = 0;

main();

function main() {
	principal_profile =loadPrincipalProfile();
	
	// load team and set team info
	team_list = loadTeam();
	selected_team = pickTeamOrderByCreateDate(team_list);
	setTeamInfo();
	
	// load card book about selected team and set card book list
	card_book_list = loadBookList();
	setCardBookList();

	// load group list about selected card book and set group list
	card_book_wrapper.querySelectorAll(".card_book")[0].click();
	
	// load card list about selected group and page 0 and set card list
	setTimeout(() => {
		whole_card_button.click();
	}, 0);
}

whole_card_button.onclick = () => {
	card_list = loadAllCardList();
	console.log(card_list);
	setCardList();
}

team_members_button.onclick = () => {
	// 본인을 제외한 팀 멤버 검색
	page = 0;
	
	const team_member_list = loadTeamMembers();
	if(team_member_list.length == 1 && team_member_list[0].total_count == 0) {
		const no_member_tag = makeNoMembersTag();
		replaceTagInMainContents(no_member_tag);
		no_member_tag.querySelector(".invite_member").onclick = () => {
			// 링크 생성 및 모달 출력
			console.log("링크 생성 및 모달 출력");
		}
	} else {
		console.log(team_member_list);
	}
}

team_manage_button.onclick = () => {
	const team_manage_tag = makeTeamManageTag();
	replaceTagInMainContents(team_manage_tag);
	
	const show_product_description = document.querySelector("#show_product_description");
	show_product_description.onclick = () => {
		// 상품 상세 페이지 출력
	}
	
	const show_history = document.querySelector("#show_history");
	show_history.onclick = () => {
		// 팀 명함 수 등 상세 페이지 readOnly
		const team_history = makeShowHistoryTag();
		replaceTagInMainContents(team_history);
	}
	
	const manage_payment = document.querySelector("#manage_payment");
	manage_payment.onclick = () => {
		// 결제 수단 및 내역으로 이동가능 한 페이지
		const manage_payment_tag = makeManagePaymentTag();
		replaceTagInMainContents(manage_payment_tag);
		
		const show_my_payment_process = manage_payment_tag.querySelector("#show_my_payment_process");
		show_my_payment_process.onclick = () => {
			// 결제 수단 태그
			const my_payment_process_tag = makeMyPaymentProcess();
			replaceTagInMainContents(my_payment_process_tag);
		}
		
		const show_my_payment_history = manage_payment_tag.querySelector("#show_my_payment_history");
		show_my_payment_history.onclick = () => {
			// 결제 내역 태그
			const my_payment_history_tag = makeMyPaymentHistory();
			replaceTagInMainContents(my_payment_history_tag);
		}
	}
	
	const change_team_name = document.querySelector("#change_team_name");
	change_team_name.onclick = () => {
		// 조직명 변경 모달 출력
		const change_team_name_modal = makeChangeTeamNameModal();
		appendModalToContainer(change_team_name_modal);
		
		change_team_name_modal.querySelector(".close_modal").onclick = () => {
			removeModal(change_team_name_modal);
		}
		
		change_team_name_modal.querySelector(".cancel_button").onclick = () => {
			removeModal(change_team_name_modal);
		}
		
		change_team_name_modal.querySelector(".submit_button").onclick = () => {
			// update team name
			const team_name_input = change_team_name_modal.querySelector("input[name='title']");
			if(team_name_input.value == "") {
				alert("팀 이름을 정확히 입력해주세요.");
			} else if(team_name_input.value == selected_team.title) {
				alert("현재 조직명과 같은 이름을 사용할 수 없습니다.");
			} else {
				updateTeamName(team_name_input.value);
			}
		}
	}
	
	const change_profile = document.querySelector("#change_profile");
	change_profile.onclick = () => {
		// 프로필 명 변경 모달 출력
		const change_nickname_modal = makeChangeProfileNameModal();
		appendModalToContainer(change_nickname_modal);
		
		change_nickname_modal.querySelector(".close_modal").onclick = () => {
			removeModal(change_nickname_modal);
		}
		
		change_nickname_modal.querySelector(".cancel_button").onclick = () => {
			removeModal(change_nickname_modal);
		}
		
		change_nickname_modal.querySelector(".submit_button").onclick = () => {
			const nickname_input = change_nickname_modal.querySelector("input[name='nickname']");
			if(nickname_input.value == "") {
				alert("닉네임을 정확히 입력해주세요.");
			} else if(nickname_input.value == principal_profile.nickname) {
				alert("현재 닉네임과 같은 이름을 사용할 수 없습니다.");
			} else {
				updateProfileNickname(nickname_input.value);
			}
		}
	}
	
	const invite_member = document.querySelector("#invite_member");
	invite_member.onclick = () => {
		// 구성원 초대 가능한 링크있는 모달 출력
	}
	
	const leave_team = document.querySelector("#leave_team");
	leave_team.onclick = () => {
		// 조직 나가기 설명 페이지 이동
		const leave_team_form = makeLeaveTeamDescriptionTag();
		replaceTagInMainContents(leave_team_form);
		
		const input_wrapper = leave_team_form.querySelector(".input_wrapper");
		const confirm = input_wrapper.querySelector(".confirm");
		const leave_button = leave_team_form.querySelector(".leave_button");
		input_wrapper.onclick = () => {
			confirm.toggleAttribute("checked");
			if(confirm.checked) {
				leave_button.disabled = false;
			} else {
				leave_button.disabled = true;
			}
		}
		leave_button.onclick = () => {
			const leave_confirm_modal = makeConfirmLeaveTeamModal();
			appendModalToContainer(leave_confirm_modal);
			
			leave_confirm_modal.querySelector(".cancel_button").onclick = () => {
				removeModal(leave_confirm_modal);
			}
			
			leave_confirm_modal.querySelector(".submit_button").onclick = () => {
				// 조직 내 ADMIN 검사 후 본인 이외에 ADMIN이 없으면 퇴장 불가
				const leave_flag = leaveTeam();
				if(leave_flag) {
					location.reload();
				} else {
					removeModal(leave_confirm_modal);
					const leave_error_modal = makeErrorToLeaveTeamModal();
					appendModalToContainer(leave_error_modal);
					
					leave_error_modal.querySelector(".confirm_button").onclick = () => {
						removeModal(leave_error_modal);
					}
				}
			}
		}
	}
	
	const delete_team = document.querySelector("#delete_team");
	delete_team.onclick = () => {
		// 조직 삭제 설명 페리지 이동
		const delete_team_form = makeDeleteTeamDescriptionTag();
		replaceTagInMainContents(delete_team_form);
		
		const input_wrapper = delete_team_form.querySelector(".input_wrapper");
		const confirm = input_wrapper.querySelector(".confirm");
		const delete_button = delete_team_form.querySelector(".delete_button");
		input_wrapper.onclick = () => {
			confirm.toggleAttribute("checked");
			if(confirm.checked) {
				delete_button.disabled = false;
			} else {
				delete_button.disabled = true;
			}
		}
		
		delete_button.onclick = () => {
			const delete_confirm_modal = makeConfirmDeleteTeamModal();
			appendModalToContainer(delete_confirm_modal);
			
			delete_confirm_modal.querySelector(".cancel_button").onclick = () => {
				removeModal(delete_confirm_modal);
			}
			
			delete_confirm_modal.querySelector(".submit_button").onclick = () => {
				const delete_flag = deleteTeam();
				if(delete_flag) {
					location.reload();
				} else {
					removeModal(delete_confirm_modal);
					const leave_error_modal = makeErrorToLeaveTeamModal();
					appendModalToContainer(leave_error_modal);
					
					leave_error_modal.querySelector(".confirm_button").onclick = () => {
						removeModal(leave_error_modal);
					}
				}
			}
		}
	}
}

change_team_button.onclick = () => {
	// 팀 리스트 및 선택 모달 출력
	// 모달에서 새로운 팀 생성 가능
}

add_new_group_button.onclick = () => {
	let add_new_group_input_wrapper = document.querySelector("#add_new_group");
	if(add_new_group_input_wrapper != null) return;
	
	add_new_group_input_wrapper = makeAddNewGroupTag();
	groups.insertBefore(add_new_group_input_wrapper, groups.children[1]);
	
	const group_name_input = add_new_group_input_wrapper.querySelector("input");
	const remove_button = add_new_group_input_wrapper.querySelector("button");
	
	group_name_input.focus();
	
	remove_button.onclick = () => add_new_group_input_wrapper.remove();
	group_name_input.onkeypress = (event) => {
		if(event.keyCode == 13) {
			if(group_name_input.value == "") {
				alert("그룹명을 다시 입력해주세요.");
				return;
			}
			group_name_input.onkeypress = null;
			if(insertGroup(group_name_input.value)) {
				card_group_wrapper.querySelectorAll(".card_book").forEach((e, index) => {
					if(card_book_list[i].id == selected_card_book.id) e.click();
				});
			} else {
				alert("그룹 인서트 실패");
			}
		}
	}
}

card_book_members_button.onclick = () => {
	// 명함첩 참여 유저 리스트 출력
	page = 0;
	
	const card_book_member_list = loadCardBookJoinMembers();
	const card_book_member_list_tag = makeCardBookJoinUserListTag();
	replaceTagInMainContents(card_book_member_list_tag);
	console.log(card_book_member_list);
	const member_list_wrapper = card_book_member_list_tag.querySelector(".contents");
	for(let i = 0; i < card_book_member_list.length; i++) {
		const member_tag = makeCardBookJoinUserTag(card_book_member_list[i]);
		member_list_wrapper.appendChild(member_tag);
		// personal card select
	}
	
	setListPager(card_book_member_list[0].total_count);
}

card_book_settings_button.onclick = () => {
	// 명함첩 설정 태그 출력
	const card_book_settings_tag = makeCardBookSettingsTag();
	replaceTagInMainContents(card_book_settings_tag);
	
	const change_card_book_name = card_book_settings_tag.querySelector("#change_card_book_name");
	change_card_book_name.onclick= () => {
		const change_card_book_name_modal = makeChangeCardBookNameModal();
		appendModalToContainer(change_card_book_name_modal);
		
		change_card_book_name_modal.querySelector(".close_modal").onclick = () => {
			removeModal(change_card_book_name_modal);
		}
		
		change_card_book_name_modal.querySelector(".cancel_button").onclick = () => {
			removeModal(change_card_book_name_modal);
		}
		
		change_card_book_name_modal.querySelector(".submit_button").onclick = () => {
			const card_book_name_input = change_card_book_name_modal.querySelector("input[name='card_book_name']");
			if(card_book_name_input.value == "") {
				alert("명함첩 이름을 정확히 입력해주세요.");
			} else if(card_book_name_input.value == selected_card_book.card_book_name) {
				alert("현재 명함첩 이름과 같은 이름을 사용할 수 없습니다.");
			} else {
				updateCardBookName(card_book_name_input.value);
			}
		}
	}
}

function loadPrincipalProfile() {
	let profile;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/profile",
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			profile = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return profile;
}

function loadTeam() {
	let team_list;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/list",
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			team_list = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return team_list;
}

function loadBookList() {
	console.log("loadBookList Before");
	let book_list;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/" + selected_team.id + "/book/list",
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			book_list = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	console.log("loadBookList After");
	return book_list;
}

function loadGroupList() {
	let groups;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/book/" + selected_card_book.id + "/group/list",
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			groups = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return groups;
}

function loadAllCardList() {
	let cards;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/book/" + selected_card_book.id + "/card/list",
		async: false,
		data: {"page":page},
		dataType: "json",
		success: function (data) {
			console.log(data);
			cards = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return cards;
}

function loadSpecificGroupCardList() {
	let cards;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/group/" + selected_group.id + "/card/list",
		async: false,
		data: {"page":page},
		dataType: "json",
		success: function (data) {
			console.log(data);
			cards = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return cards;
}

function setListPager(total_count) {
	const max_page = total_count % 10 == 0 ? Math.floor(total_count / 10) : Math.floor(total_count / 10) + 1;
	let min_page = page -1;
	const pager_tags = document.querySelector(".pager").children;
	console.log(pager_tags);
	for(let i = 0; i < pager_tags.length; i++) {
		if(min_page < 1 || min_page > max_page) pager_tags[i].classList.add("blank");
		else {
			pager_tags[i].classList.add("current");
			pager_tags[i].innerText = min_page;
		}
		min_page++;
	}
}

function addClassClickedToCard(index) {
	const cards = document.querySelectorAll(".card_list > .card");
	console.log(cards);
	for(let i = 0; i < cards.length; i++) {
		if(i == index) cards[i].classList.add("clicked");
		else					cards[i].classList.remove("clicked");
	}
}

function loadCardDetail() {
	let detail;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/card/" + selected_card.id,
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			detail = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return detail;
}

function loadTeamMembers() {
	let team_members;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/" + selected_team.id + "/member/list",
		async: false,
		data: {"page":page},
		dataType: "json",
		success: function (data) {
			team_members = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return team_members;
}

function loadCardBookJoinMembers() {
	let card_book_members;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/book/" + selected_card_book.id + "/member/list",
		async: false,
		data: {"page":page},
		dataType: "json",
		success: function (data) {
			card_book_members = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return card_book_members;
}

function updateTeamName(title) {
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/" + selected_team.id,
		data: {"title":title},
		dataType: "json",
		success: function (data) {
			if(data == true) {
				location.reload();
			} else {
				alert("조직명 변경 실패");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function updateProfileNickname(nickname) {
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/profile/" + principal_profile.id,
		data: {"nickname":nickname},
		dataType: "json",
		success: function (data) {
			if(data == true) {
				location.reload();
			} else {
				alert("닉네임 변경 실패");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function updateCardBookName(card_book_name) {
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/book/" + selected_card_book.id,
		data: {"card_book_name":card_book_name},
		dataType: "json",
		success: function (data) {
			if(data == true) {
				location.reload();
			} else {
				alert("명함첩 이름 변경 실패");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function leaveTeam() {
	let flag = false;
	$.ajax({
		type: "delete",
		url: "/api/v1/card/team/" + selected_team.id + "/entry",
		async: false,
		dataType: "json",
		success: function (data) {
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function deleteTeam() {
	let flag = false;
	$.ajax({
		type: "delete",
		url: "/api/v1/card/team/" + selected_team.id,
		async: false,
		dataType: "json",
		success: function (data) {
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function insertGroup(group_name) {
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/card/team/book/" + selected_card_book.id,
		async: false,
		data: {"group_name":group_name},
		dataType: "json",
		success: function (data) {
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function insertMemo(card_id, contents) {
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/card/team/card/" + card_id + "/memo",
		async: false,
		data: {"contents":contents},
		dataType: "json",
		success: function (data) {
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function updateMemo(card_memo_id, contents) {
	let flag = false;
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/memo/" + card_memo_id,
		async: false,
		data: {"contents":contents},
		dataType: "json",
		success: function (data) {
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function deleteMemo(card_memo_id) {
	let flag = false;
	$.ajax({
		type: "delete",
		url: "/api/v1/card/team/memo/" + card_memo_id,
		async: false,
		dataType: "json",
		success: function (data) {
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function getGroupBelongFlags(card_id) {
	let group_belong_flags;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/card/" + card_id + "/belong",
		async: false,
		dataType: "json",
		success: function (data) {
			group_belong_flags = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return group_belong_flags;
}

function updateCardBelongTeamGroup(update_card_belong) {
	let flag = false;
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/card/" + selected_card_detail.card.id + "/belong",
		async: false,
		data: update_card_belong,
		dataType: "json",
		success: function (data) {
			console.log(data);
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function updateCardDetail(formdata) {
	let flag = false;
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/card/" + selected_card_detail.card.id,
		data : formdata,
		encType: "multipart/form-data",
		processData: false,
		contentType: false,
		dataType: "json",
		success: function (data) {
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function reloadCardDetail() {
	const cards = document.querySelector(".card_list_wrapper .card_list").children;
	for(let i = 0; i < cards.length; i++) {
		if(cards[i].className.includes("clicked")) {
			cards[i].click();
			break;
		}
	}
}

function setWholeGroup(whole_count) {
	whole_card_button.querySelector(".whole_count").innerText = whole_count; 
}

function addClassActiveToGroup(card_books, index) {
	for(let i = 0; i < card_books.length; i++) {
		if(i == index) card_books[i].classList.add("active");
		else					card_books[i].classList.remove("active");
	}
}

function setTeamInfo() {
	const team_info = document.querySelector(".menus .team_info");
	team_info.querySelector(".team_name").innerText = selected_team.title;
	
	const grade_text = selected_team.grade_id == 1 ? "베이직" : selected_team.grade_id == 2 ? "프리미엄" : "엔터프라이즈";
	team_info.innerHTML += `<span class="team_grade ${selected_team.grade}">${grade_text}</span>`;
	
	const max_card_count_text = selected_team.grade_id == 1 ? "100장" : "∞";
	const storage = document.querySelector(".menus .storage");
	storage.innerHTML = `<span class="team_card_count">${selected_team.total_card_count}</span>&nbsp;/ ${max_card_count_text} 이용 중`;
}

function setCardBookList() {
	let card_books = card_book_wrapper.querySelectorAll(".card_book");
	card_books.forEach(e => e.remove());
	
	for(let i = 0; i < card_book_list.length; i++) {
		const card_book_button = makeCardBookTag(card_book_list[i]);
		card_book_wrapper.insertBefore(card_book_button, add_new_card_book_button);
		card_book_button.onclick = () => {
			card_books = card_book_wrapper.querySelectorAll(".card_book");
			selected_card_book = card_book_list[i];
			addClassActiveToGroup(card_books, i);
			group_list = loadGroupList();
			setGroupList();
			console.log("set group");
		}
	}
}

function setGroupList() {
	setWholeGroup(selected_card_book.card_count);
	group_wrapper.querySelectorAll(".group").forEach(e => {
		if(e.id != "whole_cards") e.remove();
	});
	for(let i = 0; i < group_list.length; i++) {
		const group_button = makeCardGroupTag(group_list[i]);
		group_wrapper.appendChild(group_button);
		group_button.onclick = () => {
			console.log(group_list[i].group_name + " is pressed");
			page = 0;
			selected_group = group_list[i];
			console.log(selected_group);
			card_list = loadSpecificGroupCardList();
			setCardList();
		}
	}
}

function setCardList() {
	if( (card_list.length == 1 && card_list[0].total_count == 0) || card_list.length == 0) {
		const how_to_use_tag = makeHowToUseTag();
		replaceTagInMainContents(how_to_use_tag);
	} else {
		const card_list_wrapper_tag = makeCardListTag();
		replaceTagInMainContents(card_list_wrapper_tag);
		setListPager(card_list[0].total_count);
		
		const card_list_tag = card_list_wrapper_tag.querySelector(".card_list");
		for(let i = 0; i < card_list.length; i++) {
			const card_tag = makeCardTag(card_list[i]);
			card_list_tag.appendChild(card_tag);
			selected_card = card_list[i];
			addClassClickedToCard(i);
			
			card_tag.onclick = () => {
				selected_card_detail = loadCardDetail();
				setCardDetail();
			}
		}
		if(card_list.length > 0) {
			card_list_tag.querySelectorAll(".card")[0].click();
		}
	}
}

function setCardDetail() {
	let card_detail_tag = document.querySelector(".card_detail");
	if(card_detail_tag != null) {
		card_detail_tag.remove();
	}
	card_detail_tag = makeCardDetailTag(selected_card_detail);
	appendTagToMainContents(card_detail_tag);
	
	const card_list_wrapper = main_contents.querySelector(".card_list_wrapper");
	
	const edit_card_button = card_detail_tag.querySelector(".edit_card");
	edit_card_button.onclick = () => {
		const edit_card_form = makeEditCardForm();
		card_list_wrapper.classList.add("hidden");
		card_detail_tag.classList.add("hidden");
		appendTagToMainContents(edit_card_form);
		
		let front_card_image_file;
		let back_card_image_file;
		const card_image_wrapper = edit_card_form.querySelector(".card_image_wrapper");
		const card_image_input_wrapper = edit_card_form.querySelector(".card_image_wrapper > .input_wrapper");
		const card_image_input = card_image_input_wrapper.querySelector("input");
		
		let clicked_card;
		
		card_image_input_wrapper.onclick = () => {
			card_image_input.click();
		}
		
		card_image_input.onchange = () => {
			const file_reader = new FileReader();
			
			file_reader.onloadend = (event) => {
				if(clicked_card == "front") {
					clicked_card = null;
					card_image_wrapper.querySelector(".front > img").src = event.target.result;
					front_card_image_file = card_image_input.files[0];
				} else if(clicked_card == "back") {
					clicked_card = null;
					card_image_wrapper.querySelector(".back > img").src = event.target.result;
					back_card_image_file = card_image_input.files[0];
				} else if(front_card_image_file == null) {
					const card_image_tag = makeCardImageTag(event.target.result, true);
					card_image_wrapper.insertBefore(card_image_tag, card_image_input_wrapper);
					
					card_image_tag.querySelector(".change_image").onclick = () => {
						clicked_card = "front";
						card_image_input.click();
					}
					front_card_image_file = card_image_input.files[0];
					card_image_input_wrapper.querySelector(".text").innerText = "뒷면 추가";
				} else {
					const card_image_tag = makeCardImageTag(event.target.result, false);
					card_image_wrapper.insertBefore(card_image_tag, card_image_input_wrapper);
					
					card_image_tag.querySelector(".change_image").onclick = () => {
						clicked_card = "back";
						card_image_input.click();
					}
					back_card_image_file = card_image_input.files[0];
					card_image_input_wrapper.classList.add("hidden");
				}
				console.log(front_card_image_file);
				console.log(back_card_image_file);
			}
			
			file_reader.readAsDataURL(card_image_input.files[0]);
		}
		
		let profile_image_file;
		const profile_image_tag = edit_card_form.querySelector(".profile_image > img");
		const profile_image_input = edit_card_form.querySelector(".profile_image > input");
		
		edit_card_form.querySelector(".set_profile_image").onclick = (event) => profile_image_input.click();
		
		profile_image_input.onchange = () => {
			const file_reader = new FileReader();
			
			file_reader.onloadend = (event) => {
				profile_image_tag.src = event.target.result;
				profile_image_file = profile_image_input.files[0];
			}
			
			file_reader.readAsDataURL(profile_image_input.files[0]);
		}
		
		edit_card_form.querySelector(".cancel_button").onclick= () => {
			edit_card_form.remove();
			card_list_wrapper.classList.remove("hidden");
			card_detail_tag.classList.remove("hidden");
		}
		
		edit_card_form.querySelector(".submit_button").onclick = () => {
			const card_inputs = edit_card_form.querySelectorAll(".row input");
			if(card_inputs[0].value == "") {
				alert("이름은 필수로 입력해야합니다");
				return;
			}
			const formdata = makeFormDataForUpdateCard(card_inputs, front_card_image_file, back_card_image_file, profile_image_file);
			if(updateCardDetail(formdata)) {
				edit_card_form.remove();
				card_list_wrapper.classList.remove("hidden");
				card_detail_tag.classList.remove("hidden");
				reloadCardDetail();
			} else {
				alert("명함 수정에 실패했습니다.");
			}
		}
	}
	
	const modal_group_wrapper = card_detail_tag.querySelector(".group_info");
	for(let i = 0; i < selected_card_detail.group_list.length; i++) {
		const group_button = makeGroupNameTagInCardDetail(selected_card_detail.group_list[i]);
		modal_group_wrapper.appendChild(group_button);
		group_button.onclick = () => {
			// show group select modal
			let group_belong_flags = getGroupBelongFlags(selected_card_detail.card.id);
			console.log(group_belong_flags);
			const change_group_modal = makeChangeGroupModal(1);
			const group_list_tag = change_group_modal.querySelector(".group_list");
			const add_new_group_in_modal = change_group_modal.querySelector(".add_new_group");
			const insert_group_form = change_group_modal.querySelector(".insert_group_form");
			const new_group_name_input = insert_group_form.querySelector("input");
			for(let i = 0; i < group_belong_flags.length; i++) {
				if(group_belong_flags[i].group_name == "미분류") continue;
				const group_tag = makeGroupTagForModal(group_belong_flags[i]);
				group_list_tag.insertBefore(group_tag, add_new_group_in_modal);
				
				group_tag.onclick = () => group_tag.querySelector(".group_selector").click();
			}
			appendModalToContainer(change_group_modal);
			
			change_group_modal.querySelector(".close_modal").onclick = () => {
				removeModal(change_group_modal);
			}
			
			add_new_group_in_modal.onclick = () => {
				add_new_group_in_modal.classList.add("hidden");
				insert_group_form.classList.remove("hidden");
			}
			
			insert_group_form.querySelector(".confirm").onclick = () => {
				if(new_group_name_input.value == "") {
					alert("그룹명을 확인해주세요.");
				} else if(new_group_name_input.value == "미분류") {
					alert("해당 그룹명은 사용할 수 없습니다.");
				} else {
					// insert new group
					if(insertGroup(new_group_name_input.value)) {
						group_list_tag.querySelectorAll(".group").forEach(e => e.remove());
						group_belong_flags = getGroupBelongFlags(selected_card_detail.card.id);
						for(let i = 0; i < group_belong_flags.length; i++) {
							if(group_belong_flags[i].group_name == "미분류") continue;
							const group_tag = makeGroupTagForModal(group_belong_flags[i]);
							group_list_tag.insertBefore(group_tag, add_new_group_in_modal);
							
							group_tag.onclick = () => group_tag.querySelector(".group_selector").click();
						}
						new_group_name_input.value = "";
						add_new_group_in_modal.classList.remove("hidden");
						insert_group_form.classList.add("hidden");
						card_book_wrapper.querySelectorAll(".card_book").forEach((e, index) => {
							if(card_book_list[index].id == selected_card_book.id) {
								e.click();
							}
						});
					} else {
						alert("그룹 인서트 실패");
					}
				}
			}
			
			insert_group_form.querySelector(".cancel").onclick = () => {
				new_group_name_input.value = "";
				add_new_group_in_modal.classList.remove("hidden");
				insert_group_form.classList.add("hidden");
			}
			
			change_group_modal.querySelector(".set_group_button").onclick = () => {
				// update card group join user
				const add_belong_id_list = new Array();
				const remove_belong_id_list = new Array();
				const group_selectors = change_group_modal.querySelectorAll(".group_list .group_selector");
				console.log(group_selectors);
				for(let i = 0; i < group_selectors.length; i++) {
					if(group_belong_flags[i].belong_flag != group_selectors[i].checked) {
						if(group_selectors[i].checked == true) {
							add_belong_id_list.push(group_belong_flags[i].team_group_id);
						} else {
							remove_belong_id_list.push(group_belong_flags[i].team_group_id);
						}
					}
				}
				console.log(group_belong_flags);
				console.log(add_belong_id_list);
				console.log(remove_belong_id_list);
				let false_count = 0;
				group_selectors.forEach(e => {
					if(e.checked == false) false_count++;
				});
				console.log("remove_all_flag : " + (false_count == group_selectors.length));
				const update_card_belong = makeJSONObjForUpdateBelong(add_belong_id_list, remove_belong_id_list);
				update_card_belong['remove_all_flag'] = false_count == group_selectors.length;
				update_card_belong['default_team_group_id'] = group_belong_flags[group_belong_flags.length - 1].team_group_id;
				console.log(update_card_belong);
				if(updateCardBelongTeamGroup(update_card_belong)) {
					reloadCardDetail();
					removeModal(change_group_modal);
					group_list = loadGroupList();
					setGroupList();
				} else {
					alert("그룹 소속 인서트 실패");
				}
			}
		}
	}
	
	const memo_wrapper = card_detail_tag.querySelector(".memo_list");
	for(let i = 0; i < selected_card_detail.memo_list.length; i++) {
		const memo = makeMemoTag(selected_card_detail.memo_list[i]);
		memo_wrapper.appendChild(memo);

		memo.querySelector(".show_edit_memo_modal").onclick = () => {
			const update_memo_modal = makeUpdateTeamCardMemoModal(selected_card_detail.memo_list[i]);
			const contents = update_memo_modal.querySelector("textarea[name='contents']");
			const submit_button = update_memo_modal.querySelector(".submit_button");
			
			appendModalToContainer(update_memo_modal);
			setTimeout(() => contents.focus(), 150);
			
			update_memo_modal.querySelector(".close_modal").onclick = () => {
				removeModal(update_memo_modal);
			}
			
			update_memo_modal.querySelector(".cancel_button").onclick = () => {
				removeModal(update_memo_modal);
			}
			
			contents.oninput = (event) => {
				if(event.target.value == "") {
					submit_button.disabled = true;
				} else {
					submit_button.disabled = false;
				}
			}
			
			submit_button.onclick = () => {
				if(updateMemo(selected_card_detail.memo_list[i].id, contents.value)) {
					reloadCardDetail();
				} else {
					alert("메모 수정 실패");
				}
				removeModal(update_memo_modal);
			}
		}

		memo.querySelector(".show_remove_memo_modal").onclick = () => {
			const remove_memo_modal = makeDeleteConfirmTeamCardMemoModal(selected_card_detail.memo_list[i]);
			appendModalToContainer(remove_memo_modal);
			
			remove_memo_modal.querySelector(".close_modal").onclick = () => {
				removeModal(remove_memo_modal);
			}
			
			remove_memo_modal.querySelector(".remove_button").onclick = () => {
				if(deleteMemo(selected_card_detail.memo_list[i].id)) {
					reloadCardDetail();
				} else {
					alert("메모 삭제 실패");
				}
				removeModal(remove_memo_modal);
			}
		}
	}
	
	const memo_input_wrapper = card_detail_tag.querySelector(".memo_input");
	memo_input_wrapper.onclick = () => {
		const memo_input_modal = makeAddTeamCardMemoModal();
		const contents = memo_input_modal.querySelector("textarea[name='contents']");
		const submit_button = memo_input_modal.querySelector(".submit_button");
		
		appendModalToContainer(memo_input_modal);
		setTimeout(() => contents.focus(), 150);
		
		memo_input_modal.querySelector(".close_modal").onclick = () => {
			removeModal(memo_input_modal);
		}
		
		memo_input_modal.querySelector(".cancel_button").onclick = () => {
			removeModal(memo_input_modal);
		}
		
		contents.oninput = (event) => {
			if(event.target.value == "") {
				submit_button.disabled = true;
			} else {
				submit_button.disabled = false;
			}
		}
		
		submit_button.onclick = () => {
			if(insertMemo(selected_card_detail.card.id, contents.value)) {
				reloadCardDetail();
			} else {
				alert("메모 인서트 실패");
			}
			removeModal(memo_input_modal);
		}
	}
}

function makeFormDataForUpdateCard(inputs, front_card_image, back_card_image, profile_image) {
	const formdata = new FormData();
	for(let i = 0; i < inputs.length; i++) {
		if(inputs[i].value != "") formdata.append(inputs[i].name, inputs[i].value);
	}
	if(front_card_image != null) formdata.append("front_card_image", front_card_image);
	if(back_card_image != null) formdata.append("back_card_image", back_card_image);
	if(profile_image != null) formdata.append("profile_image", profile_image);
	if(selected_card_detail.card.profile_img != null) formdata.append("profile_img", selected_card_detail.card.profile_img);
	
	return formdata;
}

function makeJSONObjForUpdateBelong(add_id_list, remove_id_list) {
	const obj = {add_id_list:new Array(),
							remove_id_list:new Array()};
	for(let i = 0; i < add_id_list.length; i++) {
		obj.add_id_list.push(add_id_list[i]);
	}
	for(let i = 0; i < remove_id_list.length; i++) {
		obj.remove_id_list.push(remove_id_list[i]);
	}
	
	return obj;
}

function pickTeamOrderByCreateDate(team_list) {
	return team_list.sort((a, b) => new Date(b.create_date) - new Date(a.create_date))[0];
}

function makeRegDateText(create_date) {
	const date = new Date(create_date);
	const month = date.getMonth() + 1;
	const day = String(date.getDate()).padStart(2, "0");
	
	return `${date.getFullYear()}년 ${month}월 ${day}일`;
}

function makeTeamCreateDateText(create_date) {
	const date = new Date(create_date);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	
	return `${date.getFullYear()}-${month}-${day}`;
}

function makeAddressText(address, sub_address) {
	if(address != null && sub_address != null) {
		return `${address} ${sub_address}`;
	} else if(address != null && sub_address == null) {
		return address;
	} else {
		return null;
	}
}

function makePhoneNumberText(phone) {
	return `${phone.substring(0, 3)}-${phone.substring(3, 7)}-${phone.substring(7, 11)}`;
}

function appendModalToContainer(tag) {
	document.querySelector(".container").appendChild(tag);
	document.body.style = "overflow: hidden;";
}

function removeModal(tag) {
	tag.remove();
	document.body.style = "";
}

function appendTagToMainContents(tag) {
	main_contents.appendChild(tag);
}

function replaceTagInMainContents(tag) {
	main_contents.innerHTML = "";
	appendTagToMainContents(tag);
}

function makeAddNewGroupTag() {
	const div = document.createElement("div");
	div.className = "input_wrapper";
	div.id = "add_new_group";
	div.innerHTML = `
		<input type="text" name="group_name" placeholder="그룹명 입력">
		<button type="button">
			<img src="/static/images/card_team_add_card_wrapper_closer.png">
		</button>
	`;
	return div;
}

function makeGroupNameTagInCardDetail(group) {
	const span = document.createElement("span");
	span.className = group.group_name == "미분류" ? "text no_content" : "text group";
	span.innerHTML = `${group.group_name}<img src="/static/images/card_team_edit_group.png" class="show_edit_group_modal">`;
	return span;
}

function makeMemoTag(memo) {
	const div = document.createElement("div");
	div.className = "memo";
	div.innerHTML = `
		<div class="title">
			<span class="text">${memo.create_date.replace('T', ' ')} by ${memo.nickname}</span>
			<button type="button" class="show_edit_memo_modal">
				<img src="/static/images/card_team_edit_memo.png">
			</button>
			<button type="button" class="show_remove_memo_modal">
				<img src="/static/images/card_team_remove_memo.png">
			</button>
		</div>
		<div class="contents">${memo.contents}</div>
	`;
	return div;
}

function makeCardGroupTag(group) {
	const button = document.createElement("button");
	button.type = "button";
	button.className = "group";
	button.innerHTML = `
		<span class="sub_group_arrow"></span>
		<span class="group_text">${group.group_name} (<span class="card_count">${group.card_count}</span>)</span>
	`;
	return button;
}

function makeCardBookTag(card_book) {
	const button = document.createElement("button");
	button.type = "button";
	button.className = "card_book";
	button.innerHTML = `
		<span class="card_book_name">${card_book.card_book_name}</span>
		<div class="card_book_info">
			참여자 <span class="join_count">${card_book.join_count}</span>명 · 명함 <span class="card_count">${card_book.card_count}</span>장
		</div>
	`;
	return button;
}

function makeNoMembersTag() {
	const div = document.createElement("div");
	div.className = "no_member";
	div.innerHTML = `
		<span>함께 사용할 동료들을 구성원으로 초대하세요.</span>
		<span>링크를 전달하여 손쉽게 초대할 수 있습니다.</span>
		<button type="button" class="invite_member">조직 구성원 초대</button>
	`;
	return div;
}

function makeHowToUseTag() {
	const div = document.createElement("div");
	div.className = "how_to_use";
	div.innerHTML = `
		<div class="row">
			<span class="title">1. <b>내 명함첩에 있는 명함</b>을 팀 명함첩에 공유하려면?</span>
			<span class="description">‘내 명함첩’에서 명함을 선택하고, ‘팀 명함첩으로 복제’를 클릭하여 공유할 수 있습니다.</span>
			<img src="/static/images/card_team_how_to_use_1.jpg">
		</div>
		<div class="row">
			<span class="title">2. <b>엑셀이나 이미지</b>로 관리하던 연락처를 팀 명함첩에 등록하려면?</span>
			<span class="description">화면 우측 상단의 + 버튼(명함 추가하기)을 클릭하면, 엑셀 또는 이미지를 등록할 수 있습니다.</span>
			<img src="/static/images/card_team_how_to_use_2.jpg">
		</div>
	`;
	return div;
}

function makeTeamManageTag() {
	const grade_text = selected_team.grade_id == 1 ? "베이직(무료)" : selected_team.grade_id == 2 ? "프리미엄" : "엔터프라이즈";
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<span class="text">조직 관리</span>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text small">상품</span>
			</div>
			<div class="row">
				<div class="title">
					<span class="text small">이용 중인 상품</span>
					<span class="text">${grade_text}</span>
				</div>
				<button type="button" id="show_product_description">자세히 보기</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">이용 현황</span>
				<button type="button" id="show_history">자세히 보기</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">결제 관리</span>
				<button type="button" id="manage_payment">관리하기</button>
			</div>
			<div class="row">
				<span class="text small">이름</span>
			</div>
			<div class="row">
				<div class="title">
					<span class="text small">조직명</span>
					<span class="text">${selected_team.title}</span>
				</div>
				<button type="button" id="change_team_name">변경</button>
			</div>
		</section>
		<section>
			<div class="row">
				<div class="title">
					<span class="text small">사용자 이름</span>
					<span class="text">${principal_profile.nickname}</span>
				</div>
				<button type="button" id="change_profile">변경</button>
			</div>
			<div class="row">
				<span class="text small">구성원</span>
			</div>
			<div class="row">
				<span class="text">조직 구성원 초대</span>
				<button type="button" id="invite_member">초대하기</button>
			</div>
			<div class="row">
				<span class="text small">기타</span>
			</div>
			<div class="row">
				<span class="text">조직에서 나가기</span>
				<button type="button" id="leave_team" class="red">나가기</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">조직 삭제</span>
				<button type="button" id="delete_team" class="red">삭제하기</button>
			</div>
		</section>
	`;
	return div;
}

function makeCardBookSettingsTag() {
	const div = document.createElement("div");
	div.className = "card_book_settings";
	div.innerHTML = `
		<section>
			<div class="row">
				<span class="text">명함첩 설정</span>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text small">명함첩 관리</span>
			</div>
			<div class="row">
				<div class="title">
					<span class="text small">명함첩 이름</span>
					<span class="text">${selected_card_book.card_book_name}</span>
				</div>
				<button type="button" id="change_card_book_name">변경</button>
			</div>
			<div class="row">
				<span class="text small">참여자</span>
			</div>
			<div class="row">
				<span class="text">참여자 권한 설정</span>
				<button type="button" id="change_member_authority">변경</button>
			</div>
			<div class="row">
				<span class="text small">명함 관리</span>
			</div>
			<div class="row">
				<span class="text">파일로 내보내기 (엑셀, 아웃룩 등)</span>
				<button type="button" id="export_to_file">내보내기</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">삭제된 명함</span>
				<button type="button" id="show_deleted_cards">관리하기</button>
			</div>
			<div class="row">
				<span class="text small">기타</span>
			</div>
			<div class="row">
				<span class="text disabled">명함첩 나가기</span>
				<button type="button" id="leave_card_book" class="red" disabled>나가기</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text disabled">명함첩 삭제</span>
				<button type="button" id="delete_card_book" class="red" disabled>삭제하기</button>
			</div>
		</section>
	`;
	return div;
}

function makeCardBookJoinUserListTag() {
	const div = document.createElement("div");
	div.className = "join_users";
	div.innerHTML = `
		<div class="title">
			<span>참여 중인 구성원</span>
			<button type="button" class="add_team_user">+ 추가하기</button>
		</div>
		<div class="contents">
			
		</div>
		<div class="pager_wrapper">
			<button type="button" class="prev_page">«</button>
			<div class="pager">
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
			</div>
			<button type="button" class="next_page">»</button>
		</div>
	`;
	return div;
}

function makeCardBookJoinUserTag(user) {
	const phone_number = makePhoneNumberText(user.phone);
	const div = document.createElement("div");
	div.className = "user";
	div.innerHTML = `
		<div class="profile_image">
			<img src="/static/images/default_profile_image.png">
		</div>
		<div class="description">
			<div class="name_tag">
				<span class="nickname">${user.nickname}</span>
${user.role == "ADMIN" ? '<span class="admin">관리자</span>' : ''}
			</div>
			<span class="phone_number">${phone_number}</span>
		</div>
	`;
	return div;
}

function makeCardTag(card) {
	const div = document.createElement("div");
	div.className = "card";
	div.innerHTML = `
		<div class="input_wrapper">
			<input type="checkbox" class="card_check">
		</div>
		<div class="card_info">
			<span class="name">${card.name}</span>
${card.position_name == null ? '' : '<span class="position_name">' + card.position_name + '</span>'}
${card.company_name == null ? '' : '<span class="company_name">' + card.company_name + '</span>'}
		</div>
	`;
	return div;
}

function makeCardListTag() {
	const div = document.createElement("div");
	div.className = "card_list_wrapper";
	div.innerHTML = `
		<div class="card_list_menu">
			<div class="left_menu">
				<div class="input_wrapper">
					<input type="checkbox" class="card_selector">
				</div>
				<div class="down_menu">
					<span class="arrow"></span>
				</div>
			</div>
			<div class="right_menu">
				<select class="card_ordering" name="order">
					<option value="reg_date" selected>등록일순</option>
					<option value="name">이름순</option>
					<option value="company_name">회사명순</option>
				</select>
			</div>
		</div>
		<div class="card_list">
			
		</div>
		<div class="pager_wrapper">
			<button type="button" class="prev_page">«</button>
			<div class="pager">
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
			</div>
			<button type="button" class="next_page">»</button>
		</div>
	`;
	return div;
}

function makeCardDetailTag(card_detail) {
	const reg_date = makeRegDateText(card_detail.card.create_date);
	const address_text = makeAddressText(card_detail.card.address, card_detail.card.sub_address);
	const div = document.createElement("div");
	div.className = "card_detail";
	div.innerHTML = `
		<div class="detail_header">
			<span class="reg_user_name">등록자 : ${card_detail.reg_user_nickname}</span>
			<div class="detail_menu">
				<button type="button" class="edit_card">편집</button>
				<div class="right">
					<button type="button" class="pass_card">전달</button>
					<div class="down_menu">
						<span class="arrow"></span>
					</div>
				</div>
			</div>
		</div>
		<div class="card_info">
			<div class="card_summary">
				<div class="profile_image">
					<img src="${card_detail.card.profile_img == null ? '/static/images/default_profile_image.png' : '/image/profile_images/' + card_detail.card.profile_img}">
				</div>
				<div class="texts">
					<span class="name">${card_detail.card.name}</span>
${card_detail.card.department_name == null ? '' : '<span class="department_text">' + card_detail.card.department_name + '</span>'}
${card_detail.card.company_name == null ? '' : '<span class="company_name">' + card_detail.card.company_name + '</span>'}
				</div>
${card_detail.card_images.length != 0 ? '<div class="card_image"><img src="/image/card_images/' + card_detail.card_images[0].card_image + '"></div>' : ''}
			</div>
			<div class="card_description">
				<div class="left">
					<div class="row">
						<span class="title">이메일</span>
${card_detail.card.email == null ? '<span class="description blank">이메일 없음</span>' : 
																'<span class="description">' + card_detail.card.email + '</span>'}
						
					</div>
					<div class="row">
						<span class="title">휴대폰</span>
${card_detail.card.phone == null ? '<span class="description blank">휴대폰 번호 없음</span>' : 
																  '<span class="description">' + card_detail.card.phone + '</span>'}
					</div>
					<div class="row">
						<span class="title">유선전화</span>
${card_detail.card.landline_phone == null ? '<span class="description blank">유선전화 번호 없음</span>' : 
																				  '<span class="description">' + card_detail.card.landline_phone + '</span>'}
					</div>
					<div class="row">
						<span class="title">팩스</span>
${card_detail.card.fax == null ? '<span class="description blank">팩스번호 없음</span>' : 
															 '<span class="description">' + card_detail.card.fax + '</span>'}
					</div>
				</div>
				<div class="right">
					<div class="row">
						<span class="title">등록일</span>
						<span class="description">${reg_date}</span>
					</div>
					<div class="row">
						<span class="title">주소</span>
${address_text == null ? '<span class="description blank">주소 없음</span>' : 
											   '<span class="description">' + address_text + '</span>'}
					</div>
				</div>
			</div>
			<div class="group_info">
				<span class="title">그룹</span>
			</div>
			<div class="memo_list_wrapper">
				<span class="title">메모</span>
${card_detail.memo_list.length == 0 ? '<span class="text no_content">메모 없음</span>' : '<div class="memo_list"></div>'}
			</div>
		</div>
		<div class="memo_input">
			<span class="text no_content">메모를 추가하세요</span>
			<span class="add_memo_button">+ 메모 추가</span>
		</div>
	`;
	return div;
}

function makeDeleteTeamDescriptionTag() {
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 조직 삭제</span>
					<span class="text">조직 삭제</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column">
				<span class="warning_title">삭제 전 아래 내용을 확인하세요</span>
				<div class="warning_description">조직을 삭제하면 모든 구성원에게 삭제되었다는 알림이 발송되고, 조직 내의 모든 명함첩이 삭제되어 조회할 수 없게 됩니다.
&#10;명함첩에 등록된 명함과 메모 등 모든 정보가 삭제되므로, 필요 시 미리 내 명함첩에 저장하거나 파일로 백업해두시기 바랍니다.
				</div>
				<div class="input_wrapper">
					<input type="checkbox" class="confirm">
					<span class="text">위 내용을 확인하였습니다.</span>
				</div>
				<button type="button" class="delete_button" disabled>삭제하기</button>
			</div>
		</section>
	`;
	return div;
}

function makeLeaveTeamDescriptionTag() {
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 나가기</span>
					<span class="text">나가기</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column">
				<span class="warning_title">나가기 전 아래 내용을 확인하세요</span>
				<div class="warning_description">조직에서 나가더라도 명함첩에 회원님이 공유한 명함과 기록한 메모 등은 그대로 남게 됩니다.
&#10;조직에 다시 참여하기 위해서는 조직 운영자의 초대가 필요합니다.
				</div>
				<div class="input_wrapper">
					<input type="checkbox" class="confirm">
					<span class="text">위 내용을 확인하였습니다.</span>
				</div>
				<button type="button" class="leave_button" disabled>나가기</button>
			</div>
		</section>
	`;
	return div;
}

function makeShowHistoryTag() {
	const create_date = makeTeamCreateDateText(selected_team.create_date);
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 이용현황</span>
					<span class="text">이용현황</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<div class="row">
					<span class="text">생성일</span>
					<span class="text small">${create_date}</span>
				</div>
				<div class="row">
					<span class="text">구성원</span>
					<span class="text small">${selected_team.total_join_user_count}명</span>
				</div>
				<div class="row">
					<span class="text">명함첩</span>
					<span class="text small">${document.querySelectorAll(".menus .card_book").length}개</span>
				</div>
				<div class="row">
					<span class="text">명함</span>
					<span class="text small">${selected_team.total_card_count}장</span>
				</div>
			</div>
		</section>
	`;
	return div;
}

function makeManagePaymentTag() {
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 결제 관리</span>
					<span class="text">결제 관리</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<div class="row">
					<span class="text">결제 수단</span>
					<button type="button" id="show_my_payment_process">관리하기</button>
				</div>
				<div class="row">
					<span class="text">결제 내역</span>
					<button type="button" id="show_my_payment_history">확인하기</button>
				</div>
			</div>
		</section>
	`;
	return div;
}

function makeMyPaymentProcess() {
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 결제 관리 &gt; 결제 수단</span>
					<span class="text">결제 수단</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<span class="no_contents">등록된 결제 수단이 없습니다</span>
			</div>
		</section>
	`;
	return div;
}

function makeMyPaymentHistory() {
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 결제 관리 &gt; 결제 내역</span>
					<span class="text">결제 내역</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<span class="no_contents">결제 내역이 없습니다</span>
			</div>
		</section>
	`;
	return div;
}

function makeEditCardForm() {
	const div = document.createElement("div");
	div.className = "edit_card_form";
	div.innerHTML = `
		<div class="title">
			<span class="text">명함 편집</span>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">저장</button>
			</div>
		</div>
		<div class="card_image_wrapper">
			<div class="input_wrapper">
				<span class="plus">+</span>
				<span class="text">명함 이미지 추가</span>
				<input type="file" name="file">
			</div>
		</div>
		<div class="card_data">
			<div class="profile_image">
				<img src="${selected_card_detail.card.profile_img == null ? '/static/images/default_profile_image.png' : '/image/profile_images/' + selected_card_detail.card.profile_img}">
				<button type="button" class="set_profile_image">프로필 사진 설정</button>
				<input type="file" name="profile_image" accept="image/*">
			</div>
			<div class="details">
				<div class="top">
					<div class="column">
						<div class="row">
							<span class="title">이름</span>
							<input type="text" name="name" value="${selected_card_detail.card.name}" placeholder="이름 입력">
						</div>
						<div class="row">
							<span class="title">직책</span>
							<input type="text" name="position_name" value="${selected_card_detail.card.position_name == null ? '' : selected_card_detail.card.position_name}" placeholder="직책 입력">
						</div>
					</div>
					<div class="column">
						<div class="row">
							<span class="title">부서</span>
							<input type="text" name="department_name" value="${selected_card_detail.card.department_name == null ? '' : selected_card_detail.card.department_name}" placeholder="부서명 입력">
						</div>
						<div class="row">
							<span class="title">회사</span>
							<input type="text" name="company_name" value="${selected_card_detail.card.company_name == null ? '' : selected_card_detail.card.company_name}" placeholder="회사명 입력">
						</div>
					</div>
				</div>
				<div class="bottom">
					<div class="column">
						<div class="row">
							<span class="title">이메일</span>
							<input type="text" name="email" value="${selected_card_detail.card.email == null ? '' : selected_card_detail.card.email}" placeholder="이메일 주소 입력">
						</div>
						<div class="row">
							<span class="title">휴대폰</span>
							<input type="text" name="phone" value="${selected_card_detail.card.phone == null ? '' : selected_card_detail.card.phone}" placeholder="휴대폰 번호 입력">
						</div>
						<div class="row">
							<span class="title">유선전화</span>
							<input type="text" name="landline_phone" value="${selected_card_detail.card.landline_phone == null ? '' : selected_card_detail.card.landline_phone}" placeholder="유선전화 번호 입력">
						</div>
						<div class="row">
							<span class="title">팩스</span>
							<input type="text" name="fax" value="${selected_card_detail.card.fax == null ? '' : selected_card_detail.card.fax}" placeholder="팩스 번호 입력">
						</div>
					</div>
					<div class="column">
						<div class="row">
							<span class="title">주소</span>
							<input type="text" name="address" value="${selected_card_detail.card.address == null ? '' : selected_card_detail.card.address}" placeholder="주소 입력">
							<input type="text" name="sub_address" value="${selected_card_detail.card.sub_address == null ? '' : selected_card_detail.card.sub_address}" placeholder="상세 주소 입력">
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeCardImageTag(img_src, is_front) {
	const div = document.createElement("div");
	div.className = is_front ? "front" : "back";
	div.innerHTML = `
		<img src="${img_src}">
		<div class="buttons">
			<button type="button" class="edit_image">
				<img src="/static/images/card_team_edit_card_image_button.png">
				<span>이미지 편집</span>
			</button>
			<button type="button" class="change_image">
				<img src="/static/images/card_team_replace_card_image_button.png">
				<span>이미지 변경</span>
			</button>
		</div>
	`;
	return div;
}

function makeChangeTeamNameModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_info">
			<div class="title">
				<span>조직명 변경</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<input type="text" name="title" value="${selected_team.title}">
				<span>조직의 명칭은 조직 관리에서 변경할 수 있습니다.<span>
			</div>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">완료</button>
			</div>
		</div>
	`;
	return div;
}

function makeChangeProfileNameModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_info">
			<div class="title">
				<span>사용자 이름 변경</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<input type="text" name="nickname" value="${principal_profile.nickname}">
				<span>조직의 명칭은 조직 관리에서 변경할 수 있습니다.<span>
			</div>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">완료</button>
			</div>
		</div>
	`;
	return div;
}

function makeChangeCardBookNameModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_info">
			<div class="title">
				<span>명함첩 이름 변경</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<input type="text" name="card_book_name" value="${selected_card_book.card_book_name}">
			</div>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">완료</button>
			</div>
		</div>
	`;
	return div;
}

function makeConfirmLeaveTeamModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window leave_team">
			<span class="message">조직에서 나가시겠습니까?</span>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">나가기</button>
			</div>
		</div>
	`;
	return div;
}

function makeErrorToLeaveTeamModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window leave_team">
			<span class="message">탈퇴하기 전에 조직 운영자를 위임해주세요</span>
			<div class="buttons">
				<button type="button" class="confirm_button">확인</button>
			</div>
		</div>
	`;
	return div;
}

function makeConfirmDeleteTeamModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window leave_team">
			<span class="message">팀을 삭제하시겠습니까?</span>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">삭제</button>
			</div>
		</div>
	`;
	return div;
}

function makeAddTeamCardMemoModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_memo">
			<div class="title">
				<span>메모 추가</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<textarea name="contents" placeholder="내용을 입력하세요" rows="4"></textarea>
				<div class="buttons">
					<button type="button" class="cancel_button">취소</button>
					<button type="button" class="submit_button" disabled>추가</button>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeUpdateTeamCardMemoModal(memo) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_memo">
			<div class="title">
				<span>메모 수정</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<span>${memo.update_date.replace("T", " ")}에 마지막 수정</span>
				<span>작성자 : ${memo.nickname}</span>
				<textarea name="contents" placeholder="내용을 입력하세요" rows="4">${memo.contents}</textarea>
				<div class="buttons">
					<button type="button" class="cancel_button">취소</button>
					<button type="button" class="submit_button" disabled>수정</button>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeDeleteConfirmTeamCardMemoModal(memo) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_memo">
			<div class="title">
				<span>메모 삭제</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<h4>메모를 삭제하시겠습니까?</h4>
				<div class="texts">
					<span>${memo.update_date.replace("T", " ")}에 마지막 수정</span>
					<span>작성자 : ${memo.nickname}</span>
				</div>
				<textarea class="disabled" name="contents" placeholder="내용을 입력하세요" rows="4" readonly>${memo.contents}</textarea>
				<div class="buttons">
					<button type="button" class="remove_button">삭제</button>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeChangeGroupModal(selected_card_count) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_group">
			<div class="title">
				<span>그룹 설정</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="group_wrapper">
				<span>선택한 <span class="card_count">${selected_card_count}</span>개의 명함을 아래의 그룹에 추가합니다.</span>
				<div class="group_list">
					
					<button type="button" class="add_new_group">+ 그룹 추가하기</button>
					<div class="insert_group_form hidden">
						<input type="text" name="group_name" placeholder="그룹명 입력">
						<button type="button" class="confirm">확인</button>
						<button type="button" class="cancel">취소</button>
					</div>
				</div>
			</div>
			<div class="buttons">
				<button type="button" class="set_group_button">완료</button>
			</div>
		</div>
	`;
	return div;
}

function makeGroupTagForModal(group_belong_flag) {
	const div = document.createElement("div");
	div.className = "group";
	div.innerHTML = `
		<input type="checkbox" class="group_selector" name="is_checked" ${group_belong_flag.belong_flag ? 'checked' : ''}>
		<span>${group_belong_flag.group_name}</span>
	`;
	return div;
}