//Signup Form

function wrtiepid() {

    var Pid_title = $('.Pid_title').val();
    var Pid_content = $('.Pid_content').val();
    var Pid_dday = $('.Pid_dday').val();
    var Pid_recruitNumber = $('.Pid_recruitNumber').val();
    var Pid_religion = $('.Pid_religion').val();

    // 입력받은 정보를 객체로 저장
    var body = {
        //User_code: User_code,
        Pid_title: Pid_title,
        Pid_content: Pid_content,
        Pid_dday: Pid_dday,
        Pid_recruitNumber: parseInt(Pid_recruitNumber),
        Pid_religion: Pid_religion
    };

    const header = { "Content-Type": "application/json" }

    axios.post('http://localhost:3000/Pid/writepid', body, { header })
        .then(response => {
            if (response.data.WritePidDone) {
                alert("글이 등록되었습니다.");
                document.location.href = "/"; // 작성된 게시글로 바로 이동
            } else {
                alert(response.data.message);
            }
        })

    return false;
}


function goodUp() {

    var Pid_code = $('.pid_code').val();
    var Pid_good = $('.pid_good').val();

    // 입력받은 정보를 객체로 저장
    var body = {
        Pid_code: Pid_code,
        Pid_good: Pid_good
    };

    const header = { "Content-Type": "application/json" }

    axios.post('http://localhost:3000/Pid/GoodUp', body, { header })
        .then(response => {
            if (response.data.GoodUpDone) {
                alert("좋아요 상승.");
            } else {
                alert(response);
            }
        })

    return false;
}