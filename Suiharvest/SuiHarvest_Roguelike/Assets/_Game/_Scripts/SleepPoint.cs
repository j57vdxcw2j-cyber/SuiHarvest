using UnityEngine;

public class SleepPoint : MonoBehaviour, IInteractable
{
    public void Interact()
    {
        DialogManager.instance.ShowChoiceDialog(
            "Home",
            "Do you want to sleep until morning?",
            () => { TimeManager.instance.SleepAndNextDay(); }, // Hành động Yes
            () => { }, // Hành động No (Không làm gì)
            transform, // Vị trí cái nhà
            "Yes",     // <--- Chữ nút trái
            "No"       // <--- Chữ nút phải
        );
    }
}