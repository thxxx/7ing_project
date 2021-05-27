function WriteActivity() {

    var At_title = $('.At_title').val();
    var At_content = $('.At_content').val();
    var At_recruitNumber = $('.At_recruitNumber').val();
    var At_place = $('.At_place').val();
    var At_price = $('.At_price').val();

    // 입력받은 정보를 객체로 저장
    var body = {
        At_title: At_title,
        At_content: At_content,
        At_recruitNumber: parseInt(At_recruitNumber),
        At_place: At_place,
        At_price: parseInt(At_price)
    };

    const header = { "Content-Type": "application/json" }

    axios.post('http://localhost:3000/Activity/WriteActivity', body, { header })
        .then(response => {
            if (response.data.WriteActivityDone) {
                alert("액티비티 글이 등록되었습니다.");
                document.location.href = "/"; // 작성된 게시글로 바로 이동
            } else {
                alert(response.data.message);
            }
        })

    return false;
}


function applyActivity() {

    var At_code = $('.At_code').val();

    var body = {
        At_code: At_code
    }

    console.log("동행신청 액티비티 코드 : ", body);

    const header = { "Content-Type": "application/json" }

    axios.post('http://localhost:3000/Activity/applyActivity', body, { header })
        .then(response => {
            if (response.data.ApplyActivityDone) {
                alert("동행신청 완료");
                document.location.href = '/Activity';
            } else {
                alert("이미 인원 모집이 완료되었습니다");
                document.location.href = '/Activity';
            }
        })
}


function likeUp() {

    var At_code = $('.At_code').val();
    var At_good = $('.At_good').val();

    // 입력받은 정보를 객체로 저장
    var body = {
        At_code: At_code,
        At_good: At_good
    };

    console.log("바디", body);

    const header = { "Content-Type": "application/json" }

    axios.post('http://localhost:3000/Activity/likeUp', body, { header })
        .then(response => {
            if (response.data.LikeUpDone) {
                alert("좋아요 상승.");
                document.location.href = '/'; // 지금은 무조건 main Page로 돌아간다. 나중에 수정 필요
            } else {
                alert(response);
            }
        })

    return false;
}


function payforactivity() {

    var At_code = $('.At_code').val();

    // 입력받은 정보를 객체로 저장
    var body = {
        At_code: At_code
    };

    const header = { "Content-Type": "application/json" }

    axios.post('http://localhost:3000/Activity/Payforactivity', body, { header })
        .then(response => {
            if (response.data.ApplyActivityDone) {
                alert("결제완료.");
                document.location.href = '/'; // 지금은 무조건 main Page로 돌아간다. 나중에 수정 필요
            } else {
                alert("인원이 꽉 찼습니다");
            }
        })

    return false;
}