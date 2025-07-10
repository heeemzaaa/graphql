const UsernameOrEmail = document.getElementById('data')
const Password = document.getElementById('password')
const submit = document.getElementById('submit')
const errorLogin = document.getElementById('errorLogin')


submit.addEventListener('click', async (e) => {
    e.preventDefault()

    let usernameOrEmail = UsernameOrEmail.value
    let password = Password.value
    let userData = btoa(usernameOrEmail + ":" + password)

    const options = {
        method: "POST",
        headers: {
            'authorization': 'basic ' + userData,
        }
    }

    try {
        let res = await fetch("https://learn.zone01oujda.ma/api/auth/signin", options)
        if (!res.ok) {
            console.error("Failed to login !")
        }

        let token = await res.json()

        console.log(token)

        if (token.error) {
            showError(errorLogin, token.error)
            return
        } else {
            localStorage.setItem('jwt', token)
            showPage('home_page')
        }
    } catch (err) {
        console.error(err)
    }
})



