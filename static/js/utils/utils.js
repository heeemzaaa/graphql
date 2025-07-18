function fetchData(query, arg = null, token) {
    const res = fetch(url_data, {
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
    return res
}