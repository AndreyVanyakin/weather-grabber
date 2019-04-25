const axios = require('axios');


module.exports =  (URL, KEY, QUERY) => {
    return axios.get(`${URL}${KEY}&q=${QUERY}`)
        .then(res => res.data)
        .catch(err => console.error(err))
};

