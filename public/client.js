function submitComment(event) {
    event.preventDefault()
    const form = event.target

    fetch('/api/v1/comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            articleID: form.name,
            text: form.children[0].value,
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
}

function upvoteComment(event) {
    event.preventDefault()
    fetch('/api/v1/comment/' + event.target.name + '/upvote', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((data) => data.json())
        .then((result) => {
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
}

window.onload = function () {
    console.log('ready')
    const formElement = document.getElementById('commentForm')
    formElement.addEventListener('submit', submitComment)

    const upvoteButtonElements = document.getElementsByClassName('upvoteButton')
    for (let upvoteButton of upvoteButtonElements) {
        upvoteButton.addEventListener('click', upvoteComment)
    }
}
