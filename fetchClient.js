import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const fetchClient = (() => {
    const getAuthToken = async () => {
        try {
            return "Bearer " + await firebase.auth().currentUser?.getIdToken()
        } catch(err) {
            console.log("getAuthToken", err)
        }
    }

    const instance = axios.create({
        baseURL: 'https://westworld.ai-showcase.stg.adlt.dev'
    });

    instance.interceptors.request.use(async (config) => {
        config.headers.Authorization = await getAuthToken()
        return config
    })

    return instance
})()

export default fetchClient
