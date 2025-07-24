// Fetch and Render Dashboard Data with SVG Charts
async function fetchUserData() {
  const token = localStorage.getItem('jwt')
  return await fetchData(USER, {}, token)
}

function createUserInfoHTML(userData) {
  return `
    <section class="user_infos">
      <h1>Welcome ${userData.data.user[0].firstName} ${userData.data.user[0].lastName}</h1>
      <p>Login: <span>${userData.data.user[0].login}</span></p>
      <p>Email: <span>${userData.data.user[0].email}</span></p>
      <p>Campus: <span>${userData.data.user[0].campus}</span></p>
    </section>
  `
}