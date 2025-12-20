using UnityEngine;
using TMPro;

/// <summary>
/// Quản lý toàn bộ game state, UI, và tương tác với web
/// </summary>
public class GameManager : MonoBehaviour
{
    public static GameManager instance;

    [Header("UI References")]
    public TextMeshProUGUI staminaText;
    public TextMeshProUGUI walletText;
    public TextMeshProUGUI inventoryText;
    
    [Header("Stamina Costs")]
    public int farmStaminaCost = 2;
    public int chopWoodStaminaCost = 6;
    public int mineStaminaCost = 8;

    private void Awake()
    {
        if (instance == null)
        {
            instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void Start()
    {
        UpdateUI();
    }

    private void Update()
    {
        // Update UI every frame
        UpdateUI();
    }

    public void UpdateUI()
    {
        if (GameBridge.instance == null) return;

        // Update stamina display
        if (staminaText != null)
        {
            staminaText.text = $"⚡ Stamina: {GameBridge.instance.currentStamina}/{GameBridge.instance.maxStamina}";
        }

        // Update wallet display
        if (walletText != null)
        {
            string wallet = GameBridge.instance.walletAddress;
            if (!string.IsNullOrEmpty(wallet))
            {
                walletText.text = $"Wallet: {wallet.Substring(0, 6)}...{wallet.Substring(wallet.Length - 4)}";
            }
            else
            {
                walletText.text = "Wallet: Not Connected";
            }
        }

        // Update inventory display
        if (inventoryText != null)
        {
            inventoryText.text = $"🎒 Inventory:\n" +
                $"Carrot: {GameBridge.instance.carrotCount}\n" +
                $"Potato: {GameBridge.instance.potatoCount}\n" +
                $"Wheat: {GameBridge.instance.wheatCount}\n" +
                $"Wood: {GameBridge.instance.woodCount}\n" +
                $"Stone: {GameBridge.instance.stoneCount}\n" +
                $"Coal: {GameBridge.instance.coalCount}\n" +
                $"Iron: {GameBridge.instance.ironCount}";
        }
    }

    /// <summary>
    /// Kiểm tra và sử dụng stamina cho action
    /// </summary>
    public bool TryUseStamina(int amount, string actionName)
    {
        if (GameBridge.instance == null)
        {
            Debug.LogWarning("[GameManager] GameBridge not found!");
            return false;
        }

        if (!GameBridge.instance.HasStamina(amount))
        {
            ShowNotification($"⚠️ Not enough stamina! Need {amount}");
            return false;
        }

        bool success = GameBridge.instance.UseStamina(amount);
        if (success)
        {
            Debug.Log($"[GameManager] Used {amount} stamina for {actionName}");
        }
        return success;
    }

    /// <summary>
    /// Hiển thị thông báo tạm thời
    /// </summary>
    public void ShowNotification(string message)
    {
        if (DialogManager.instance != null)
        {
            DialogManager.instance.ShowItemNotification(message);
        }
        else
        {
            Debug.Log($"[Notification] {message}");
        }
    }

    /// <summary>
    /// Debug function to test web communication
    /// </summary>
    [ContextMenu("Test Send Resource")]
    public void TestSendResource()
    {
        GameBridge.NotifyResourceGathered("wood", 5);
    }

    [ContextMenu("Test Send Stamina")]
    public void TestSendStamina()
    {
        GameBridge.NotifyStaminaChanged(30, 50);
    }
}
