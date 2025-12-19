using UnityEngine;

public class PlayerInteraction : MonoBehaviour
{
    [Header("Kéo cái InteractText vào đây")]
    public GameObject notificationText; // Biến chứa dòng chữ thông báo

    private GameObject currentInteractable = null;

    void Update()
    {
        // Khi bấm E
        if (Input.GetKeyDown(KeyCode.E) && currentInteractable != null)
        {
            IInteractable interactable = currentInteractable.GetComponent<IInteractable>();
            if (interactable != null)
            {
                interactable.Interact();

                // Ẩn dòng thông báo đi khi đang nói chuyện cho đỡ vướng
                if (notificationText != null)
                {
                    notificationText.SetActive(false);
                }
            }
        }
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Interactable"))
        {
            currentInteractable = other.gameObject;

            // BẬT thông báo lên
            if (notificationText != null)
            {
                notificationText.SetActive(true);
            }
        }
    }

    private void OnTriggerExit2D(Collider2D other)
    {
        if (other.CompareTag("Interactable"))
        {
            if (other.gameObject == currentInteractable)
            {
                currentInteractable = null;

                // TẮT thông báo đi
                if (notificationText != null)
                {
                    notificationText.SetActive(false);
                }

                // Tắt luôn bảng hội thoại nếu đang mở
                if (DialogManager.instance != null)
                {
                    DialogManager.instance.CloseDialog();
                }
            }
        }
    }
}