const insight_section = document.querySelector(".insight_section > .insight_list");
let job_section = document.querySelector(".job_section > .job_list");
const subject_section = document.querySelector(".subject_section > .subject_list");

loadCategoryData();

function loadCategoryData() {
	$.ajax({
		type: "get",
		url: "/api/v1/community/categories",
		dataType: "json",
		success: function (category_list) {
			console.log(category_list);
			addLiTags(category_list);
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function addLiTags(category_list) {
	let has_profile = principal?.department_name != null;
	console.log(has_profile);
	if(principal == null || has_profile == true) {
		for(let i = 0; i < category_list.length; i++) {
			const category = category_list[i];
			const li = makeLiTag(category);
			if(category.main_category_id == 1) {
				insight_section.appendChild(li);
			} else if(category.main_category_id == 2) {
				job_section.appendChild(li);
			} else if(category.main_category_id == 3) {
				subject_section.appendChild(li);
			}
			li.onclick = (event) => {
				if(principal != null && event.target.className == "join_button") {
					joinCategoryForAside(event, category.id);
				} else {
					location.href = "/community/" + category.id;
				}
			}
		}
	} else if(has_profile == false) {
		for(let i = 0; i < category_list.length; i++) {
			const category = category_list[i];
			if(category.main_category_id != 2) {
				const li = makeLiTag(category);
				if(category.main_category_id == 1) insight_section.appendChild(li);
				else																subject_section.appendChild(li);
				li.onclick = (event) => {
					if(event.target.className == "join_button") {
						const modal = makeSubmitProfileModal();
						document.querySelector(".container").appendChild(modal);
						document.body.style = "overflow: hidden;";
						modal.querySelector(".close_modal").onclick = () => {
							modal.remove();
							document.body.style = "";
						}
						modal.querySelectorAll("input").forEach(e => e.onblur = () => activeSubmitButton(modal));
						modal.querySelector(".submit_detail").onclick = () => submitProfile(modal);
					} else {
						location.href = "/community/" + category.id;
					}
				}
			}
		}
		const select_job_tag = makeSelectJobTag();
		const new_section = document.createElement("section");
		new_section.className = "job_section";
		new_section.innerHTML = `
			<div class="title">
	            <div class="title_logo">
	                <img src="/static/images/community_aside_job.svg">
	            </div>
	            <span class="accent_text">?????????????? ????????????</span>
	        </div>
		`;
		new_section.appendChild(select_job_tag);
		document.querySelector(".job_section").parentNode.insertBefore(new_section, insight_section.parentElement);
		job_section.parentElement.remove();
	}
}

function makeSelectJobTag() {
	const div = document.createElement("div");
	div.className = "select_job";
	div.innerHTML = `
		<img src="/static/images/community_left_aside_select_job.svg">
		<div class="texts">
			<span class="text bold">?????? ??? ??????????</span>
			<span class="text gray">?????? ??? ?????? ???????????? ????????? ?????????!</span>
		</div>
		<button type="button" class="select_job_modal_button">5????????? ??? ?????? ????????????</button>
	`;
	return div;
}

function joinCategoryForAside(event, category_id) {
	console.log(event.target);
	console.log(category_id);
	$.ajax({
		type: "post",
		url: "/api/v1/community/category/" + category_id,
		dataType: "json",
		success: function (data) {
			console.log(data);
			if(data == true) {
				location.reload();
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function isEmpty(input) {
	if(input.value == null || input.value == "" || typeof input.value == "undefined") {
		return true;
	}
	return false;
}

function checkProfileInputs(modal) {
	if(isEmpty(modal.querySelector("input[name='name']")) ||
		isEmpty(modal.querySelector("input[name='nickname']")) ||
		isEmpty(modal.querySelector("input[name='company_name']")) ||
		isEmpty(modal.querySelector("input[name='department_name']"))) {
			return false;
		}
	return true;
}

function activeSubmitButton(modal) {
	if(checkProfileInputs(modal)) {
		modal.querySelector(".submit_detail").disabled = false;
	} else {
		modal.querySelector(".submit_detail").disabled = true;
	}
}

function submitProfile(modal) {
	console.log({"name":modal.querySelector("input[name='name']").value,
					 "nickname":modal.querySelector("input[name='nickname']").value,
					 "company_name":modal.querySelector("input[name='company_name']").value,
					 "department_name":modal.querySelector("input[name='department_name']").value});
	$.ajax({
		type: "post",
		url: "/api/v1/auth/detail",
		data: {"name":modal.querySelector("input[name='name']").value,
					 "nickname":modal.querySelector("input[name='nickname']").value,
					 "company_name":modal.querySelector("input[name='company_name']").value,
					 "department_name":modal.querySelector("input[name='department_name']").value},
		dataType: "json",
		success: function (data) {
			console.log(data);
			if(data == true) {
				location.reload();
			} else {
				alert("????????? ????????? ??????????????????\n?????? ??????????????????.");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function makeLiTag(category) {
	const li = document.createElement("li");
	li.className = category.main_category_id == 1 ? "insight" : 
								category.main_category_id == 2 ? "job" : "subject";
	li.innerHTML = `
		<div class="button_wrapper">
            <span class="title">${category.category_name}</span>
            <div class="join_info">
	${category.join_flag == true ? '<span class="joining">????????? ??&nbsp;</span>' : ''}
            	<span class="joiner">????????? <span class="joiner_count">${category.join_count}</span>???</span>
        	</div>
        </div>
	${principal != null ? category.join_flag == true ? 
		'<button type="button" class="to_category"><img src="/static/images/community_left_aside_right_arrow.svg"></button>' :
		'<button type="button" class="join_button">????????????</button>' : ''}
	`;
	return li;
}

function makeSubmitProfileModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window profile_form">
			<div class="title">?????? ?????????????????? ????????? ???????????? ???????????????</div>
			<form>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">??????</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="name" placeholder="???: ?????????">
				</div>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">?????????</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="nickname" placeholder="??????, ?????? 8?????? ??????">
				</div>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">??????</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="company_name" placeholder="???: ?????????">
				</div>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">??????</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="department_name" placeholder="???: ????????????">
				</div>
				<span class="text">????????? ????????? ???????????? ????????????????????? ????????? ????????? ??? ????????????.</span>
			</form>
			<div class="buttons">
				<button type="button" class="close_modal">??????</button>
				<button type="button" class="submit_detail" disabled>??????</button>
			</div>
		</div>
	`;
	return div;
}