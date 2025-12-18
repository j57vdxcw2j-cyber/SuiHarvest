using UnityEngine;
using System.Collections; // Cần cái này để dùng Coroutine

public class CampfireInteract : MonoBehaviour, IInteractable
{
    public void Interact()
    {
        StartCoroutine(PlayDialogSequence());
    }

    IEnumerator PlayDialogSequence()
    {
        // Bước 1: Player tự nói
        DialogManager.instance.ShowDialog("Player", "It's always hot near the embers.");

        // Bước 2: Chờ 3 giây
        yield return new WaitForSeconds(3f);

        // Bước 3: Đống lửa đáp lại
        DialogManager.instance.ShowDialog("Campfire", "Don't get too close. I'm blazing hot!");
    }
}