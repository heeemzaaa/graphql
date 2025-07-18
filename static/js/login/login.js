function renderLogin() {
    document.body.innerHTML = ''

    // hna ncreeyew login section
    const loginSection = document.createElement('section')
    loginSection.id = 'login_page'

    const form = document.createElement('form')
    form.setAttribute('action', '')

    // Username/email label and input
    const p1 = document.createElement('p')
    const span1 = document.createElement('span')
    span1.textContent = 'Username or Email'
    p1.appendChild(span1)

    const inputData = document.createElement('input')
    inputData.id = 'data'
    inputData.type = 'text'
    inputData.placeholder = 'insert email or username'
    inputData.required = true

    // Password label and input
    const p2 = document.createElement('p')
    const span2 = document.createElement('span')
    span2.textContent = 'Password'
    p2.appendChild(span2)

    const inputPassword = document.createElement('input')
    inputPassword.id = 'password'
    inputPassword.type = 'password'
    inputPassword.placeholder = 'insert password'
    inputPassword.required = true

    // Submit button
    const submitBtn = document.createElement('button')
    submitBtn.id = 'submit'
    submitBtn.textContent = 'Login'

    // Error message
    const errorP = document.createElement('p')
    errorP.id = 'errorLogin'
    errorP.classList.add('hidden')

    // Append all to form
    form.appendChild(p1)
    form.appendChild(inputData)
    form.appendChild(p2)
    form.appendChild(inputPassword)
    form.appendChild(submitBtn)
    form.appendChild(errorP)

    // Append form to login section
    loginSection.appendChild(form)

    document.body.appendChild(loginSection)

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
                renderHome()
            }
        } catch (err) {
            console.error(err)
        }
    })
}



