export const FETCH_USER_FRIENDS_REQUEST = 'FETCH_USER_FRIENDS_REQUEST';
export const FETCH_USER_FRIENDS_SUCCESS = 'FETCH_USER_FRIENDS_SUCCESS';
export const FETCH_USER_FRIENDS_FAILURE = 'FETCH_USER_FRIENDS_FAILURE';
export const FETCH_USER_POSTS_REQUEST = 'FETCH_USER_POSTS_REQUEST';
export const FETCH_USER_POSTS_SUCCESS = 'FETCH_USER_POSTS_SUCCESS';
export const FETCH_USER_POSTS_FAILURE = 'FETCH_USER_POSTS_FAILURE';
export const FETCH_USER_PROFILE_REQUEST = 'FETCH_USER_PROFILE_REQUEST';
export const FETCH_USER_PROFILE_SUCCESS = 'FETCH_USER_PROFILE_SUCCESS';
export const FETCH_USER_PROFILE_FAILURE = 'FETCH_USER_PROFILE_FAILURE';
export const MARK_ALL_MESSAGES_AS_READ = 'MARK_ALL_MESSAGES_AS_READ';
export const MARK_ALL_NOTIFICATIONS_AS_READ = 'MARK_ALL_NOTIFICATIONS_AS_READ';
export const TOGGLE_FLYOUT = 'TOGGLE_FLYOUT';
export const VIEW_PROFILE_PAGE = 'VIEW_PROFILE_PAGE';

// FEED Actions
export const FETCH_USER_FEED = 'FETCH_USER_FEED';
export const FETCH_USER_FEED_SUCCESS = 'FETCH_USER_FEED_SUCCESS';
export const FETCH_USER_FEED_FAILURE = 'FETCH_USER_FEED_FAILURE';
export const UPDATE_ACTIVE_FEED = 'UPDATE_ACTIVE_FEED';
export const FETCH_RELATED_USER_FEED_LIST = 'FETCH_RELATED_USER_FEED_LIST';
export const FETCH_RELATED_USER_FEED_LIST_SUCCESS = 'FETCH_RELATED_USER_FEED_LIST_SUCCESS';
export const FETCH_RELATED_USER_FEED_LIST_FAILURE = 'FETCH_RELATED_USER_FEED_LIST_FAILURE';
export const FETCH_RELATED_USER_FEED = 'FETCH_RELATED_USER_FEED';
export const FETCH_RELATED_USER_FEED_SUCCESS = 'FETCH_RELATED_USER_FEED_SUCCESS';
export const FETCH_RELATED_USER_FEED_FAILURE = 'FETCH_RELATED_USER_FEED_FAILURE';
export const FETCH_USER_JOURNEY = 'FETCH_USER_JOURNEY';
export const FETCH_USER_JOURNEY_SUCCESS = 'FETCH_USER_JOURNEY_SUCCESS';
export const FETCH_USER_JOURNEY_FAILURE = 'FETCH_USER_JOURNEY_FAILURE';
export const FETCH_USER_TRAVEL = 'FETCH_USER_TRAVEL';
export const FETCH_USER_TRAVEL_SUCCESS = 'FETCH_USER_TRAVEL_SUCCESS';
export const FETCH_USER_TRAVEL_FAILURE = 'FETCH_USER_TRAVEL_FAILURE';
// MAP Actions
export const UPDATE_MAP = 'UPDATE_MAP';

// MOOD
export const CHANGE_MOOD = 'CHANGE_MOOD';
export const fetchUserFriendsRequest = () => ({
  type: FETCH_USER_FRIENDS_REQUEST,
});

export const fetchUserFriendsSuccess = ({ userId, friendIds, friendProfiles }) => ({
  type: FETCH_USER_FRIENDS_SUCCESS,
  userId,
  friendIds,
  friendProfiles,
});

export const fetchUserFriendsFailure = ({ error }) => ({
  type: FETCH_USER_FRIENDS_FAILURE,
  error,
});

export const fetchUserPostsRequest = () => ({
  type: FETCH_USER_POSTS_REQUEST,
});

export const fetchUserPostsSuccess = ({ posts }) => ({
  type: FETCH_USER_POSTS_SUCCESS,
  posts,
});

export const fetchUserPostsFailure = ({ error }) => ({
  type: FETCH_USER_POSTS_FAILURE,
  error,
});

export const fetchUserProfileRequest = () => ({
  type: FETCH_USER_PROFILE_REQUEST,
});

export const fetchUserProfileSuccess = ({ profile }) => ({
  type: FETCH_USER_PROFILE_SUCCESS,
  profile,
});

export const fetchUserProfileFailure = ({ error }) => ({
  type: FETCH_USER_PROFILE_FAILURE,
  error,
});

