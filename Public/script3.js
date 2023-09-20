
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

