// 监听代理状态变化
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'proxyStatusChanged') {
    showNotification(request.enabled);
  }
});

function showNotification(enabled) {
  const notification = document.createElement('div');
  notification.textContent = `Proxy ${enabled ? 'Enabled' : 'Disabled'}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background: #333;
    color: white;
    border-radius: 5px;
    z-index: 9999;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
} 