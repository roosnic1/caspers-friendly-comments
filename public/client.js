function submitComment(form, articleID) {
    const commentText = form.children[0].value
    console.log('text', commentText)
    console.log('id', articleID)

    fetch('/api/v1/comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            articleID,
            text: commentText,
        }),
    })
        .then((data) => data.json())
        .then((result) => {
            form.reset()
            location.reload()
        })
        .catch((error) => {
            console.warn('error while commenting', error)
        })
    return true
}

function upvoteComment(commentID) {
    fetch('/api/v1/comment/' + commentID + '/upvote', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((data) => data.json())
        .then((result) => {
            console.log('upvote', result)
            const commentElement = document.getElementById(result.id)
            const upvoteElement =
                commentElement.getElementsByClassName('commentUpvotes')[0]
            upvoteElement.innerHTML = result.upvotes + ' ♥'
            upvoteElement.parentElement.classList.toggle('animate-pulse')
            setTimeout(() => {
                upvoteElement.parentElement.classList.toggle('animate-pulse')
            }, 2000)
        })
        .catch((error) => {
            console.warn('error while upvoting', error)
        })
    return true
}

window.onload = function () {
    console.log('ready')
}
