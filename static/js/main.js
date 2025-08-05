import { renderLogin } from "./login/login.js"
import { renderHome } from "./home/home.js"

// the start is here , checking access first 
document.addEventListener('DOMContentLoaded', () => {
    checkAccess()
})

// if the JWT is setted successfully pass to home page
export const checkAccess = () => {
    const token = localStorage.getItem('jwt')
    if (!token) {
        renderLogin()
    } else {
        renderHome()
    }
}