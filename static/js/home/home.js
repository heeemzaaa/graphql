

function renderHome() {
    document.body.innerHTML = ''

    document.body.innerHTML = `
    <main id="home_page">
      <nav class="navBar">
        <button id="logout">logout</button>
      </nav>

      <section class="user_infos">

      </section>

      <section class="charts">
        <div class="first_chart"></div>
        <div class="second_chart"></div>
      </section>

      <section class="infos">
      
      </section>
    </main>
  `;

  console.log('user', user);

  // Add logout click event
  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('jwt');
    checkAccess();
  });
}