export const markAllMessagesAsRead = () => ({
  type: MARK_ALL_MESSAGES_AS_READ,
});

export const markAllNotificationsAsRead = () => ({
  type: MARK_ALL_NOTIFICATIONS_AS_READ,
});

export const toggleFlyout = flyout => ({
  type: TOGGLE_FLYOUT,
  flyout,
});

export const viewProfilePage = ({ userName }) => ({
  type: VIEW_PROFILE_PAGE,
  userName,
})

// FEED
export const fetchUserFeed = userId => ({
  type: FETCH_USER_FEED,
  userId
});
export const fetchUserFeedSuccess = parameters => ({
  type: FETCH_USER_FEED_SUCCESS,
  ...parameters
})
export const fetchUserFeedFailure = parameters => ({
  type: FETCH_USER_FEED_FAILURE,
  ...parameters
})
export const updateActiveFeed = payload => ({
  type: UPDATE_ACTIVE_FEED,
  payload
});
export const fetchRelatedUserFeedList = ({ userId, feedId }) => ({
  type: FETCH_RELATED_USER_FEED_LIST,
  ...{ userId, feedId }
})
export const fetchRelatedUserFeedListSuccess = payload => ({
  type: FETCH_RELATED_USER_FEED_LIST_SUCCESS,
  ...payload
});
export const fetchRelatedUserFeedListFailure = payload => ({
  type: FETCH_RELATED_USER_FEED_LIST_FAILURE,
  ...payload
});
export const fetchRelatedUserFeed = ({ userId, fotoId, feedId, originalFeedId }) => ({
  type: FETCH_RELATED_USER_FEED,
  ...{ userId, fotoId, feedId, originalFeedId }
})
export const fetchRelatedUserFeedSuccess = payload => ({
  type: FETCH_RELATED_USER_FEED_SUCCESS,
  ...payload
});
export const fetchRelatedUserFeedFailure = payload => ({
  type: FETCH_RELATED_USER_FEED_FAILURE,
  ...payload
});

export const fetchUserJourney = parameters => ({
  type: FETCH_USER_JOURNEY,
  ...parameters
});
export const fetchUserJourneySuccess = parameters => ({
  type: FETCH_USER_JOURNEY_SUCCESS,
  ...parameters
})
export const fetchUserJourneyFailure = parameters => ({
  type: FETCH_USER_JOURNEY_FAILURE,
  ...parameters
})
export const fetchUserTravel = userId => ({
  type: FETCH_USER_TRAVEL,
  userId
});
export const fetchUserTravelSuccess = parameters => ({
  type: FETCH_USER_TRAVEL_SUCCESS,
  ...parameters
})
export const fetchUserTravelFailure = parameters => ({
  type: FETCH_USER_TRAVEL_FAILURE,
  ...parameters
})

// MAP
export const updateMap = payload => ({
  type: UPDATE_MAP,
  payload
})

// MOOD
export const changeMood = mood => ({
  type: CHANGE_MOOD,
  mood
})




export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_OUT = 'LOG_OUT';
export const SAVE_RELEASE_BASIC_INFO = 'SAVE_RELEASE_BASIC_INFO';
export const UPDATE_NAV = 'UPDATE_NAV';
export const REMOVE_FROM_NAV = 'REMOVE_FROM_NAV';
export const DELETE_RELEASE = 'DELETE_RELEASE';
export const SAVE_TEST_CASE = 'SAVE_TEST_CASE';
export const DELETE_TEST_CASE = 'DELETE_TEST_CASE';
export const RELEASE_CHANGE = 'RELEASE_CHANGE';

export const logInRequest = payload => ({
  type: LOG_IN_REQUEST,
  payload,
});
export const logInSuccess = payload => ({
  type: LOG_IN_SUCCESS,
  payload
});
export const logInFailure = payload => ({
  type: LOG_IN_FAILURE,
  payload
});
export const logOut = () => ({
  type: LOG_OUT,
});

export const saveReleaseBasicInfo = payload => ({
  type: SAVE_RELEASE_BASIC_INFO,
  payload
});

export const updateNavBar = payload => ({
  type: UPDATE_NAV,
  payload
})
export const removeFromNavBar = payload => ({
  type: REMOVE_FROM_NAV,
  payload
});

export const deleteRelease = payload => ({
  type: DELETE_RELEASE,
  payload
});
export const saveTestCase = payload => ({
  type: SAVE_TEST_CASE,
  payload
});
export const deleteTestCase = payload => ({
  type: DELETE_TEST_CASE,
  payload
})
export const releaseChange = payload => ({
  type: RELEASE_CHANGE,
  payload
})