import { useEffect, useRef } from 'react';
import styles from './UnityGame.module.css';

interface UnityGameProps {
  walletAddress: string;
  activeSession: any;
  onGameAction?: (action: string, data: any) => void;
}

export function UnityGame({ walletAddress, activeSession, onGameAction }: UnityGameProps) {
  const unityContainerRef = useRef<HTMLDivElement>(null);
  const unityInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Check if Unity build exists first
    const checkUnityBuild = async () => {
      try {
        const response = await fetch('/unity-build/Build/unity-build.loader.js', { method: 'HEAD' });
        if (!response.ok) {
          console.warn('[Unity] Build not found. Showing instructions...');
          showBuildInstructions();
          return;
        }
        loadUnityGame();
      } catch (error) {
        console.warn('[Unity] Unity build not available yet.');
        showBuildInstructions();
      }
    };

    checkUnityBuild();
  }, []);

  const showBuildInstructions = () => {
    if (unityContainerRef.current) {
      const placeholder = unityContainerRef.current.querySelector(`.${styles.loadingPlaceholder}`) as HTMLElement;
      if (placeholder) {
        placeholder.style.display = 'block';
      }
    }
  };

  const showBuildError = (message: string) => {
    if (unityContainerRef.current) {
      unityContainerRef.current.innerHTML = `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: white; padding: 20px; max-width: 500px;">
          <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
          <h3 style="color: #ff6b6b; margin-bottom: 12px;">Unity Build Error</h3>
          <p style="color: rgba(255,255,255,0.8); margin-bottom: 20px;">${message}</p>
          <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; text-align: left; font-size: 13px;">
            <p style="margin: 0 0 8px 0;"><strong>Cần làm:</strong></p>
            <ol style="margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Mở Unity project: <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">SuiHarvest_Roguelike</code></li>
              <li>Build Settings → WebGL → Switch Platform</li>
              <li>Player Settings → Publishing Settings → Compression Format: <strong>Brotli</strong></li>
              <li>Build to: <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">web_portal/public/unity-build/</code></li>
              <li>Đảm bảo có đủ 4 files: .loader.js, .data.br, .framework.js.br, .wasm.br</li>
              <li>Refresh browser sau khi build xong</li>
            </ol>
          </div>
          <p style="margin-top: 16px; font-size: 12px; color: rgba(255,255,255,0.6);">
            Xem <code>UNITY_INTEGRATION.md</code> để biết chi tiết
          </p>
        </div>
      `;
    }
  };

  // Load Unity WebGL build
  const loadUnityGame = async () => {
    if (!unityContainerRef.current) return;

    const buildUrl = '/unity-build';
    const loaderUrl = `${buildUrl}/Build/unity-build.loader.js`;
    
    // Try Gzip first (what user currently has), then Brotli
    const config = {
      dataUrl: `${buildUrl}/Build/unity-build.data.gz`,
      frameworkUrl: `${buildUrl}/Build/unity-build.framework.js.gz`,
      codeUrl: `${buildUrl}/Build/unity-build.wasm.gz`,
      streamingAssetsUrl: `${buildUrl}/StreamingAssets`,
      companyName: 'YourCompanyName',
      productName: 'SuiHarvest',
      productVersion: '1.0',
    };

    try {
      // Load Unity loader script
      const script = document.createElement('script');
      script.src = loaderUrl;
      script.async = true;
      
      script.onload = () => {
        // @ts-ignore - Unity loader is loaded globally
        if (window.createUnityInstance && unityContainerRef.current) {
          const canvas = document.createElement('canvas');
          canvas.id = 'unity-canvas';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          
          // Clear loading placeholder
          unityContainerRef.current.innerHTML = '';
          unityContainerRef.current.appendChild(canvas);
          
          // @ts-ignore
          window.createUnityInstance(canvas, config, (progress: number) => {
            console.log(`[Unity] Loading: ${(progress * 100).toFixed(0)}%`);
          }).then((unityInstance: any) => {
            unityInstanceRef.current = unityInstance;
            console.log('[Unity] Game loaded successfully');
            
            // Send initial data to Unity
            sendDataToUnity('SetWalletAddress', walletAddress);
            if (activeSession) {
              sendDataToUnity('UpdateGameState', JSON.stringify(activeSession));
            }
          }).catch((error: any) => {
            console.error('[Unity] Error loading Unity game:', error);
            showBuildError(`Unity build incomplete. Thiếu files: framework.js.gz và wasm.gz. 
            
Trong Unity Editor:
1. File → Build Settings → WebGL
2. Player Settings → Publishing Settings → Compression Format: Gzip
3. Player Settings → Other Settings → Enable Exceptions: None (nếu có lỗi thử "Explicitly Thrown")
4. Build lại hoàn toàn (đừng Cancel giữa chừng)
5. Đợi đến khi Console hiện "Build completed successfully"

Hiện tại Build/ folder chỉ có 2 files (cần 4 files):
✅ unity-build.loader.js
✅ unity-build.data.gz
❌ unity-build.framework.js.gz (thiếu)
❌ unity-build.wasm.gz (thiếu)`);
          });
        }
      };
      
      script.onerror = () => {
        console.error('[Unity] Failed to load Unity loader script');
        showBuildError('Failed to load Unity loader. Make sure Unity WebGL is built correctly.');
      };
      
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } catch (error) {
      console.error('[Unity] Error initializing Unity game:', error);
      showBuildError('Error initializing Unity game.');
    }
  };

  // Update Unity when session changes
  useEffect(() => {
    if (activeSession && unityInstanceRef.current) {
      sendDataToUnity('UpdateGameState', JSON.stringify(activeSession));
    }
  }, [activeSession]);

  const sendDataToUnity = (methodName: string, data: string) => {
    if (unityInstanceRef.current) {
      try {
        // Send message to Unity game
        // GameObject name should match your Unity GameObject that receives messages
        unityInstanceRef.current.SendMessage('GameBridge', methodName, data);
      } catch (error) {
        console.error('Error sending data to Unity:', error);
      }
    }
  };

  // Listen for messages from Unity
  useEffect(() => {
    const handleUnityMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'unity') {
        const { action, data } = event.data;
        console.log('Message from Unity:', action, data);
        
        // Forward Unity actions to parent component
        if (onGameAction) {
          onGameAction(action, data);
        }
      }
    };

    window.addEventListener('message', handleUnityMessage);
    
    return () => {
      window.removeEventListener('message', handleUnityMessage);
    };
  }, [onGameAction]);

  return (
    <div className={styles.unityGameContainer}>
      <div className={styles.unityWrapper} ref={unityContainerRef}>
        {/* Unity game will be loaded here */}
        <div className={styles.loadingPlaceholder}>
          <div className={styles.loadingSpinner}></div>
          <p>🎮 Loading Unity Game...</p>
          <small>Đang tải trò chơi...</small>
          <div className={styles.instructionsBox}>
            <h4>📝 Hướng dẫn tích hợp:</h4>
            <ol>
              <li>Build Unity WebGL project</li>
              <li>Copy build files vào <code>public/unity-build/</code></li>
              <li>Xem <code>UNITY_INTEGRATION.md</code> để biết chi tiết</li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className={styles.gameInfo}>
        <p>🎮 Unity Game - SuiHarvest Roguelike</p>
      </div>
    </div>
  );
}
