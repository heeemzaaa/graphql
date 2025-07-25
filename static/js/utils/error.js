export function showError(element, errorLogin) {
    element.textContent = errorLogin
    element.style.color = "red"
    element.classList.remove('hidden')
    setTimeout(() => {
        element.classList.add('hidden')
    }, 5000)
}