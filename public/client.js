/* global React, ReactDOM */

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
            ...(form.getAttribute('pcid')
                ? { parentCommentID: form.getAttribute('pcid') }
                : {}),
        }),
    })
        .then((data) => data.json())
        .then(() => {
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
    const commentFormElements = document.getElementsByClassName('commentForm')
    for (let commentForm of commentFormElements) {
        commentForm.addEventListener('submit', submitComment)
    }

    const e = React.createElement
    class Upvote extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                upvotes: props.upvotes,
                commentID: props.commentID,
            }
        }

        componentDidMount() {
            if (!document['__websocket']) {
                document['__websocket'] = new WebSocket(
                    `${location.protocol === 'https' ? 'wss' : 'ws'}://${
                        location.host
                    }/ws`
                )
            }
            this.ws = document['__websocket']
            this.ws.addEventListener('open', () => {
                this.ws.send(
                    JSON.stringify({
                        text: 'hello',
                        commentID: this.state.commentID,
                    })
                )
            })
            this.ws.addEventListener('message', (event) => {
                try {
                    const data = JSON.parse(event.data)
                    if (data.type === 'error') {
                        console.warn(data.message)
                    } else if (data.type === 'upvote') {
                        if (data.commentID === this.state.commentID) {
                            this.setState({
                                ...this.state,
                                upvotes: data.upvotes,
                            })
                        }
                    } else {
                        console.log('data', data)
                    }
                } catch (error) {
                    console.error('could not parse server message', error)
                }
            })
        }

        upvote() {
            this.ws.send(
                JSON.stringify({
                    type: 'upvote',
                    commentID: this.state.commentID,
                })
            )
        }

        render() {
            return [
                e(
                    'p',
                    {
                        className: 'inline commentUpvotes',
                        key: 'upvoteDisplay',
                    },
                    `${this.state.upvotes} ♥`
                ),
                e(
                    'button',
                    {
                        onClick: this.upvote.bind(this),
                        className: 'ml-4 upvoteButton',
                        key: 'upvoteButton',
                    },
                    'Like'
                ),
            ]
        }
    }

    const upvoteDisplayElements =
        document.getElementsByClassName('upvoteDisplay')
    for (let upvoteDisplay of upvoteDisplayElements) {
        const root = ReactDOM.createRoot(upvoteDisplay)
        root.render(
            e(Upvote, {
                commentID: upvoteDisplay.getAttribute('name'),
                upvotes: upvoteDisplay.getAttribute('upvotes'),
            })
        )
    }
}
