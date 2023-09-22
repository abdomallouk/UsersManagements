document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault(); 
  
    const searchInput = document.getElementById('searchInput').value;

    // console.log(searchInput)

    try {
        const response = await fetch(`/searchUser?query=${searchInput}`, {
          method: 'GET',
        });
    
        if (response.ok) {
          const data = await response.json();
        } else {
          console.error('Server responded with an error:', response.status);
        }
      } catch (error) {
        console.error('Error sending request:', error);
      }
  
});
  