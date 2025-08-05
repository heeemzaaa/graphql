import { url_data } from "./variables.js"
import { checkAccess } from "../main.js"
import { renderLogin } from "../login/login.js"

// global function to fetch the data 
export async function fetchData(query, variables = null, token) {
    if (!token) {
        console.error('No token provided to fetchData!')
        return
    }

    const res = await fetch(url_data, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
        }),
    })

    let data = await res.json()

    let access = invalidJWT(data)

    if (access) {
        renderLogin()
        return
    } 
    return data
}

// case of invalid jwt redirecting to loging page 
export function invalidJWT(data) {
    let error = data.errors? data.errors[0] : null
    if (error) {
        return error.extensions.code === "invalid-jwt"
    }
    return false
}

// logout handler , if click go to login page
export function setupEventListeners() {
  const logoutButton = document.getElementById('logout')
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('jwt')
    checkAccess()
  })
}
