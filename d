[33mcommit 0ee974ae9fb4bb73a77411704b79f40251fd936f[m[33m ([m[1;36mHEAD -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m)[m
Author: elan19 <elan19@github.com>
Date:   Thu Oct 3 22:25:39 2024 +0200

    Fixed inventory style and responsiveness for mobile users

[33mcommit 27ff2539fb171dae0c2b686b6f6ca67b099c8de2[m
Author: elan19 <elan19@github.com>
Date:   Tue Oct 1 22:24:20 2024 +0200

    Changed the database structure about Cards in Inventory/market and how they travel between user inventory and the marketplace. Also started to fix the responsiveness for mobile users in notification and profile

[33mcommit 2674294181847c27d1a335c7720612868154f1f1[m
Author: elan19 <elan19@github.com>
Date:   Sun Sep 29 22:18:10 2024 +0200

    Updated the friendlist/profilecard for a more effiecient solution. Also fixed a problem with the fetching while hovering a friend in friendlist, before the userData got changed which is used to show the money in navbar, but its fixed now.

[33mcommit 4ee94bc7368796a6570cce4b1cfd83d4f0213735[m
Author: elan19 <elan19@github.com>
Date:   Sun Sep 29 12:55:19 2024 +0200

    Fixed so user can go into friends on his profile and see all the friends in his friendlist. Can also see them online or offline... Next thing is to make it so user can delete a friend from his friendlist

[33mcommit 706b6bd25998fa1edd3049a8b1b2f5ee45fed306[m
Author: elan19 <elan19@github.com>
Date:   Sat Sep 28 00:23:00 2024 +0200

    Fixed so user can send/accept and decline friend request, also updated profile responsiveness by comments/notification update. Up next so profile/friends route so users can see which friends each user got

[33mcommit a6d20d6e444e6ee417d74edc20e34fea89ebecb4[m
Author: elan19 <elan19@github.com>
Date:   Thu Sep 26 22:22:21 2024 +0200

    Added so user can put item on marketplace. Cannot cancel the order as of now. Also added so users can write comments on each others profiles.

[33mcommit 5d8e25790c07e55192651a89395ee154c2cddbe3[m
Author: elan19 <elan19@github.com>
Date:   Sun Sep 22 22:13:32 2024 +0200

    Fixed edit-profile so user can change profile pic, also responsive. Fixed polish responsive on profile. Added pics to a few inventory cards user can get.

[33mcommit a9fc2a4a7e8754f19744e4065bf198d3c4b99539[m
Author: elan19 <elan19@github.com>
Date:   Sat Sep 21 16:03:11 2024 +0200

    Added a safety limit for requests and changed the way cards get generated ingame

[33mcommit c83cb9dd15e40027a23357ed892f345be19afae9[m
Author: elan19 <elan19@github.com>
Date:   Thu Sep 19 22:32:33 2024 +0200

    Fixed localStorage problem with exceeded Quota, problem was mongodb logIn

[33mcommit 25f27b258da95d6a21f511ede81cf67652acfe67[m
Author: elan19 <elan19@github.com>
Date:   Wed Sep 18 19:40:36 2024 +0200

    Started with game session where the user can get cards to his inventory

[33mcommit 021ce706ce670ee181694642f12ebc386b1f3db0[m
Author: elan19 <elan19@github.com>
Date:   Mon Sep 16 22:40:57 2024 +0200

    New push

[33mcommit fd99cb910877e7de902656634383e95fd5362d70[m
Author: elan19 <elan19@github.com>
Date:   Mon Sep 16 19:36:25 2024 +0200

    Started with the inventory view/component of on the profile, made it possible to see all the items an user have

[33mcommit 805d9c2a0392aab93100f3b5ce008f55d1288e95[m
Author: elan19 <elan19@github.com>
Date:   Sun Sep 15 22:32:34 2024 +0200

    Fixed so user can click on other profiles after searching for them in Social route

[33mcommit ac07c6bc1337f41e924e1617a9050a6b28c74d0f[m
Author: elan19 <elan19@github.com>
Date:   Sat Sep 14 16:32:55 2024 +0200

    Fixed some errors and started with edit profile. Not done

[33mcommit 2a3bdffb71e556f5ae1970832713422a78e0e486[m
Author: elan19 <elan19@github.com>
Date:   Sat Sep 14 12:25:48 2024 +0200

    Fixed more secured passwords for user with hash and salt, and fixed some code errors

[33mcommit b1cb1b095bdfe9bde439b58118cab2382eb69e52[m
Author: elan19 <elan19@github.com>
Date:   Wed Sep 11 19:49:42 2024 +0200

    Added so in /social the user can search for usernames, later fix is to make it possible to click the results

[33mcommit 7590e17395566009f74d5379316ae48fa116eb31[m
Author: elan19 <elan19@github.com>
Date:   Wed Sep 11 19:06:49 2024 +0200

    Added library and fixed so when user already have a game, the game-info should look differently

[33mcommit 3c5b6ee41a914c11509ca76426333dc155e44479[m
Author: elan19 <elan19@github.com>
Date:   Fri Sep 6 23:16:36 2024 +0200

    Fixed navbar again, had problem with the dropdownmenu on 'Gemenskap' while clicked. Also fixed so the user can add money in profile and buy games from game-info

[33mcommit 3ae220b47f3504a8e439c59dd20faf4716e20179[m
Author: elan19 <elan19@github.com>
Date:   Sun Sep 1 17:54:00 2024 +0200

    Added dropdown menu for Gemenskap to add new links in a smooth way + started with edit profile

[33mcommit 7b39d765f722031fa40e6f11a4710a6d514d0cf5[m
Author: elan19 <elan19@github.com>
Date:   Wed Aug 7 18:21:58 2024 +0200

    Fixed style on navbar, gameinfo, about and made it more functional

[33mcommit 741b1282c44f6ccfe84623ef3cb5877f97393477[m[33m ([m[1;31morigin/google[m[33m)[m
Author: elan19 <elan19@github.com>
Date:   Wed Jul 17 19:18:36 2024 +0200

    Fixed mobile styling

[33mcommit 354de1432c848fee2134cc79a964673d767daf10[m
Author: elan19 <elan19@github.com>
Date:   Sat Jun 22 10:41:15 2024 +0200

    First commit
