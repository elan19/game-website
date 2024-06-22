import * as Realm from "realm-web";

const MongoDbModel = {

    getAllUsers: async function getAllUsers() {
        const REALM_APP_ID = process.env.REACT_APP_REALM_ID;
        const app = new Realm.App({ id: REALM_APP_ID });
        const cred = Realm.Credentials.anonymous();
        try {
        const user = await app.logIn(cred);
        const response = await user.functions.getAllUsers();
        console.log(response);
        //const allUsers = response.json();

        return response;

        } catch (error) {
        console.error(error);
        }
    },

    getOneUser: async function getOneUser(userN) {
        const REALM_APP_ID = process.env.REACT_APP_REALM_ID;
        const app = new Realm.App({ id: REALM_APP_ID });
        const cred = Realm.Credentials.anonymous();
        try {
            console.log(userN);
            const user = await app.logIn(cred);
            const response = await user.functions.getOneUser(userN);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    registerUser: async function registerUser(userN, passw, email) {
        const REALM_APP_ID = process.env.REACT_APP_REALM_ID;
        const app = new Realm.App({ id: REALM_APP_ID });
        const cred = Realm.Credentials.anonymous();
        try {
            const user = await app.logIn(cred);
            const response = await user.functions.registerUser({
                email: email, 
                username: userN, 
                password: passw
            });

            return response;
        } catch (error) {
            console.error(error);
        }
    },

    loginUser: async function loginUser(userN, passw) {
        const REALM_APP_ID = process.env.REACT_APP_REALM_ID;
        const app = new Realm.App({ id: REALM_APP_ID });
        const cred = Realm.Credentials.anonymous();
        try {
            const user = await app.logIn(cred);
            const response = await user.functions.loginUser({ 
                username: userN, 
                password: passw
            });

            return response;
        } catch (error) {
            console.error(error);
        }
    }

};

export default MongoDbModel;