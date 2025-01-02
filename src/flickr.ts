// TODO:
// Stash the photos in window.localStorage or alt cache and check for them before calling this api...

const API_KEY = import.meta.env.VITE_FLICKR_API_KEY
const user_id = import.meta.env.VITE_FLICKR_USER_ID
const API_SECRET = import.meta.env.VITE_FLICKR_API_SECRET
const TOKEN = import.meta.env.VITE_FLICKR_ACCESS_TOKEN
const TOKEN_SECRET = import.meta.env.VITE_FLICKR_ACCESS_TOKEN_SECRET

const apiUrl = 'https://api.flickr.com/services/rest/';
const uploadUrl = 'https://up.flickr.com/services/upload/';

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


export async function getPhotos(tags: string, shuffle: boolean): Promise<any> {

    const params = new URLSearchParams({
        method: 'flickr.photos.search',
        api_key: API_KEY,
        user_id,
        tags, // A space-seperated list of tags to apply to the photo.
        per_page: '100',
        page: '1',
        extras: 'url_s, url_l', 
        format: 'json',
        nojsoncallback: '1', 
      });
    
    const url:string = `${apiUrl}?${params}`;
    
try {
    const response = await fetch(url)
    const data = await response.json();
    
    const photos = data.photos.photo
    if (shuffle) {
        shuffleArray(photos)
    }
    // console.log('Photo Response from Flickr: ', photos)
    return photos
} catch (error) {
    console.error(`error getting photos: ${error}`)
}
}
function generateUUID() {
    return crypto.randomUUID(); // UUID generation for oauth_nonce
 }
 
 // Function to generate the OAuth signature
 async function generateOAuthSignature(params: URLSearchParams, method: string, url: string): Promise<string> {
     const baseString = generateBaseString(params, method, url);
     const signingKey = `${encodeURIComponent(API_SECRET)}&${encodeURIComponent(TOKEN_SECRET)}`;
 
     // Use the Web Crypto API to generate the HMAC-SHA1 signature
     const encoder = new TextEncoder();
     const keyData = encoder.encode(signingKey);
     const baseStringData = encoder.encode(baseString);
 
     const signature = await crypto.subtle.importKey(
         "raw", keyData, { name: "HMAC", hash: { name: "SHA-1" } },
         false, ["sign"]
     ).then(key =>
         crypto.subtle.sign("HMAC", key, baseStringData)
     ).then(signatureBuffer =>
         Array.from(new Uint8Array(signatureBuffer)).map(byte =>
             byte.toString(16).padStart(2, '0')
         ).join('')
     );
 
     return signature;
 }
 
 // Function to generate the base string for OAuth
 function generateBaseString(params: URLSearchParams, method: string, url: string): string {
     // Sort the parameters alphabetically by key
     const sortedParams = new URLSearchParams([...params.entries()].sort());
 
     // Encode the base string
     const encodedParams = [...sortedParams.entries()].map(([key, value]) =>
         `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
     ).join('&');
 
     // Construct the base string in the proper format
     return `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(encodedParams)}`;
 }
 
 export async function uploadPhoto(file: File, title: string, description: string, tags: string[]): Promise<any> {
     const formData = new FormData();
     formData.append('photo', file);
     formData.append('title', title);
     formData.append('description', description);
     formData.append('tags', tags.join(' '));
     formData.append('is_public', '1');
 
     console.log("formData: ", formData)

     const params = new URLSearchParams({
         method: 'flickr.photos.upload',
         api_key: API_KEY,
         format: 'json',
         nojsoncallback: '1',
         oauth_nonce: generateUUID(),
         oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
         oauth_consumer_key: API_KEY,
         oauth_token: TOKEN,
         oauth_signature_method: 'HMAC-SHA1',
     });
 
     // Generate the OAuth signature
     const signature = await generateOAuthSignature(params, 'POST', uploadUrl);
     params.append('oauth_signature', signature);
     console.log('signature: ', signature)
 
     // Construct the full URL with the signature included
     const url = `${uploadUrl}?${params.toString()}`;
     console.log('url: ', url)
 
     // Send the POST request to upload the photo
     const response = await fetch(url, {
         method: 'POST',
         body: formData,
     });
 
     return response.text();
 }