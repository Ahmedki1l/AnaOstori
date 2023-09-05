// const uploadFile = (selectedFile) => {

//     const fileToBinary = (selectedFile  ) => {  return new Promise((resolve, reject) => {    const reader = new FileReader();    reader.onload = (event) => {      const binaryData = event.target.result;      resolve(binaryData);    };    reader.onerror = (error) => {      reject(error);    };    reader.readAsBinaryString(file);  });};
// const binaryData = await fileToBinary(selectedFile);
// axios.put(apiUrl, binaryData, {  headers: {    'Content-Type': 'application/octet-stream', // Set the content type as appropriate for your binary data  },})  .then((response) => {    // Handle the response from the server    console.log('PUT request successful', response.data);  })  .catch((error) => {    // Handle any errors that occur during the PUT request    console.error('PUT request error', error);  });

// }