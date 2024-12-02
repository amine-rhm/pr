
// export const storeToken = (token : string) => {
//     const timestamp = new Date().getTime();
//     localStorage.setItem('token', token);
//     localStorage.setItem('tokenTimestamp', timestamp.toString());
//   };
//   export const checkTokenValidity = () => {

//     const token = localStorage.getItem('token');
//     const tokenTimestamp = localStorage.getItem('tokenTimestamp');
//     const currentTime = new Date().getTime();
  
//     if (token && tokenTimestamp) {
//       const tokenAge = currentTime - parseInt(tokenTimestamp);
//       const oneHour = 30000; // 1 hour in milliseconds
        
//       if (tokenAge > oneHour) {
//         localStorage.clear()
//         window.location.reload();
//       }
     
//     }
//   };
  