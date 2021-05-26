function modifyMyInfo() {

    var User_name = $('.User_name').val();
    var User_nickname = $('.User_nickname').val();
    var User_gender = $('.User_gender').val();
    var User_birth = $('.User_birth').val();
    var prefer_nation1 = $('.prefer_nation1').val();
    var prefer_nation2 = $('.prefer_nation2').val();
    var prefer_nation3 = $('.prefer_nation3').val();

    var body = {
        User_name: User_name,
        User_nickname: User_nickname,
        User_gender: parseInt(User_gender),
        User_birth: User_birth,
        prefer_nation1: prefer_nation1,
        prefer_nation2: prefer_nation2,
        prefer_nation3: prefer_nation3
    }

    console.log(body)

    const header = { "Content-Type": "application/json" }

    axios.post('http://localhost:3000/MyPage/modifymyinfo', body, { header })
        .then(response => {
            if (response.data.ModifyInfoDone) {
                alert("회원정보 수정 완료");
                document.location.href = "http://localhost:3000/User/MyPage";
            } else {
                alert(response.data.message);
            }
        })
    return false;
}

function rejectApply() {

    var Pa_code = $('.Pa_code').val();

    var body = {
        Pa_code: Pa_code,
    }

    console.log("어플라이피드 코드 : ", body);

    const header = { "Content-Type": "application/json" }

    axios.post('http://localhost:3000/MyPage/rejectApply', body, { header })
        .then(response => {
            if (response.data.rejectApplyDone) {
                alert("거절했습니다.");
                document.location.href = "/";
            } else {
                alert(response.data.message);
            }
        })
    return false;
}


function acceptApply() {

    var Pa_code = $('.Pa_code').val();

    var body = {
        Pa_code: Pa_code,
    }

    const header = { "Content-Type": "application/json" }

    axios.post('http://localhost:3000/MyPage/acceptApply', body, { header })
        .then(response => {
            if (response.data.acceptApplyDone) {
                alert("수락하셨습니다.");
                document.location.href = "/";
            } else {
                alert(response.data.message);
            }
        })
    return false;
}

function toMyReply() {

    var Pa_code = $('.Pa_code').val();

    var body = {
        Pa_code: Pa_code,
    }

    const header = { "Content-Type": "application/json" }

    axios.post('http://localhost:3000/MyPage/acceptApply', body, { header })
        .then(response => {
            if (response.data.acceptApplyDone) {
                alert("수락하셨습니다.");
                document.location.href = "/";
            } else {
                alert(response.data.message);
            }
        })
    return false;
}