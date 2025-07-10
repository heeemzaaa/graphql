const logoutButton = document.getElementById('logout')


logoutButton.addEventListener('click' , () => {
    localStorage.removeItem('jwt')
    checkAccess()
})