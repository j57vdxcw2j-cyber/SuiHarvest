using UnityEngine;
using System;

/// <summary>
/// Bridge giữa Unity và Web Portal
/// Xử lý giao tiếp 2 chiều: Web ↔ Unity
/// </summary>
public class GameBridge : MonoBehaviour
{
    public static GameBridge instance;
    
    /// <summary>
    /// Gửi message lên Web Portal (không cần jslib)
    /// </summary>
    private static void SendMessageToWeb(string action, string data)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        string js = $@"
            window.parent.postMessage({{
                source: 'unity',
                action: '{action}',
                data: {data}
            }}, '*');
            console.log('[Unity → Web] {action}:', {data});
        ";
        Application.ExternalEval(js);
#else
        Debug.Log($"[GameBridge] Would send to web: {action} -> {data}");
#endif
    }

    [Header("Game State")]
    public string walletAddress = "";
    public int currentStamina = 50;
    public int maxStamina = 50;
    
    [Header("Inventory")]
    public int carrotCount = 0;
    public int potatoCount = 0;
    public int wheatCount = 0;
    public int woodCount = 0;
    public int stoneCount = 0;
    public int coalCount = 0;
    public int ironCount = 0;

    private GameStateData currentGameState;

    void Awake()
    {
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Start()
    {
        Debug.Log("[GameBridge] Initialized and ready");
        
        // Notify web that Unity is ready
        NotifyUnityReady();
    }

    #region Receive from Web
    
    /// <summary>
    /// Nhận wallet address từ web
    /// </summary>
    public void SetWalletAddress(string wallet)
    {
        Debug.Log($"[Web → Unity] Wallet Address: {wallet}");
        walletAddress = wallet;
        PlayerPrefs.SetString("WalletAddress", wallet);
        PlayerPrefs.Save();
    }

    /// <summary>
    /// Nhận game state từ web (session data)
    /// </summary>
    public void UpdateGameState(string jsonData)
    {
        Debug.Log($"[Web → Unity] Game State: {jsonData}");
        
        try
        {
            currentGameState = JsonUtility.FromJson<GameStateData>(jsonData);
            
            // Debug: Check if id is parsed
            Debug.Log($"[GameBridge] Parsed session ID: {currentGameState.id ?? "NULL"}");
            
            // Update stamina
            currentStamina = currentGameState.currentStamina;
            maxStamina = currentGameState.maxStamina;
            
            // Update inventory
            if (currentGameState.inventory != null)
            {
                carrotCount = currentGameState.inventory.carrot;
                potatoCount = currentGameState.inventory.potato;
                wheatCount = currentGameState.inventory.wheat;
                woodCount = currentGameState.inventory.wood;
                stoneCount = currentGameState.inventory.stone;
                coalCount = currentGameState.inventory.coal;
                ironCount = currentGameState.inventory.iron;
            }
            
            Debug.Log($"[GameBridge] State updated - Stamina: {currentStamina}/{maxStamina}");
        }
        catch (Exception e)
        {
            Debug.LogError($"[GameBridge] Failed to parse game state: {e.Message}");
        }
    }

    #endregion

    #region Send to Web

    /// <summary>
    /// Thông báo Unity đã sẵn sàng
    /// </summary>
    public static void NotifyUnityReady()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        string data = "{\"ready\":true}";
        SendMessageToWeb("unity_ready", data);
#else
        Debug.Log("[GameBridge] NotifyUnityReady (Editor mode - not sending to web)");
#endif
    }

    /// <summary>
    /// Thông báo đã thu thập resource
    /// </summary>
    public static void NotifyResourceGathered(string resourceType, int quantity)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        string data = $"{{\"resourceType\":\"{resourceType}\",\"quantity\":{quantity}}}";
        SendMessageToWeb("resource_gathered", data);
        Debug.Log($"[Unity → Web] Resource Gathered: {resourceType} x{quantity}");
#else
        Debug.Log($"[GameBridge] Resource Gathered: {resourceType} x{quantity} (Editor mode)");
#endif
        
        // Update local inventory
        if (instance != null)
        {
            instance.UpdateLocalInventory(resourceType, quantity);
        }
    }

    /// <summary>
    /// Thông báo stamina đã thay đổi
    /// </summary>
    public static void NotifyStaminaChanged(int current, int max)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        string data = $"{{\"current\":{current},\"max\":{max}}}";
        SendMessageToWeb("stamina_changed", data);
        Debug.Log($"[Unity → Web] Stamina: {current}/{max}");
#else
        Debug.Log($"[GameBridge] Stamina: {current}/{max} (Editor mode)");
#endif
    }

    /// <summary>
    /// Thông báo đã hoàn thành contract
    /// </summary>
    public static void NotifyContractCompleted(bool success)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        string data = $"{{\"success\":{success.ToString().ToLower()}}}";
        SendMessageToWeb("contract_completed", data);
        Debug.Log($"[Unity → Web] Contract Completed: {success}");
#else
        Debug.Log($"[GameBridge] Contract Completed: {success} (Editor mode)");
#endif
    }

    /// <summary>
    /// Thông báo ngày mới bắt đầu
    /// </summary>
    public static void NotifyDayStarted(int day)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        string data = $"{{\"day\":{day}}}";
        SendMessageToWeb("day_started", data);
        Debug.Log($"[Unity → Web] Day Started: {day}");
#else
        Debug.Log($"[GameBridge] Day Started: {day} (Editor mode)");
#endif
    }

    /// <summary>
    /// Thông báo người chơi click "What do you need?" trên NPC Trader
    /// → Mở rương gacha quest
    /// </summary>
    public static void NotifyTraderInteraction()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        string data = "{\"action\":\"open_quest_case\"}";
        SendMessageToWeb("trader_interaction", data);
        Debug.Log("[Unity → Web] Trader Interaction: Opening quest case");
#else
        Debug.Log("[GameBridge] Trader Interaction (Editor mode)");
#endif
    }

    #endregion

    #region Helper Methods

    private void UpdateLocalInventory(string resourceType, int quantity)
    {
        switch (resourceType.ToLower())
        {
            case "carrot":
                carrotCount += quantity;
                break;
            case "potato":
                potatoCount += quantity;
                break;
            case "wheat":
                wheatCount += quantity;
                break;
            case "wood":
                woodCount += quantity;
                break;
            case "stone":
                stoneCount += quantity;
                break;
            case "coal":
                coalCount += quantity;
                break;
            case "iron":
                ironCount += quantity;
                break;
        }
    }

    /// <summary>
    /// Sử dụng stamina (gọi khi player thực hiện action)
    /// </summary>
    public bool UseStamina(int amount)
    {
        if (currentStamina >= amount)
        {
            currentStamina -= amount;
            NotifyStaminaChanged(currentStamina, maxStamina);
            return true;
        }
        return false;
    }

    /// <summary>
    /// Kiểm tra có đủ stamina không
    /// </summary>
    public bool HasStamina(int amount)
    {
        return currentStamina >= amount;
    }

    #endregion
}

/// <summary>
/// Data structure để parse JSON từ web
/// </summary>
[Serializable]
public class GameStateData
{
    public string id;
    public int currentStamina;
    public int maxStamina;
    public InventoryData inventory;
    public ContractData contract;
}

[Serializable]
public class InventoryData
{
    public int carrot;
    public int potato;
    public int wheat;
    public int wood;
    public int stone;
    public int coal;
    public int iron;
}

[Serializable]
public class ContractData
{
    public string difficulty;
    public string description;
}
