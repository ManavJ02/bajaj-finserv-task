import axios from 'axios';

const instance = axios.create({
    baseURL: "https://bajaj-finserv-task-o9op.onrender.com/bfhl",
});

export default instance;