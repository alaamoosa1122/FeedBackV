const initialState = {
    user: null, // or set a default user object if you want
  };
  
  function usersReducer(state = initialState, action) {
    switch (action.type) {
      // Add your user-related actions here
      default:
        return state;
    }
  }
  
  export default usersReducer;