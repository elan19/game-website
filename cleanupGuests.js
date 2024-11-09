require('dotenv').config();

const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = process.env.MONGODB_URL;  // Replace with your actual MongoDB URI

async function cleanupExpiredGuestData() {
  const client = new MongoClient(uri, {});

  try {
    await client.connect();
    const db = client.db("test");  // Replace with your actual database name
    const oneDayAgo = new Date(Date.now() - 24 );  // 24 hours ago

    // Find guest users who are expired
    const expiredGuests = await db.collection("users").find({
      isGuest: true,
      createdAt: { $lt: oneDayAgo }
    }).toArray();

    for (const guest of expiredGuests) {
      const userId = guest._id;
      const username = guest.username;

      // 1. Remove the guest user from the `friends` array in other users' documents
      await db.collection("users").updateMany(
        { friends: username },  // Find users where the guest is in the friends array
        { $pull: { friends: username } }  // Remove the guest from the friends array
      );

      // 2. Delete any comments made by the guest user
      /*const usersWithGuestComments = await db.collection("users").find({
        comments: { $elemMatch: { 0: username } }
      }).toArray();

      // 3. For each user who has a comment with the guest's username, remove those comments
      for (const user of usersWithGuestComments) {
        const updatedComments = user.comments.filter(comment => comment[0] !== username);

        // Update the user document with the filtered comments array
        await db.collection("users").updateOne(
          { _id: user._id },
          { $set: { comments: updatedComments } }
        );
      }*/

      // 3. Delete related data in other collections
      await db.collection("market_items").deleteMany({ username });  // Remove market items with guest username

      await db.collection("chats").deleteMany({
        $or: [{ _id: { $regex: `^${username}-` } }, { _id: { $regex: `-${username}$` } }]
      });

      // 3. Remove guest's profile comments from other users' data
      await db.collection("users").updateMany(
        { "profileComments.userId": userId },
        { $pull: { profileComments: { userId: userId } } }
      );

      // 4. Delete discussions authored by the guest user and their comments
      await db.collection("discussions").deleteMany({ authorId: userId });

      // 4.1 Remove the guest's comments from discussions
      await db.collection("discussions").updateMany(
        { "comments.authorId": userId },
        { $pull: { comments: { authorId: userId } } }
      );

      // 5. Finally, delete the guest user
      await db.collection("users").deleteOne({ _id: userId });

      console.log(`Deleted guest user ${username} and all related data.`);
    }
  } catch (error) {
    console.error("Error cleaning up guest data:", error);
  } finally {
    await client.close();
  }
}

cleanupExpiredGuestData();
