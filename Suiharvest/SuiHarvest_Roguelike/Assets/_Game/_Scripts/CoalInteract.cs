using UnityEngine;

public class CoalInteract : MonoBehaviour, IInteractable
{
    public void Interact()
    {
        // Gọi bảng hội thoại thường
        DialogManager.instance.ShowDialog("The Coal", "WARNING: Mining Zone Ahead.");
    }
}