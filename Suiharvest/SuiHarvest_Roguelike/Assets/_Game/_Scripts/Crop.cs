using UnityEngine;
using System.Collections;

public class Crop : MonoBehaviour, IInteractable
{
    [Header("Tên Cây")]
    public string cropName = "Carrot"; // Nhớ điền tên (Carrot, Potato...)

    // Biến để tránh thu hoạch 2 lần
    private bool isHarvested = false;

    void Start()
    {
        // Đăng ký với TimeManager để sáng hôm sau được hồi sinh
        if (TimeManager.instance != null)
        {
            TimeManager.instance.RegisterCrop(this);
        }
    }

    public void Interact()
    {
        // Thêm dòng này: Nếu đã thu hoạch rồi thì không làm gì cả (Để biến isHarvested được sử dụng)
        if (isHarvested) return;

        // Kiểm tra và trừ stamina (Farming cost: 2)
        if (GameBridge.instance != null)
        {
            if (!GameBridge.instance.HasStamina(2))
            {
                if (DialogManager.instance != null)
                {
                    DialogManager.instance.ShowItemNotification("⚠️ Not enough stamina! Need 2");
                }
                return; // Không đủ stamina
            }
            GameBridge.instance.UseStamina(2);
        }

        // Không cần kiểm tra giai đoạn gì cả
        // Cứ bấm E là thu hoạch luôn
        Harvest();
    }

    void Harvest()
    {
        isHarvested = true;

        // Hiện thông báo "+1 ..."
        if (DialogManager.instance != null)
        {
            DialogManager.instance.ShowItemNotification("+1 " + cropName);
        }

        // Gửi thông báo lên web portal
        GameBridge.NotifyResourceGathered(cropName, 1);

        // Tắt cây đi (Biến mất)
        gameObject.SetActive(false);
    }

    // --- HÀM HỒI SINH (TimeManager sẽ gọi cái này khi ngủ) ---
    public void Regrow()
    {
        // Đơn giản là bật nó hiện lên lại thôi
        isHarvested = false;
        gameObject.SetActive(true);
    }
}