function warnEmpty() {
    alert("Enter a Input!!");
}

function dateToString(date) {
    const dateString = date.toISOString();
    const dateToString = dateString.substring(0, 10) + " " + dateString.substring(11, 19);
    return dateToString;
}

function submitComment() {
    const newcommentEL = document.getElementById("new-comment_feed");
    const newcomment = newcommentEL.value.trim();

    if (newcomment) {
        const dateEL = document.createElement('div');
        dateEL.classList.add("commnet-data_feed");
        const dateString = dateToString(new Date());
        dateEL.innerText = dateString;

        const contestEL = document.createElement('div');
        contentEL.classList.add('comment-content_feed');
        contentEL.innerText = newcomment;

        const commentEL = document.createElement('div');
        commentEL.classList.add('comment-row_feed');
        commentEL.appendChild(dateEL);
        commentEL.appendChild(contentEL);

        document.getElementById('comments_feed').appendChild(commentEL);
        newcommentEL.value = "";
    } else warnEmpth();
}