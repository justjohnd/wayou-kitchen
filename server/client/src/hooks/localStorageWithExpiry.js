// These functions will set an expiration on any local storage item. Note that it is being used to check for authToken, but not the authId. authId will persist in local storage, but is not used to access any parts of the site. It is only used to store the user ID.

export function setWithExpiry(key, value) {
  const now = new Date();
  //Expiry hardcoded to 180minutes to match backend session expiry
  const ttl = 180 * 60000;

  // `item` is an object which contains the original value as well as the time when it's supposed to expire
  // window.localStorage object can only store strings as values
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}
