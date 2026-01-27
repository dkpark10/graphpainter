// 확장 프로그램 아이콘 클릭 시 새 탭에서 열기
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
});
