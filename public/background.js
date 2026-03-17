const KEY = 'storage_key';

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === 'GET_STORAGE') {
    chrome.storage.session.get(KEY).then((result) => {
      sendResponse(result[KEY]);
    });
    return true;
  }

  chrome.storage.session.set({ [KEY]: message.data }).then(() => {
    sendResponse(true);
  });
  return true;
});
