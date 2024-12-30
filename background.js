const defaultSettings = {
  proxyEnabled: false,
  proxyServer: '127.0.0.1',
  proxyPort: '7890'
};

// 获取代理状态
async function getProxyStatus() {
  const result = await chrome.storage.local.get('proxyEnabled');
  return result.proxyEnabled ?? defaultSettings.proxyEnabled;
}

// 应用代理设置
async function applyProxySettings(enabled) {
  if (enabled) {
    await chrome.proxy.settings.set({
      value: {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: "http",
            host: defaultSettings.proxyServer,
            port: parseInt(defaultSettings.proxyPort)
          }
        }
      },
      scope: "regular"
    });
  } else {
    await chrome.proxy.settings.set({
      value: {
        mode: "direct"
      },
      scope: "regular"
    });
  }
  
  // 更新图标
  updateIcon(enabled);
}

// 更新扩展图标
function updateIcon(enabled) {
  const iconPath = enabled ? 'icons/icon48.png' : 'icons/icon48.png';
  chrome.action.setIcon({ path: iconPath });
}

// 切换代理状态
async function toggleProxy() {
  const currentStatus = await getProxyStatus();
  const newStatus = !currentStatus;
  
  await chrome.storage.local.set({ proxyEnabled: newStatus });
  await applyProxySettings(newStatus);
  
  // 发送通知
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Proxy Switcher',
    message: `Proxy ${newStatus ? 'Enabled' : 'Disabled'}`
  });

  // 刷新当前标签页
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleProxy') {
    toggleProxy();
  } else if (request.action === 'getStatus') {
    getProxyStatus().then(status => sendResponse({ status }));
    return true; // 保持消息通道打开以进行异步响应
  }
});

// 初始化
async function init() {
  const status = await getProxyStatus();
  await applyProxySettings(status);
}

init(); 