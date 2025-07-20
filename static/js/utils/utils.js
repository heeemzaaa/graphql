async function fetchData(query, token, arg = null) {
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
            arg: arg,
        }),
    })

    return res.json()
}