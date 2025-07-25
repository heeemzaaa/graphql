import { renderLogin } from "./login/login.js"
import { renderHome } from "./home/home.js"

document.addEventListener('DOMContentLoaded', () => {
    checkAccess()
})

export const checkAccess = () => {
    const token = localStorage.getItem('jwt')
    if (!token) {
        renderLogin()
    } else {
        renderHome()
    }
}