using UnityEngine;
using System.Collections;

public class ResourceObject : MonoBehaviour, IInteractable
{
    public enum ResourceType { Ore, Tree }

    [Header("Cài Đặt Chung")]
    public ResourceType resourceType;
    public string dropItemName;
    public int totalHits = 4;

    [Header("Dành Cho QUẶNG")]
    public Sprite[] damageSprites;

    [Header("Dành Cho CÂY")]
    public GameObject treeTopObject;

    // Biến nội bộ
    private int currentHits = 0;
    private SpriteRenderer sr;
    private BoxCollider2D interactCollider;
    private Sprite originalSprite; // Lưu hình gốc (lúc chưa nứt)

    void Start()
    {
        sr = GetComponent<SpriteRenderer>();
        originalSprite = sr.sprite; // Nhớ lại hình dáng ban đầu

        BoxCollider2D[] cols = GetComponents<BoxCollider2D>();
        foreach (var c in cols)
        {
            if (c.isTrigger) interactCollider = c;
        }

        // --- MỚI: Tự đăng ký với TimeManager ---
        if (TimeManager.instance != null)
        {
            TimeManager.instance.RegisterResource(this);
        }
    }

    public void Interact()
    {
        if (currentHits >= totalHits) return;

        // Kiểm tra và trừ stamina
        int staminaCost = (resourceType == ResourceType.Tree) ? 6 : 8; // Chặt gỗ: 6, Đào đá: 8
        
        // Kiểm tra GameBridge stamina (không cần GameManager)
        if (GameBridge.instance != null)
        {
            if (!GameBridge.instance.HasStamina(staminaCost))
            {
                if (DialogManager.instance != null)
                {
                    string actionName = (resourceType == ResourceType.Tree) ? "Chop Wood" : "Mine Ore";
                    DialogManager.instance.ShowItemNotification($"⚠️ Not enough stamina! Need {staminaCost}");
                }
                return; // Không đủ stamina
            }
            GameBridge.instance.UseStamina(staminaCost);
        }

        currentHits++;

        // Logic Quặng (Đổi hình)
        if (resourceType == ResourceType.Ore && damageSprites.Length > 0)
        {
            int spriteIndex = currentHits - 1;
            if (spriteIndex < damageSprites.Length)
            {
                sr.sprite = damageSprites[spriteIndex];
            }
        }

        // Logic Cây (Rung)
        if (resourceType == ResourceType.Tree)
        {
            StartCoroutine(ShakeEffect());
        }

        if (currentHits >= totalHits)
        {
            Harvest();
        }
    }

    void Harvest()
    {
        if (DialogManager.instance != null)
        {
            DialogManager.instance.ShowItemNotification("+1 " + dropItemName);
        }

        // Gửi thông báo lên web portal
        GameBridge.NotifyResourceGathered(dropItemName, 1);

        if (resourceType == ResourceType.Ore)
        {
            gameObject.SetActive(false); // Quặng biến mất
        }
        else if (resourceType == ResourceType.Tree)
        {
            if (treeTopObject != null) treeTopObject.SetActive(false); // Cây mất ngọn
            if (interactCollider != null) interactCollider.enabled = false;
        }
    }

    // --- MỚI: Hàm hồi phục (Gọi bởi TimeManager khi ngủ) ---
    public void RespawnResource()
    {
        currentHits = 0; // Reset số lần đập
        gameObject.SetActive(true); // Hiện lại (nếu là quặng)

        if (resourceType == ResourceType.Ore)
        {
            sr.sprite = originalSprite; // Trả lại hình nguyên vẹn
        }
        else if (resourceType == ResourceType.Tree)
        {
            if (treeTopObject != null) treeTopObject.SetActive(true); // Cây mọc lại ngọn
            if (interactCollider != null) interactCollider.enabled = true; // Cho phép chặt lại
        }
    }

    IEnumerator ShakeEffect()
    {
        Vector3 originalPos = transform.localPosition;
        float timer = 0;
        while (timer < 0.1f)
        {
            transform.localPosition = originalPos + (Vector3)Random.insideUnitCircle * 0.05f;
            timer += Time.deltaTime;
            yield return null;
        }
        transform.localPosition = originalPos;
    }
}