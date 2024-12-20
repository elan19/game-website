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

    buyMarketItem: async function buyMarketItem(buyerUsername, buyerLoginId, marketItemId) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.buyMarketItem(buyerUsername, buyerLoginId, marketItemId);
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
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    sendFriendRequest: async function sendFriendRequest(sender, recipient) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.addFriendRequest(sender, recipient);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    friendRequestAction: async function friendRequestAction(sender, recipient, action) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.friendRequestAction(sender, recipient, action);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getFriendRequests: async function getFriendRequests(username) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getFriendRequests(username);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getUserFriends: async function getUserFriends(username) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getUserFriends(username);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    removeFriend: async function removeFriend(username, loginId, userToRemove) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.removeFriend(username, loginId, userToRemove);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getLastClaimDate: async function getLastClaimDate(userN, loginId) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getLastClaimDate(userN, loginId);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getAllDiscussions: async function getAllDiscussions() {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getAllDiscussions();
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getDiscussionById: async function addDigetDiscussionByIdscussion(discussionId) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getDiscussionById(discussionId);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    addDiscussion: async function addDiscussion(newDiscussion, userN, loginId) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.addDiscussion(newDiscussion, userN, loginId);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    editDiscussion: async function editDiscussion(discussionId, updatedDiscussion, userN, loginId) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.editDiscussion(discussionId, updatedDiscussion, userN, loginId);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    addCommentToDiscussion: async function addCommentToDiscussion(discussionId, commentData) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.addCommentToDiscussion(discussionId, commentData.content, commentData.author, commentData.loginId);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    rewardCard: async function rewardCard(username, loginId, gameId) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.rewardCard(username, loginId, gameId);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    sendPrivateMessage: async function sendPrivateMessage(username, loginId, text) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.sendPrivateMessage(username, loginId, text);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    getMessages: async function getMessages(user1, user2) {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.getMessages(user1, user2);
            return response;
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    },

    loginGuestUser: async function loginGuestUser() {
        try {
            const user = await this.getCurrentUser();
            const response = await user.functions.loginGuestUser();
            return response;
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    },
    
};

export default MongoDbModel;