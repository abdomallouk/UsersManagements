
const deleteButtons = document.querySelectorAll('.delete-user');

deleteButtons.forEach(button => {
    button.addEventListener('click', e => {
    e.preventDefault();
    e.currentTarget.parentElement.parentElement.remove()
    
    const userId = button.getAttribute('data-userId');

    fetch(`/deleteUser/${userId}`, {
        method: 'DELETE',
    })
        .then(response => {
        if (response.status === 204) {
            const cardToRemove = button.closest('.blog-content');
            if (cardToRemove) {
            cardToRemove.remove();
            }
        } else {
            console.error('Error deleting blog:', response.statusText);
        }
        })
        .catch(error => {
        console.error('Error deleting blog:', error);
        });
    });
});







const sendButtons = document.querySelectorAll('.send-info');

sendButtons.forEach(button => {
    button.addEventListener('click', e => {
    e.preventDefault();
        
    const userId = button.getAttribute('data-userId');

    console.log(userId)

    fetch(`/sendInfo/${userId}`, {
        method: 'GET',
    })
        .then(response => {
            // console.log(response)
            alert('The user Infomartion are Sent Successfully')
        }
        )
        .catch(error => {
        console.error('Error Sending info:', error);
        });
    });
});

