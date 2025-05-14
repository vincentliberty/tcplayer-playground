import React, { useState, useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";
import './App.css';
import fileIdDemo from './demos/tcplayer-vod-all.html';
import widevineDemo from './demos/tcplayer-vod-only-widevine.html';

console.log('demoContent', fileIdDemo);

const menuStructure = {
  '基础播放': {
    items: [
      'URL播放',
      'FileID播放',
      'HLS',
      'DASH',
      'FLV',
      'WebRTC',
      'AV1',
      'H265',
      '原生解码',
    ]
  },
  '播放控制': {
    items: [
      '自动播放',
      '循环播放',
      '倍速播放',
      '续播',
      'Seek',
      '禁止Seek',
      '多清晰度',
      '播放列表',
      '多实例',
    ]
  },
  '视频功能': {
    items: [
      '全屏/CSS全屏',
      '画面旋转',
      '画中画',
      '画面镜像',
      '填充模式',
      'ROI/SEI',
      '动态追帧',
      'AR',
    ]
  },
  '视频增强': {
    items: [
      '封面图',
      'Logo',
      '广告',
      '截图',
      '缩略图(外挂/云端)',
      '字幕(外挂/云端)',
      '弹幕',
      '多音轨',
      '进度条标记',
    ]
  },
  '直播功能': {
    items: [
      '时移(Delay/Event)',
      'WebRTC降级/自适应',
      'PDT',
    ]
  },
  '安全功能': {
    items: [
      'Widevine',
      'FairPlay',
      '私有加密',
      '动态水印/幽灵水印',
      '防资源嗅探',
      '防数据代理',
      'MSE劫持',
      '结构检查',
    ]
  },
  '用户体验': {
    items: [
      '自定义控制栏',
      'Custom UI',
      '试看',
      '多语言',
      '自定义文案',
      '错误回调',
      '重试机制',
    ]
  },
  '性能优化': {
    items: [
      '自适应码率(HLS/WebRTC)',
      'P2P(FLV/HLS/WebRTC)',
      '短视频优化',
    ]
  },
  '数据分析': {
    items: [
      '数据统计',
      '数据统计回调',
      '数据上报',
      '事件回调',
    ]
  }
};

function App() {
  const [code, setCode] = useState('');
  const [activeItem, setActiveItem] = useState('FileID播放');
  const editorRef = useRef(null);
  const previewRef = useRef(null);

  // 处理编辑器加载完成
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    // 手动触发一次布局更新
    setTimeout(() => {
      editor.layout();
    }, 0);
  };

  // 加载示例代码
  const loadDemoCode = (demoName) => {
    try {
      switch(demoName) {
        case 'FileID播放':
          setCode(fileIdDemo);
          break;
        case 'Widevine':
          setCode(widevineDemo);
          break;
        default:
          setCode('// 该示例正在开发中...');
      }
    } catch (error) {
      console.error('Failed to load demo:', error);
      setCode(`// 示例代码加载失败: ${error.message}`);
    }
  };

  // 处理菜单项点击
  const handleMenuItemClick = (itemName) => {
    setActiveItem(itemName);
    loadDemoCode(itemName);
  };

  // 初始加载
  useEffect(() => {
    loadDemoCode(activeItem);
  }, []);

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 更新预览
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.srcdoc = code;
    }
  }, [code]);

  // 预设的代码示例
  const codeExamples = {
    'url-play': `const player = new SuperPlayer({
    container: '#container',
});

player.play({
    url: 'https://example.com/video.mp4',
});

window.player = player;`,
    'vid-vod': `const player = new SuperPlayer({
    container: '#container',
});

player.play({
    vid: '4564972819220421305',
    playDefinition: '720P',
});`,
    'vid-live': `const player = new SuperPlayer({
    container: '#container',
    live: true,
});

player.play({
    vid: 'live-vid-123456',
});`,
    'webrtc': `const player = new SuperPlayer({
    container: '#container',
    live: true,
    webrtc: true,
});

player.play({
    url: 'webrtc://example.com/live/stream',
});`,
  };

  // 更新初始展开状态
  const [expandedGroups, setExpandedGroups] = useState({
    tcPlayer: true,            // 改为 tcPlayer
    '基础播放': true,
    '播放功能': false,
    '安全功能': false,
    '定制功能': false
  });

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <button className="menu-trigger">
            <span className="menu-icon"></span>
          </button>
          <div className="logo-section">
            <span className="logo-text">TCPlayer 播放器</span>
          </div>
        </div>
        <div className="header-right">
          {/* <div className="search-box">
            <input type="search" placeholder="搜索" />
          </div> */}
          <nav className="nav-links">
            <a href="#" className="nav-link">License 申请</a>
            <a href="#" className="nav-link">代码库</a>
            <a href="#" className="nav-link">提 issue</a>
            <a href="#" className="nav-link">文档</a>
          </nav>
          <button className="deploy-button">
            一键部署
          </button>
        </div>
      </header>
      <div className="main-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <div className="nav-group">
              <div 
                className="nav-group-header"
                onClick={() => toggleGroup('tcPlayer')}
              >
                <span>TCPlayer 示例</span>
                <span className={`arrow ${expandedGroups.tcPlayer ? 'expanded' : ''}`}></span>
              </div>
              
              {expandedGroups.tcPlayer && 
                Object.entries(menuStructure).map(([category, { items }]) => (
                  <div className="nav-subgroup" key={category}>
                    <div 
                      className="nav-subgroup-header"
                      onClick={() => toggleGroup(category)}
                    >
                      <span>{category}</span>
                      <span className={`arrow ${expandedGroups[category] ? 'expanded' : ''}`}></span>
                    </div>
                    {expandedGroups[category] && (
                      <ul className="nav-list">
                        {items.map((item) => (
                          <li 
                            key={item}
                            className={activeItem === item ? 'active' : ''}
                            onClick={() => handleMenuItemClick(item)}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              }
            </div>
          </nav>
        </aside>
        <main className="content">
          {/* <div className="editor-header">
            <div className="editor-tabs">
              <span className="tab active">Plugins</span>
              <span className="tab">控制栏</span>
              <span className="tab">右键菜单</span>
              <span className="tab">错误码</span>
              <span className="tab">错误页</span>
              <span className="tab">弹幕</span>
              <span className="tab">动态水印</span>
              <span className="tab">Loading</span>
            </div>
          </div> */}
          <div className="editor-container">
            <Editor
              height="100%"
              defaultLanguage="html"
              theme="light"
              value={code}
              onChange={(value) => setCode(value)}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                roundedSelection: false,
                cursorStyle: "line",
                automaticLayout: true,
                tabSize: 2,
                lineHeight: 21,
                validate: false,
                'semanticHighlighting.enabled': false,
                suggestOnTriggerCharacters: false,
                acceptSuggestionOnEnter: "off",
                quickSuggestions: false,
                quickSuggestionsDelay: 10000,
                parameterHints: { enabled: false },
                diagnostics: { enabled: false },
              }}
            />
          </div>
        </main>        
        <aside className="preview">
          <div className="preview-container">
            <iframe
              ref={previewRef}
              className="preview-iframe"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          <div className="preview-docs">
            <h3>说明文档</h3>
            <div className="preview-docs-content">
              这里是示例说明文档内容...
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
