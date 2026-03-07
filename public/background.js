const KEY = 'key';

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === 'GET_STORAGE') {
    chrome.storage.local.get(KEY).then((result) => {
      sendResponse(result[KEY]);
    });
    return true;
  }

  chrome.storage.local.set({ [KEY]: message.data }).then(() => {
    sendResponse(true);
  });
  return true;
});
