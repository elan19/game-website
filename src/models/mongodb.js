import * as Realm from "realm-web";

const MongoDbModel = {

    getAllUsers: async function getAllUsers() {
        const REALM_APP_ID = process.env.REACT_APP_REALM_ID;
        const app = new Realm.App({ id: REALM_APP_ID });
        const cred = Realm.Credentials.anonymous();
        try {
        const user = await app.logIn(cred);
        const response = await user.functions.getAllUsers();

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
            const user = await app.logIn(cred);
            const response = await user.functions.getOneUser(userN);
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
    },

    updateUserMoney: async function updateUserMoney(userN, amount) {
        const REALM_APP_ID = process.env.REACT_APP_REALM_ID;
        const app = new Realm.App({ id: REALM_APP_ID });
        const cred = Realm.Credentials.anonymous();
        try {
            const user = await app.logIn(cred);

            const roundedAmount = parseFloat(amount.toFixed(2));
            const response = await user.functions.updateUserMoney(userN, roundedAmount);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    editUser: async function editUser(userN, data) {
        const REALM_APP_ID = process.env.REACT_APP_REALM_ID;
        const app = new Realm.App({ id: REALM_APP_ID });
        const cred = Realm.Credentials.anonymous();
    
        try {
            const user = await app.logIn(cred);
    
            // You no longer need to round amounts here unless specifically for money-related updates.
            const response = await user.functions.updateUser({
                username: userN,
                name: data.name,
                desc: data.desc,
            });
            return response;
        } catch (error) {
            console.error("Error updating user:", error);
        }
    },
    

    purchaseGame: async function purchaseGame(userN, amount, game) {
        const REALM_APP_ID = process.env.REACT_APP_REALM_ID;
        const app = new Realm.App({ id: REALM_APP_ID });
        const cred = Realm.Credentials.anonymous();
        try {
            const mongodb = await app.logIn(cred);

            const roundedAmount = parseFloat(amount.toFixed(2));
            const response = await mongodb.functions.purchaseGame({
                username: userN,
                amount: roundedAmount,
                game: game
            });
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getAllGamesFromUser: async function getAllGamesFromUser(userN) {
        const REALM_APP_ID = process.env.REACT_APP_REALM_ID;
        const app = new Realm.App({ id: REALM_APP_ID });
        const cred = Realm.Credentials.anonymous();
        try {
            const user = await app.logIn(cred);
            const response = await user.functions.getAllGamesFromUser(userN);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

};

export default MongoDbModel;