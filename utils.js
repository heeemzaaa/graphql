const pages = ['login_page', 'home_page']

function showError(element, errorLogin) {
    element.textContent = errorLogin
    element.style.color = "red"
    element.classList.remove('hidden')
    setTimeout(() => {
        element.classList.add('hidden')
    }, 1000)
}


function showPage(id) {
    pages.forEach((pageID)=> {
        document.getElementById(pageID).style.display = pageID === id ? 'flex' : 'none'
    })
}


function checkAccess() {
    const token = localStorage.getItem('jwt')
    if (!token) {
        showPage('login_page')
    } else {
        showPage('home_page')
    }
}