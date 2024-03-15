"use client";
import Deso from "deso-protocol";

class DesoAPI {
  private client: Deso;

  constructor() {
    this.client = null as any; // You can initialize it with null or instantiate it with a Deso object
  }

  // Login To DeSo
  async login() {
    await this.getClient().identity.login("3");
  }

  // Get Unread Notifications

  async getUnreadNotifications(PublicKeyBase58Check: string) {
    if (!PublicKeyBase58Check) {
      console.log("User is required");
      return;
    }
    try {
      const request = {
        PublicKeyBase58Check: PublicKeyBase58Check,
      };
      const response =
        await this.getClient().notification.getUnreadNotificationsCount(
          request
        );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Search usernames by username prefix

  async searchUsername(prefix: string, num: any, user: any) {
    if (!user) return;
    try {
      const request = {
        UsernamePrefix: prefix,
        NumToFetch: num,
        ReaderPublicKeyBase58Check: user,
        ModerationType: "leaderboard",
        OrderBy: "influencer_coin_price",
      };
      const response = await this.getClient().user.getProfiles(request);
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Get posts for public key

  async getPostsForPublicKey(
    id: any,
    user: any,
    num: any,
    media: boolean,
    lastPost: any
  ) {
    if (!user) return;
    try {
      const request = {
        PublicKeyBase58Check: id,
        ReaderPublicKeyBase58Check: user,
        NumToFetch: num,
        MediaRequired: media,
        LastPostHashHex: lastPost || "",
      };
      const response = await this.getClient().posts.getPostsForPublicKey(
        request
      );
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Get profiles that are following user
  async getFollowers(user: string) {
    if (!user) return;

    try {
      const request = {
        Username: user,
        GetEntriesFollowingUsername: true,
      };
      const response = await this.getClient().social.getFollowsStateless(
        request
      );
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Get profiles that user is following

  async getFollowing(user: string) {
    if (!user) return;

    try {
      const request = {
        Username: user,
        GetEntriesFollowingUsername: false,
      };
      const response = await this.getClient().social.getFollowsStateless(
        request
      );
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Get current user's JWT
  async getJwt() {
    try {
      const response = await this.getClient().identity.getJwt();
      console.log(response);

      return response;
    } catch (error) {
      return;
    }
  }

  // Log Out
  async signOut(key: string) {
    const response = await this.getClient().identity.logout(key);
    localStorage.removeItem("token");
    localStorage.removeItem("deso_user_key");
    localStorage.removeItem("desoIdentityUsers");
    localStorage.removeItem("userInfo");
    return response;
  }

  // The user has seen his notifications
  async sawNotifications(user: string, index: any) {
    if (!user) return;

    const data = await this.getJwt();

    try {
      const request = {
        PublicKeyBase58Check: user,
        UnreadNotifications: 0,
        LastUnreadNotificationIndex: index,
        LastSeenIndex: index,
        JWT: data,
      };

      const response =
        await this.getClient().notification.setNotificationMetadata(request);

      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Get Single Post

  async getSinglePost(
    postHash: string,
    user: string,
    commentLimit = 25,
    commentOffset = 0,
    addGlobalFeedBool = false
  ) {
    let currentUser;
    if (!postHash) return;

    if (user) {
      currentUser = user;
    } else {
      currentUser = "";
    }

    const request = {
      PostHashHex: postHash,
      CommentLimit: commentLimit,
      CommentOffset: commentOffset,
      AddGlobalFeedBool: addGlobalFeedBool,
      ReaderPublicKeyBase58Check: currentUser,
    };
    try {
      const response = await this.getClient().posts.getSinglePost(request);

      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /* ==== Get User Messages ==== */
  async getUserMessages(user: string) {
    if (!user) return;
    try {
      const endpoint =
        "https://node.deso.org/api/v0/get-all-user-message-threads";

      const response = fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserPublicKeyBase58Check: user,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          return data;
        })
        .catch((error) => console.error("Error:", error));

      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /* ======== Get Following Feed ========== */
  async getFollowingFeed(user: string, post: string) {
    if (!user) return;

    try {
      const request = {
        PostHashHex: post,
        ReaderPublicKeyBase58Check: user,
        GetPostsForFollowFeed: true,
        NumToFetch: 10,
      };
      const response = await this.getClient().posts.getPostsStateless(request);

      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  /* ======== Get Top Feed ========== */
  async getTopFeed(user: string, feed: any) {
    if (!user) return;

    try {
      const request = {
        ReaderPublicKeyBase58Check: user,
        SeenPosts: feed,
        ResponseLimit: 10,
      };
      const response = await this.getClient().posts.getHotFeed(request);

      return response.HotFeedPage;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  /* ==== Get User Notifications ===== */
  async getNotifications(
    user: string,
    NumToFetch: number,
    FetchStartIndex: number
  ) {
    if (!user) return;

    try {
      const request = {
        NumToFetch: NumToFetch,
        PublicKeyBase58Check: user,
        FetchStartIndex: FetchStartIndex,
        FilteredOutNotificationCategories: {},
      };
      const response = (await this?.getClient().notification.getNotifications(
        request
      )) as any;
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // Get Single User Profile

  async getSingleProfile(username: string) {
    if (!username) {
      console.log("Username  is required");
      return;
    }
    const request = {
      Username: username,
    };
    try {
      const response = await this.getClient().user.getSingleProfile(request);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Get Single User Profile From Key

  async getSingleProfileFK(key: string) {
    if (!key) return;

    const request = {
      PublicKeyBase58Check: key,
    };
    try {
      const response = await this.getClient().user.getSingleProfile(request);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Follow/unfollow user

  async followUser(Follower: string, Followed: string, IsUnfollow: boolean) {
    if (!Follower) return;

    if (!Followed) return;

    try {
      const request = {
        IsUnfollow: IsUnfollow,
        FollowedPublicKeyBase58Check: Followed,
        FollowerPublicKeyBase58Check: Follower,
        MinFeeRateNanosPerKB: 1000,
        TransactionFees: [],
      };

      const response = await this.getClient().social.createFollowTxnStateless(
        request
      );
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Check if a user is following another

  async checkFollowing(user: string, isFollowing: string) {
    if (!user) return;

    if (!isFollowing) return;

    try {
      const request = {
        PublicKeyBase58Check: user,
        IsFollowingPublicKeyBase58Check: isFollowing,
      };
      const response = await this.getClient().social.isFollowingPublicKey(
        request
      );
      return response;
    } catch (error) {
      return;
    }
  }

  // Get Single Profile Picture

  async getSingleProfilePicture(key: string) {
    if (!key) return;
    try {
      const response = await this.getClient().user.getSingleProfilePicture(key);
      return response;
    } catch (error) {
      return error;
    }
  }

  // Get Value of Deso

  async getDesoValue() {
    try {
      const response = await this.getClient().metaData.getExchangeRate();
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Update User Profile To Onboard Them

  async updateInfo(
    key: string,
    username: string,
    bio: string,
    fr: number,
    profile: string,
    food: string,
    location: string,
    website: string,
    display_name: string
  ) {
    if (!key) return;
    if (!username) return;

    try {
      // Initialize the request object with properties that are always present
      const request: any = {
        // Use 'any' type or define a specific interface/type for your request object
        ProfilePublicKeyBase58Check: "",
        UpdaterPublicKeyBase58Check: key,
        NewUsername: username,
        NewDescription: bio,
        NewCreatorBasisPoints: fr,
        MinFeeRateNanosPerKB: 1000,
        NewStakeMultipleBasisPoints: 12500,
        isHidden: false,
        ExtraData: {
          Food: food ? food : "",
          Location: location ? location : "",
          Website: website ? website : "",
          DisplayName: display_name,
          LargeProfilePicURL: "",
        },
      };

      // Conditionally add the profile picture if it is provided
      if (profile) {
        request.NewProfilePic = profile; // Assuming 'NewProfilePic' is the correct property name
      }

      console.log(request);
      const response = await this.getClient().social.updateProfile(request);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // Submit A Post To The DeSo Blockchain
  async submitPost(
    publickey: string,
    text: string,
    img: string[],
    video: string[],
    link: string,
    aiNote: string,
    filter: string,
    contentRecommendation: string
  ) {
    if (!publickey) return;

    const request = {
      UpdaterPublicKeyBase58Check: publickey,
      IsHidden: false,
      BodyObj: {
        Body: text,
        VideoURLs: video,
        ImageURLs: img,
      },
      PostExtraData: {
        App: "Eva",
        EmbedVideoURL: link,
        AINote: aiNote,
        Filter: filter,
        ContentRecommendation: contentRecommendation,
      },
    };

    try {
      // Assuming submitPost function is defined somewhere in your code
      const response = await this.getClient().posts.submitPost(request);
      return response;
    } catch (error) {
      return error;
    }
  }

  // Submit A Comment

  async submitComment(
    publickey: string,
    text: string,
    img: string[],
    video: string[],
    link: string,
    parentId: string
  ) {
    if (!publickey) return;

    const request = {
      UpdaterPublicKeyBase58Check: publickey,
      ParentStakeID: parentId,
      BodyObj: {
        Body: text,
        VideoURLs: video,
        ImageURLs: img,
      },
      PostExtraData: {
        App: "Eva",
        EmbedVideoURL: link,
      },
    };
    const response = await this.getClient().posts.submitPost(request);
    return response;
  }

  // Submit quote repost

  async submitRepost(
    publickey: string,
    text: string,
    img: string[],
    video: string[],
    link: string,
    parentId: string
  ) {
    if (!publickey) return;

    const request = {
      UpdaterPublicKeyBase58Check: publickey,
      BodyObj: {
        Body: text,
        VideoURLs: video,
        ImageURLs: img,
      },
      PostExtraData: {
        App: "Eva",
        EmbedVideoURL: link,
      },
      RepostedPostHashHex: parentId,
    };
    const response = await this.getClient().posts.submitPost(request);
    return response;
  }

  // Like a post
  async likeMessage(user: string, postHash: string, isUnlike: any) {
    if (!user) return;

    if (!postHash) return;

    try {
      const request = {
        ReaderPublicKeyBase58Check: user,
        LikedPostHashHex: postHash,
        MinFeeRateNanosPerKB: 1000,
        IsUnlike: isUnlike,
      };
      const response = await this.getClient().social.createLikeStateless(
        request
      );
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Block a user
  async blockPublicUser(user: string, blockedUser: string, Unblock: Boolean) {
    if (!user) return;

    if (!blockedUser) return;

    const data = await this.getJwt();

    try {
      const request = {
        PublicKeyBase58Check: user,
        JWT: data,
        BlockPublicKeyBase58Check: blockedUser,
        Unblock: Unblock as boolean,
      };
      const response = await this.getClient().user.blockPublicKey(request);
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Upload Image
  async uploadImage(user: string, JWT: string, base64: File) {
    if (!base64) return;
    const request = {
      UserPublicKeyBase58Check: user,
      JWT: JWT,
      file: base64,
    };
    const response = await this.getClient().media.uploadImage(request);
    return response;
  }

  // Hide Post
  async hidePost(postHash: string, key: string) {
    if (!postHash) return;

    try {
      const request = {
        UpdaterPublicKeyBase58Check: key,
        PostHashHexToModify: postHash,
        BodyObj: {
          Body: "This post has been deleted",
          VideoURLs: [],
          ImageURLs: [],
        },
        IsHidden: true,
      };
      const response = await this.getClient().posts.submitPost(request);
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Get User NFTS (memories)
  async getMemories(user: string) {
    if (!user) return;
    try {
      const request = {
        UserPublicKeyBase58Check: user,
        IsPending: false,
      };
      const response = await this.getClient().nft.getNftsForUser(request);
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Get NFTs for a user
  async getNFTForUser(key: string) {
    if (!key) return;
    try {
      const request = {
        UserPublicKeyBase58Check: key,
      };
      const response = await this.getClient().nft.getNftsForUser(request);
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  getClient() {
    if (this.client) return this.client;
    this.client = new Deso();
    return this.client;
  }
}

export default DesoAPI;
