import { url_data } from "./variables.js"
import { checkAccess } from "../main.js"

export async function fetchData(query, variables = null, token) {
    if (!token) {
        console.error('❌ No token provided to fetchData!')
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

    return res.json()
}

export function setupEventListeners() {
  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('jwt');
    checkAccess();
  });
}
