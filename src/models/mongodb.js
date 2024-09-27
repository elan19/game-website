import * as Realm from "realm-web";

const MongoDbModel = {

    getRealmApp: function getRealmApp() {
        const REALM_APP_ID = process.env.REACT_APP_REALM_ID;
        return new Realm.App({ id: REALM_APP_ID });
    },

    getCurrentUser: async function getCurrentUser() {
        const app = this.getRealmApp();
        if (app.currentUser) {
            // Return the currently logged-in user
            return app.currentUser;
        } else {
            // Log in anonymously if no user is logged in
            const cred = Realm.Credentials.anonymous();
            const user = await app.logIn(cred);
            return user;
        }
    },

    // Call the rate-limiting function here before proceeding
    checkRateLimit: async function checkRateLimit(ipAddress) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.rateLimit(ipAddress);
            return response;
        } catch (error) {
            console.error("Rate limit exceeded:", error.message);
            throw new Error("Rate limit exceeded. Please try again later.");
        }
    },

    getAllUsers: async function getAllUsers() {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getAllUsers();
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getOneUser: async function getOneUser(userN, loginId) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getOneUser(userN, loginId);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getUserProfile: async function getUserProfile(userN) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getUserProfile(userN);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    registerUser: async function registerUser(userN, passw, email) {
        try {
            const user = await this.getCurrentUser();
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
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.loginUser({ 
                username: userN, 
                password: passw
            });
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    logoutUser: async function logoutUser(userN, loginId) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.logoutUser(userN, loginId);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    updateUserMoney: async function updateUserMoney(userN, amount) {
        try {
            const user = await this.getCurrentUser();
            const roundedAmount = parseFloat(amount.toFixed(2));
            const response = await user.functions.updateUserMoney(userN, roundedAmount);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    editUser: async function editUser(userN, data) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.updateUser({
                username: userN,
                name: data.name,
                desc: data.desc,
                profilePic: data.profilePic
            });
            return response;
        } catch (error) {
            console.error("Error updating user:", error);
        }
    },

    purchaseGame: async function purchaseGame(userN, amount, game) {
        try {
            const user = await this.getCurrentUser();
            const roundedAmount = parseFloat(amount.toFixed(2));
            const response = await user.functions.purchaseGame({
                username: userN,
                amount: roundedAmount,
                game: game
            });
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    updateUserInventory: async function updateUserInventory(username, loginId, gameName, cardName, cardDesc, cardPic) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.addCardToInventory(username, loginId, gameName, cardName, cardDesc, cardPic);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getAllGamesFromUser: async function getAllGamesFromUser(userN) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getAllGamesFromUser(userN);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getAllMarketItems: async function getAllMarketItems() {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getAllMarketItems();
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    setCardToMarket: async function setCardToMarket(username, loginId, gameIndex, cardName, price) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.setCardToMarket(username, loginId, gameIndex, cardName, price);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getUserComments: async function getUserComments(username) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getComments(username);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    addUserComment: async function addUserComment(username, loginid, author, comment) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.addComment(username, loginid, author, comment);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    sendFriendRequest: async function sendFriendRequest(sender, recipient) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.addFriendRequest(sender, recipient);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    friendRequestAction: async function friendRequestAction(sender, recipient, action) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.friendRequestAction(sender, recipient, action);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getFriendRequests: async function getFriendRequests(username) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getFriendRequests(username);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
    },
};

export default MongoDbModel;
