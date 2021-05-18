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
            document.location.href = "/";
        } else {
            alert(response.data.message);
        }
    })

    return false;
}