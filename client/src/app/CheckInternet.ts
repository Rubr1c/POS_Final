const checkInternetConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); 

    await fetch("https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js", {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-cache",
    });

    clearTimeout(timeoutId); 
    return true; 
  } catch (error) {
    return false; 
  }
};

export default checkInternetConnection;
