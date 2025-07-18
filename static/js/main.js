document.addEventListener('DOMContentLoaded', () => {
    checkAccess()
})

function checkAccess() {
    const token = localStorage.getItem('jwt')
    if (!token) {
        renderLogin()
    } else {
        renderHome()
    }
}