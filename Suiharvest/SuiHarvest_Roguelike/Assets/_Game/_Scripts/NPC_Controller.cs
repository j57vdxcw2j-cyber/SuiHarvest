using UnityEngine;

public class NPC_Controller : MonoBehaviour, IInteractable
{
    [Header("Thông tin NPC")]
    public string npcName = "The Trader";
    [TextArea] public string content = "Hello traveler!";

    [Header("Loại hội thoại")]
    public bool hasChoices = false; // Tích vào nếu là Trader (có Yes/No)

    public void Interact()
    {
        if (hasChoices)
        {
            // NPC Trader: Có lựa chọn
            DialogManager.instance.ShowChoiceDialog(
                npcName,
                content,
                () => { 
                    Debug.Log("Accepted Quest!");
                    Debug.Log("[NPC_Controller] Calling GameBridge.NotifyTraderInteraction()...");
                    // Thông báo lên Web Portal để mở gacha và trả 0.75 SUI
                    GameBridge.NotifyTraderInteraction();
                    Debug.Log("[NPC_Controller] GameBridge.NotifyTraderInteraction() called!");
                },
                () => { Debug.Log("Refused Quest!"); },
                transform,
                "What do you need?", // <--- Chữ nút trái cho Trader
                "Not interested."    // <--- Chữ nút phải cho Trader
            );
        }
        else
        {
            // NPC Than / Lửa: Chỉ nói chuyện bình thường
            DialogManager.instance.ShowDialog(
                npcName,
                content,
                transform
            );
        }
    }
}