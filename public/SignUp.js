//Signup Form

function form2() {

    var User_name = $('.User_name').val();
    var User_id = $('.User_id').val();
    var User_password = $('.User_password').val();
    var User_password2 = $('.User_password2').val();
    var User_gender = $('.User_gender').val();
    var User_birth = $('.User_birth').val();
    var User_country = $('.User_country').val();
    var User_nickname = $('.User_nickname').val();

    // 입력받은 정보를 객체로 저장
    var body = {
        User_name: User_name,
        User_nickname: User_nickname,
        User_id: User_id,
        User_password2 : User_password2,
        User_password: User_password,
        User_gender : parseInt(User_gender),
        User_birth : User_birth,
        User_country : User_country
    };

    const header = {"Content-Type": "application/json"}

    axios.post('http://localhost:3000/User/signup', body, {header})
    .then(response => {
        if(response.data.SignUp) {
            alert("회원가입 성공");
            document.location.href = "http://localhost:3000/User/signin";
        } else {
            alert(response.data.message);
        }
    })

    return false;
}

function login() {

    var User_id = $('#User_id').val();
    var User_password = $('#User_password').val();

    var body = {
        User_id : User_id,
        User_password : User_password
    }

    const header = {"Content-Type": "application/json"}

    axios.post('http://localhost:3000/User/signin', body, {header})
    .then(response => {
        if(response.data.loginSuccess) {
            alert("로그인 성공");
            document.location.href = "http://localhost:3000/";
        } else {
            alert("다시 로그인 해주세요");
        }
    })
}