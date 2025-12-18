using UnityEngine;

public class TraderInteract : MonoBehaviour, IInteractable
{
    public void Interact()
    {
        // Gọi bảng hội thoại có Lựa Chọn
        DialogManager.instance.ShowChoiceDialog(
            "The Trader",
            "Greetings. Care to take on a request?",
            AcceptQuest, // Hàm chạy khi bấm Yes
            DeclineQuest // Hàm chạy khi bấm No
        );
    }

    void AcceptQuest()
    {
        Debug.Log("Quest Accepted!");
        // Ông có thể thêm code nhận nhiệm vụ ở đây sau này
        DialogManager.instance.ShowDialog("The Trader", "Excellent! I knew I could count on you.");
    }

    void DeclineQuest()
    {
        Debug.Log("Quest Declined.");
        DialogManager.instance.ShowDialog("The Trader", "What a pity. Come back if you change your mind.");
    }
}