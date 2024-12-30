document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('proxyToggle');
  const statusText = document.getElementById('statusText');
  
  // 获取当前状态
  const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
  toggle.checked = response.status;
  statusText.textContent = `Proxy ${response.status ? 'Enabled' : 'Disabled'}`;
  
  // 监听切换事件
  toggle.addEventListener('change', () => {
    chrome.runtime.sendMessage({ action: 'toggleProxy' });
    statusText.textContent = `Proxy ${toggle.checked ? 'Enabled' : 'Disabled'}`;
    // 关闭弹出窗口
    window.close();
  });
}); 